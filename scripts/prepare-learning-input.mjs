import { promises as fs } from 'node:fs'
import path from 'node:path'

const analysisFile = path.join(process.cwd(), '.lighthouseci', 'analysis', 'analysis.json')
const analysis = JSON.parse(await fs.readFile(analysisFile, 'utf8'))

for (const result of analysis.results || []) {
  result.sourceUrl = result.sourceUrl || result.url
  result.url = `surface://${encodeURIComponent(result.route)}`
}

analysis.learningIdentity = {
  version: 1,
  key: 'device-profile × normalized-route',
  note: 'Ephemeral localhost ports are excluded from persistent model identity.'
}

await fs.writeFile(analysisFile, JSON.stringify(analysis, null, 2))
console.log(`Normalized ${(analysis.results || []).length} learning surface identities`)
