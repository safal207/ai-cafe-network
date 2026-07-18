import { promises as fs } from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'

const root = process.cwd()
const profiles = ['mobile', 'desktop']
const outDir = path.join(root, '.lighthouseci', 'analysis')
const historyDir = path.join(root, '.lighthouse-history')
const historyFile = path.join(historyDir, 'history.jsonl')
const categories = ['performance', 'accessibility', 'best-practices', 'seo']
const metrics = {
  lcp: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  tbt: 'total-blocking-time',
  fcp: 'first-contentful-paint',
  speedIndex: 'speed-index'
}

const causeRules = [
  ['Render-blocking resources', ['render-blocking-resources', 'render-blocking-insight'], 'CSS or scripts delay the first visible render', 'FCP / LCP', 'Slower first impression'],
  ['Unused JavaScript', ['unused-javascript'], 'Extra code increases transfer, parse, and execution work', 'TBT / LCP', 'Delayed interaction readiness'],
  ['Unused CSS', ['unused-css-rules'], 'Extra styles increase transfer and style calculation', 'FCP / LCP', 'Delayed visual readiness'],
  ['Image delivery', ['modern-image-formats', 'uses-optimized-images', 'uses-responsive-images', 'offscreen-images', 'image-delivery-insight'], 'Oversized or inefficient images increase transfer and decode time', 'LCP', 'Hero content appears later'],
  ['Main-thread work', ['mainthread-work-breakdown', 'bootup-time', 'long-tasks'], 'Browser work blocks rendering or input handling', 'TBT / interaction risk', 'Controls can feel unresponsive'],
  ['Total transfer size', ['total-byte-weight'], 'Large page weight increases network and processing cost', 'FCP / LCP', 'Slower constrained-network loads'],
  ['DOM complexity', ['dom-size'], 'Large document trees increase style and layout work', 'TBT / CLS risk', 'Slower rendering and harder maintenance'],
  ['Layout instability', ['layout-shift-elements', 'cls-culprits-insight'], 'Elements move after initial render', 'CLS', 'Lost trust and accidental interaction risk']
]

const finite = (value) => Number.isFinite(value)
const round = (value, digits = 2) => finite(value) ? Number(value.toFixed(digits)) : null
const median = (values) => {
  const sorted = values.filter(finite).sort((a, b) => a - b)
  if (!sorted.length) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

async function files(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const result = []
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) result.push(...await files(full))
      else if (entry.name.endsWith('.json')) result.push(full)
    }
    return result
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

function route(url) {
  try {
    const pathname = new URL(url).pathname
    return pathname === '/' ? 'Landing page' : pathname.slice(1)
  } catch {
    return url || 'Unknown route'
  }
}

function savings(audit, field) {
  if (!audit) return 0
  const details = audit.details || {}
  if (field === 'ms') return details.overallSavingsMs || details.items?.reduce((sum, item) => sum + (item.wastedMs || 0), 0) || 0
  return details.overallSavingsBytes || details.items?.reduce((sum, item) => sum + (item.wastedBytes || 0), 0) || 0
}

function causes(lhr) {
  return causeRules.map(([label, ids, mechanism, metric, impact]) => {
    const audits = ids.map((id) => lhr.audits[id]).filter(Boolean)
    if (!audits.length) return null
    const ms = Math.max(0, ...audits.map((audit) => savings(audit, 'ms')))
    const bytes = Math.max(0, ...audits.map((audit) => savings(audit, 'bytes')))
    const observed = Math.max(0, ...audits.map((audit) => audit.numericValue || 0))
    const score = Math.min(...audits.map((audit) => finite(audit.score) ? audit.score : 1))
    const material = score < 0.9 || ms >= 50 || bytes >= 10000 || (label === 'Total transfer size' && observed >= 500000) || (label === 'Main-thread work' && observed >= 1000) || (label === 'DOM complexity' && observed >= 800)
    if (!material) return null
    return {
      label,
      mechanism,
      metric,
      impact,
      priority: round(Math.min(ms / 100, 20) + Math.min(bytes / 50000, 20) + Math.min(observed / 1000, 10) + Math.max(0, (1 - score) * 10), 1),
      savingsMs: round(ms, 0),
      savingsBytes: round(bytes, 0),
      observed: round(observed, 2)
    }
  }).filter(Boolean).sort((a, b) => b.priority - a.priority)
}

