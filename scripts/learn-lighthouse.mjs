import { promises as fs } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const analysisDir = path.join(root, '.lighthouseci', 'analysis')
const historyDir = path.join(root, '.lighthouse-history')
const analysisFile = path.join(analysisDir, 'analysis.json')
const modelFile = path.join(historyDir, 'model.json')
const maxSamples = 20

const definitions = {
  performance: { direction: 'higher', hard: { mobile: 75, desktop: 85 }, noise: 1.5, tolerance: 3, unit: 'score' },
  accessibility: { direction: 'higher', hard: { mobile: 90, desktop: 90 }, noise: 1, tolerance: 2, unit: 'score' },
  'best-practices': { direction: 'higher', hard: { mobile: 90, desktop: 90 }, noise: 1, tolerance: 2, unit: 'score' },
  seo: { direction: 'higher', hard: { mobile: 90, desktop: 90 }, noise: 1, tolerance: 2, unit: 'score' },
  lcp: { direction: 'lower', hard: { mobile: 4000, desktop: 2500 }, noise: 120, tolerance: 300, unit: 'ms' },
  cls: { direction: 'lower', hard: { mobile: 0.1, desktop: 0.1 }, noise: 0.01, tolerance: 0.02, unit: '' },
  tbt: { direction: 'lower', hard: { mobile: 600, desktop: 300 }, noise: 35, tolerance: 100, unit: 'ms' },
  fcp: { direction: 'lower', hard: { mobile: 3000, desktop: 1800 }, noise: 100, tolerance: 250, unit: 'ms' },
  speedIndex: { direction: 'lower', hard: { mobile: 5000, desktop: 3500 }, noise: 150, tolerance: 400, unit: 'ms' }
}

const finite = Number.isFinite
const round = (value, digits = 2) => finite(value) ? Number(value.toFixed(digits)) : null
const median = (values) => {
  const sorted = values.filter(finite).sort((a, b) => a - b)
  if (!sorted.length) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}
const mad = (values, center = median(values)) => finite(center)
  ? median(values.filter(finite).map((value) => Math.abs(value - center)))
  : null
