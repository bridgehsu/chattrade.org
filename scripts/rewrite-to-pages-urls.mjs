/**
 * Rewrite English public links (/spot/overview) to /pages/0701 style,
 * using current content-map source paths + section/page numbers.
 */
import { readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const docs = join(root, 'docs')
const NUMBERED = /^(\d+)\.(.+)$/

async function listFiles(dir, pred) {
  const entries = await readdir(dir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    if (['.vitepress', 'assets', 'public', 'node_modules'].includes(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await listFiles(path, pred))
    else if (pred(entry.name, path)) out.push(path)
  }
  return out
}

async function main() {
  // Build englishPath -> pagesPath from filesystem numbering + old structure
  const oldStructure = JSON.parse(await readFile(join(docs, '.vitepress/structure.json'), 'utf8'))
  const replacements = new Map()

  for (const [source, publicMd] of Object.entries(oldStructure.rewrites || {})) {
    const [sectionDir, file] = source.split('/')
    const sectionNo = sectionDir.match(NUMBERED)?.[1]
    const pageNo = file.replace(/\.md$/, '').match(NUMBERED)?.[1]
    if (!sectionNo || !pageNo) continue
    const oldPath = `/${publicMd.replace(/\.md$/, '')}`
    const newPath = `/pages/${sectionNo}${pageNo}`
    replacements.set(oldPath, newPath)
  }

  // Also map any leftover numeric paths if present
  const sorted = [...replacements.entries()].sort((a, b) => b[0].length - a[0].length)
  console.log(`Rewriting ${sorted.length} public paths`)
  console.log(`Example: ${sorted.find(([k]) => k.includes('introduction/overview')) || sorted[0]}`)

  const targets = [
    join(docs, 'index.md'),
    join(docs, '.vitepress/config.mts'),
    join(docs, '.vitepress/theme/components/HomePage.vue'),
    join(root, 'README.md'),
    join(root, 'content-map.json'),
    join(docs, '.vitepress/navigation.json'),
    ...await listFiles(docs, (name) => name.endsWith('.md'))
  ]

  for (const file of targets) {
    if (!existsSync(file)) continue
    let text = await readFile(file, 'utf8')
    let next = text
    for (const [from, to] of sorted) next = next.split(from).join(to)
    if (next !== text) await writeFile(file, next)
  }

  // Remove English artifact directories under docs/
  const keep = new Set([
    'assets', 'public', '.vitepress', 'node_modules'
  ])
  const entries = await readdir(docs, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (keep.has(entry.name) || NUMBERED.test(entry.name) || entry.name === 'pages') continue
    // English slug dirs: introduction, spot, ...
    if (/^[a-z][a-z0-9-]*$/i.test(entry.name)) {
      await rm(join(docs, entry.name), { recursive: true, force: true })
      console.log(`removed docs/${entry.name}`)
    }
  }
}

await main()