async function collect() {
  const runs = []
  for (const profile of profiles) {
    for (const file of await files(path.join(root, '.lighthouseci', profile))) {
      try {
        const raw = JSON.parse(await fs.readFile(file, 'utf8'))
        const lhr = raw.lhr || raw
        if (!lhr.categories || !lhr.audits) continue
        runs.push({
          profile,
          url: lhr.finalUrl || lhr.requestedUrl,
          route: route(lhr.finalUrl || lhr.requestedUrl),
          categories: Object.fromEntries(categories.map((key) => [key, round((lhr.categories[key]?.score || 0) * 100, 0)])),
          metrics: Object.fromEntries(Object.entries(metrics).map(([key, id]) => [key, round(lhr.audits[id]?.numericValue, key === 'cls' ? 3 : 0)])),
          causes: causes(lhr)
        })
      } catch (error) {
        console.warn(`Skipping ${file}: ${error.message}`)
      }
    }
  }
  if (!runs.length) throw new Error('No Lighthouse JSON reports found')

  const grouped = new Map()
  for (const run of runs) {
    const key = `${run.profile}::${run.url}`
    grouped.set(key, [...(grouped.get(key) || []), run])
  }

  return [...grouped.values()].map((group) => {
    const first = group[0]
    const causeMap = new Map()
    for (const run of group) for (const cause of run.causes) causeMap.set(cause.label, [...(causeMap.get(cause.label) || []), cause])
    return {
      profile: first.profile,
      url: first.url,
      route: first.route,
      runCount: group.length,
      categories: Object.fromEntries(categories.map((key) => [key, round(median(group.map((run) => run.categories[key])), 0)])),
      metrics: Object.fromEntries(Object.keys(metrics).map((key) => [key, round(median(group.map((run) => run.metrics[key])), key === 'cls' ? 3 : 0)])),
      causes: [...causeMap.entries()].map(([label, values]) => ({
        ...values[0],
        label,
        priority: round(median(values.map((value) => value.priority)), 1),
        savingsMs: round(median(values.map((value) => value.savingsMs)), 0),
        savingsBytes: round(median(values.map((value) => value.savingsBytes)), 0)
      })).sort((a, b) => b.priority - a.priority).slice(0, 6)
    }
  }).sort((a, b) => `${a.route}-${a.profile}`.localeCompare(`${b.route}-${b.profile}`))
}

function globalCauses(results) {
  const map = new Map()
  for (const result of results) for (const cause of result.causes) {
    const item = map.get(cause.label) || { ...cause, scopes: [], maxPriority: 0, savingsMs: 0, savingsBytes: 0 }
    item.scopes.push(`${result.route} · ${result.profile}`)
    item.maxPriority = Math.max(item.maxPriority, cause.priority || 0)
    item.savingsMs += cause.savingsMs || 0
    item.savingsBytes += cause.savingsBytes || 0
    map.set(cause.label, item)
  }
  return [...map.values()].map((item) => ({
    ...item,
    scopeCount: item.scopes.length,
    priority: round(item.maxPriority + Math.max(0, item.scopes.length - 1) * 2, 1)
  })).sort((a, b) => b.priority - a.priority).slice(0, 8)
}