const quantile = (values, q) => {
  const sorted = values.filter(finite).sort((a, b) => a - b)
  if (!sorted.length) return null
  const position = (sorted.length - 1) * q
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  return lower === upper
    ? sorted[lower]
    : sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower)
}
const slope = (values) => {
  const points = values.filter(finite)
  if (points.length < 3) return null
  const xMean = (points.length - 1) / 2
  const yMean = points.reduce((sum, value) => sum + value, 0) / points.length
  let numerator = 0
  let denominator = 0
  for (let index = 0; index < points.length; index += 1) {
    numerator += (index - xMean) * (points[index] - yMean)
    denominator += (index - xMean) ** 2
  }
  return denominator ? numerator / denominator : 0
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

function emptyModel() {
  return {
    schemaVersion: 1,
    updatedAt: null,
    totalMainRuns: 0,
    maxSamplesPerMeasure: maxSamples,
    surfaces: {},
    causes: {},
    activeCauses: []
  }
}

const surfaceKey = (result) => `${result.profile}::${result.url}`
const measures = (result) => ({ ...result.categories, ...result.metrics })
const confidence = (count) => count >= 10 ? 'mature' : count >= 5 ? 'active' : 'warming-up'

function boundary(samples, definition, profile) {
  const center = median(samples)
  const robustSigma = Math.max((mad(samples, center) || 0) * 1.4826, definition.noise)
  const allowedNoise = Math.max(robustSigma * 2.5, definition.tolerance)
  const hard = definition.hard[profile]
  const learned = definition.direction === 'higher'
    ? Math.max(hard, center - allowedNoise)
    : Math.min(hard, center + allowedNoise)
  const digits = definition.unit === '' ? 3 : 1
  return {
    expected: round(center, digits),
    sigma: round(robustSigma, digits),
    learned: round(learned, digits),
    p25: round(quantile(samples, 0.25), digits),
    p75: round(quantile(samples, 0.75), digits),
    trendPerRun: round(slope(samples.slice(-10)), definition.unit === '' ? 4 : 1)
  }
}

function evaluate(results, model) {
  const decisions = []
  for (const result of results) {
    const learnedSurface = model.surfaces[surfaceKey(result)]
    for (const [name, current] of Object.entries(measures(result))) {
      const definition = definitions[name]
      if (!definition || !finite(current)) continue
      const samples = learnedSurface?.measures?.[name]?.samples || []
      const state = confidence(samples.length)
      const stats = samples.length ? boundary(samples, definition, result.profile) : null
      const hardBoundary = definition.hard[result.profile]
      const hardViolation = definition.direction === 'higher'
        ? current < hardBoundary
        : current > hardBoundary
      const learnedViolation = state !== 'warming-up' && stats
        ? definition.direction === 'higher'
          ? current < stats.learned
          : current > stats.learned
        : false
      const drift = state !== 'warming-up' && stats && finite(stats.trendPerRun)
        ? definition.direction === 'higher'
          ? stats.trendPerRun < -definition.noise * 0.15
          : stats.trendPerRun > definition.noise * 0.15
        : false
      decisions.push({
        surface: `${result.route} · ${result.profile}`,
        surfaceKey: surfaceKey(result),
        measure: name,
        unit: definition.unit,
        current,
        expected: stats?.expected ?? null,
        learnedBoundary: stats?.learned ?? null,
        hardBoundary,
        robustSigma: stats?.sigma ?? null,
        trendPerRun: stats?.trendPerRun ?? null,
        sampleCount: samples.length,
        confidence: state,
        status: hardViolation
          ? 'hard-fail'
          : learnedViolation
            ? 'learned-fail'
            : drift
              ? 'drift-watch'
              : state === 'warming-up'
                ? 'learning'
                : 'pass'
      })
    }
  }
  return decisions
}

function updateModel(model, analysis) {
  const next = structuredClone(model)
  next.schemaVersion = 1
  next.updatedAt = analysis.generatedAt
  next.totalMainRuns = (next.totalMainRuns || 0) + 1
  next.maxSamplesPerMeasure = maxSamples
  next.surfaces ||= {}
  next.causes ||= {}

  for (const result of analysis.results) {
    const key = surfaceKey(result)
    const surface = next.surfaces[key] || {
      route: result.route,
      profile: result.profile,
      url: result.url,
      mainRuns: 0,
      measures: {}
    }
    surface.mainRuns += 1
    surface.lastSeenAt = analysis.generatedAt

    for (const [name, value] of Object.entries(measures(result))) {
      const definition = definitions[name]
      if (!definition || !finite(value)) continue
      const item = surface.measures[name] || { samples: [], best: null, last: null }
      item.samples = [...item.samples, value].slice(-maxSamples)
      item.last = value
      item.best = item.best === null
        ? value
        : definition.direction === 'higher'
          ? Math.max(item.best, value)
          : Math.min(item.best, value)
      const stats = boundary(item.samples, definition, result.profile)
      item.expected = stats.expected
      item.robustSigma = stats.sigma
      item.learnedBoundary = stats.learned
      item.trendPerRun = stats.trendPerRun
      item.confidence = confidence(item.samples.length)
      surface.measures[name] = item
    }
    next.surfaces[key] = surface
  }

  const currentCauses = analysis.globalCauses || []
  const currentLabels = new Set(currentCauses.map((cause) => cause.label))
  const previousLabels = new Set(next.activeCauses || [])
  const allLabels = new Set([...Object.keys(next.causes), ...currentLabels, ...previousLabels])

  for (const label of allLabels) {
    const current = currentCauses.find((cause) => cause.label === label)
    const item = next.causes[label] || {
      appearances: 0,
      resolutions: 0,
      recurrences: 0,
      consecutiveMainRuns: 0,
      mainRunsSeen: 0,
      averagePriority: 0,
      averageSavingsMs: 0,
      averageSavingsBytes: 0
    }
    item.mainRunsSeen += 1

    if (current) {
      if (!previousLabels.has(label) && item.appearances > 0) item.recurrences += 1
      item.appearances += 1
      item.consecutiveMainRuns = previousLabels.has(label) ? item.consecutiveMainRuns + 1 : 1
      item.lastSeenAt = analysis.generatedAt
      item.averagePriority = round(item.averagePriority + ((current.priority || 0) - item.averagePriority) / item.appearances, 2)
      item.averageSavingsMs = round(item.averageSavingsMs + ((current.savingsMs || 0) - item.averageSavingsMs) / item.appearances, 0)
      item.averageSavingsBytes = round(item.averageSavingsBytes + ((current.savingsBytes || 0) - item.averageSavingsBytes) / item.appearances, 0)
    } else {
      if (previousLabels.has(label)) {
        item.resolutions += 1
        item.lastResolvedAt = analysis.generatedAt
      }
      item.consecutiveMainRuns = 0
    }

    item.persistence = round(item.appearances / item.mainRunsSeen, 3)
    next.causes[label] = item
  }

  next.activeCauses = [...currentLabels]
  return next
}

const fmt = (value, unit) => !finite(value)
  ? '—'
  : unit === 'ms'
    ? `${Math.round(value)} ms`
    : unit
      ? `${value} ${unit}`
      : String(value)
const icon = (status) => status === 'pass'
  ? '✅'
  : status === 'learning'
    ? '🧠'
    : status === 'drift-watch'
      ? '⚠️'
      : '❌'

function summary(analysis, model, decisions, willLearn) {
  const failures = decisions.filter((item) => item.status === 'hard-fail' || item.status === 'learned-fail')
  const watches = decisions.filter((item) => item.status === 'drift-watch')
  const active = decisions.filter((item) => item.confidence !== 'warming-up')
  const persistentCauses = Object.entries(model.causes)
    .filter(([, item]) => item.appearances > 0)
    .sort(([, a], [, b]) => (b.persistence || 0) - (a.persistence || 0))
    .slice(0, 8)

  return [
    '# Self-learning Lighthouse model', '',
    `**Model memory:** ${model.totalMainRuns} accepted main run(s).`,
    `**Current run:** \`${analysis.commit}\` · ${analysis.eventName} · ${analysis.refName}.`,
    `This run ${willLearn ? '**will update**' : 'does **not update**'} the model.`, '',
    '> Only accepted pushes to `main` teach the model. Pull requests are evaluated without contaminating the baseline.', '',
    '## Decision', '',
    active.length
      ? failures.length
        ? `❌ Block: ${failures.length} hard or learned boundary/boundaries were crossed.`
        : `✅ Pass: all active measures are inside their learned noise-aware envelopes. ${watches.length} gradual drift watch(es).`
      : '🧠 Warm-up: collect 5 accepted main runs before adaptive gates can block a PR.',
    '',
    '## Learned space × time matrix', '',
    '| Status | Surface | Measure | Current | Expected | Learned gate | Hard gate | Samples | Confidence | Trend/run |',
    '|---|---|---|---:|---:|---:|---:|---:|---|---:|',
    ...decisions.map((item) => `| ${icon(item.status)} ${item.status} | ${item.surface} | ${item.measure} | ${fmt(item.current, item.unit)} | ${fmt(item.expected, item.unit)} | ${fmt(item.learnedBoundary, item.unit)} | ${fmt(item.hardBoundary, item.unit)} | ${item.sampleCount} | ${item.confidence} | ${fmt(item.trendPerRun, item.unit)} |`), '',
    '## Learned cause memory', '',
    ...(persistentCauses.length
      ? persistentCauses.map(([label, item]) => `- **${label}:** ${Math.round((item.persistence || 0) * 100)}% persistence · ${item.recurrences} recurrence(s) · ${item.resolutions} observed resolution(s) · average priority ${item.averagePriority}.`)
      : ['- No accepted cause history yet.']), '',
    '## Guardrails', '',
    '1. Warm-up: 0–4 samples. Active adaptive gates: 5–9. Mature model: 10+.',
    '2. Expected values use the rolling median of up to 20 accepted runs.',
    '3. Noise uses MAD (median absolute deviation), so one bad run cannot redefine normal.',
    '4. Learned gates can tighten expectations but can never weaken fixed hard thresholds.',
    '5. Slow deterioration is surfaced as drift before it becomes a hard regression.',
    '6. Cause persistence, recurrence, and observed resolution remain auditable in `model.json`.', ''
  ].join('\n')
}

await fs.mkdir(analysisDir, { recursive: true })
await fs.mkdir(historyDir, { recursive: true })

const analysis = await readJson(analysisFile, null)
if (!analysis) throw new Error(`Missing causal analysis at ${analysisFile}`)

const model = await readJson(modelFile, emptyModel())
const eventName = process.env.GITHUB_EVENT_NAME || analysis.eventName || 'local'
const refName = process.env.GITHUB_REF_NAME || analysis.refName || 'local'
const isPullRequest = eventName === 'pull_request'
const willLearn = eventName === 'push' && refName === 'main'
const decisions = evaluate(analysis.results, model)
const nextModel = willLearn ? updateModel(model, analysis) : model
const failures = decisions.filter((item) => item.status === 'hard-fail' || item.status === 'learned-fail')
const decision = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  commit: analysis.commit,
  eventName,
  refName,
  modelMainRuns: model.totalMainRuns,
  modelConfidence: confidence(model.totalMainRuns),
  willLearn,
  shouldBlock: isPullRequest && failures.length > 0,
  failures,
  driftWatches: decisions.filter((item) => item.status === 'drift-watch'),
  decisions
}

await fs.writeFile(path.join(analysisDir, 'learning-summary.md'), summary(analysis, model, decisions, willLearn))
await fs.writeFile(path.join(analysisDir, 'learning-decision.json'), JSON.stringify(decision, null, 2))
await fs.writeFile(path.join(analysisDir, 'learning-model-preview.json'), JSON.stringify(nextModel, null, 2))
if (willLearn) await fs.writeFile(modelFile, JSON.stringify(nextModel, null, 2))

console.log(`Learning model: ${model.totalMainRuns} accepted main run(s), ${failures.length} failure(s), ${decision.driftWatches.length} drift watch(es)`)
if (decision.shouldBlock) {
  console.error(`Adaptive Lighthouse gate blocked this PR: ${failures.map((item) => `${item.surface} ${item.measure}=${item.current}`).join('; ')}`)
  process.exitCode = 1
}