async function history() {
  try {
    return (await fs.readFile(historyFile, 'utf8')).split('\n').filter(Boolean).map(JSON.parse)
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

const key = (result) => `${result.profile}::${result.url}`
const change = (now, before, lowerIsBetter = false, digits = 1) => {
  if (!finite(now) || !finite(before)) return null
  return round((now - before) * (lowerIsBetter ? -1 : 1), digits)
}
const fmtMs = (value) => finite(value) ? `${Math.round(value)} ms` : '—'
const fmtBytes = (value) => !finite(value) || value <= 0 ? '—' : value >= 1000000 ? `${(value / 1000000).toFixed(1)} MB` : `${Math.round(value / 1000)} KB`
const fmtDelta = (value, suffix = '') => !finite(value) ? '—' : `${value > 0 ? '↑' : value < 0 ? '↓' : '→'} ${value > 0 ? '+' : ''}${value}${suffix}`

function graph(items) {
  if (!items.length) return 'flowchart LR\n  A["No material cause detected"] --> B["Maintain current gates"]'
  const top = items.slice(0, 6)
  return [
    'flowchart LR',
    '  subgraph C[Root causes]',
    ...top.map((item, index) => `    C${index}["${item.label}<br/>Priority ${item.priority}"]`),
    '  end',
    '  subgraph M[Mechanisms]',
    ...top.map((item, index) => `    M${index}["${item.mechanism}"]`),
    '  end',
    '  subgraph K[Metrics]',
    ...top.map((item, index) => `    K${index}["${item.metric}"]`),
    '  end',
    '  subgraph U[User effects]',
    ...top.map((item, index) => `    U${index}["${item.impact}"]`),
    '  end',
    ...top.flatMap((_, index) => [`  C${index} --> M${index}`, `  M${index} --> K${index}`, `  K${index} --> U${index}`])
  ].join('\n')
}

function report(snapshot, baseline) {
  const previous = new Map((baseline?.results || []).map((result) => [key(result), result]))
  const trend = snapshot.results.map((result) => {
    const old = previous.get(key(result))
    return {
      result,
      delta: old ? {
        performance: change(result.categories.performance, old.categories.performance),
        accessibility: change(result.categories.accessibility, old.categories.accessibility),
        best: change(result.categories['best-practices'], old.categories['best-practices']),
        seo: change(result.categories.seo, old.categories.seo),
        lcp: change(result.metrics.lcp, old.metrics.lcp, true),
        cls: change(result.metrics.cls, old.metrics.cls, true, 3),
        tbt: change(result.metrics.tbt, old.metrics.tbt, true)
      } : null
    }
  })
  const causes = snapshot.globalCauses
  return [
    '# Lighthouse causal analysis', '',
    `**Commit:** \`${snapshot.commit}\`  `,
    `**Run:** ${snapshot.runId} · ${snapshot.eventName} · ${snapshot.refName}  `,
    `**Generated:** ${snapshot.generatedAt}`, '',
    '## Executive decision', '',
    causes.length ? `Fix **${causes[0].label}** first. It has the highest combined priority across ${causes[0].scopeCount} measured surface(s).` : 'No material root cause crossed the evidence thresholds.', '',
    'Priority combines time savings, byte savings, audit severity, observed browser cost, and affected surfaces.', '',
    '## Space matrix: route × device profile', '',
    '| Route | Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...snapshot.results.map((item) => `| ${item.route} | ${item.profile} | ${item.categories.performance} | ${item.categories.accessibility} | ${item.categories['best-practices']} | ${item.categories.seo} | ${fmtMs(item.metrics.lcp)} | ${item.metrics.cls ?? '—'} | ${fmtMs(item.metrics.tbt)} |`), '',
    '## Time dimension: change versus latest saved main baseline', '',
    baseline ? `Baseline: \`${baseline.commit}\` from ${baseline.generatedAt}. Positive values mean improvement.` : 'No previous main baseline exists yet; this run establishes it.', '',
    '| Route | Profile | Perf Δ | A11y Δ | Best Δ | SEO Δ | LCP improvement | CLS improvement | TBT improvement |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...trend.map(({ result, delta }) => `| ${result.route} | ${result.profile} | ${fmtDelta(delta?.performance)} | ${fmtDelta(delta?.accessibility)} | ${fmtDelta(delta?.best)} | ${fmtDelta(delta?.seo)} | ${fmtDelta(delta?.lcp, ' ms')} | ${fmtDelta(delta?.cls)} | ${fmtDelta(delta?.tbt, ' ms')} |`), '',
    '## Ranked root causes', '',
    '| Priority | Cause | Surfaces | Potential time | Potential bytes | Metric |',
    '|---:|---|---:|---:|---:|---|',
    ...(causes.length ? causes.map((item) => `| ${item.priority} | ${item.label} | ${item.scopeCount} | ${fmtMs(item.savingsMs)} | ${fmtBytes(item.savingsBytes)} | ${item.metric} |`) : ['| — | No material cause detected | — | — | — | — |']), '',
    '## Causal graph: cause → mechanism → metric → outcome', '', '```mermaid', graph(causes), '```', '',
    '## Interpretation policy', '',
    '1. Fix causes affecting multiple surfaces before isolated micro-optimizations.',
    '2. Prefer measured millisecond or byte savings over generic advice.',
    '3. Treat mobile regressions as higher risk.',
    '4. Use the time delta to separate persistent limitations from new regressions.',
    '5. Re-run after every fix; a cause is resolved only when its audit and metric both improve.', ''
  ].join('\n')
}

await fs.mkdir(outDir, { recursive: true })
await fs.mkdir(historyDir, { recursive: true })
const results = await collect()
const past = await history()
const baseline = [...past].reverse().find((entry) => entry.refName === 'main') || null
const snapshot = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || 'local',
  runId: process.env.GITHUB_RUN_ID || 'local',
  refName: process.env.GITHUB_REF_NAME || 'local',
  eventName: process.env.GITHUB_EVENT_NAME || 'local',
  results,
  globalCauses: globalCauses(results),
  dataQuality: {
    profiles: [...new Set(results.map((result) => result.profile))],
    routes: [...new Set(results.map((result) => result.route))],
    measuredSurfaces: results.length,
    expectedSurfaces: profiles.length * 2,
    hasPreviousBaseline: Boolean(baseline)
  }
}
await fs.writeFile(path.join(outDir, 'summary.md'), report(snapshot, baseline))
await fs.writeFile(path.join(outDir, 'analysis.json'), JSON.stringify({ ...snapshot, baseline: baseline ? { commit: baseline.commit, generatedAt: baseline.generatedAt } : null }, null, 2))
await fs.writeFile(path.join(outDir, 'causal-graph.mmd'), graph(snapshot.globalCauses))
await fs.appendFile(historyFile, `${JSON.stringify(snapshot)}\n`)
console.log(`Analyzed ${results.length} page/profile surfaces; top cause: ${snapshot.globalCauses[0]?.label || 'none'}`)
