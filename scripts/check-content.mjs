import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const map = JSON.parse(fs.readFileSync(path.join(root, 'content-map.json'), 'utf8'))
const nav = JSON.parse(fs.readFileSync(path.join(root, 'docs/.vitepress/navigation.json'), 'utf8'))
const structure = JSON.parse(fs.readFileSync(path.join(root, 'docs/.vitepress/structure.json'), 'utf8'))

const publicToSource = new Map(
  (structure.pages || []).map((page) => [page.path, page.source])
)
for (const [source, publicMd] of Object.entries(structure.rewrites || {})) {
  publicToSource.set(`/${publicMd.replace(/\.md$/, '')}`, source)
}

let count = 0
const errors = []
const H2 = /^##\s+(.+?)\s*$/gm

function resolveFile(pathname) {
  if (pathname === '/') return path.join(root, 'docs/index.md')
  const source = publicToSource.get(pathname)
  if (source) return path.join(root, 'docs', source)
  return path.join(root, 'docs', pathname.replace(/^\//, '') + '.md')
}

/** Same rules as generate-structure / VitePress: {#id} or heading text. */
function headingIds(md) {
  const body = md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  const ids = new Set()
  for (const match of body.matchAll(H2)) {
    const raw = match[1]
    const custom = raw.match(/^(.*?)\s*\{#([a-zA-Z0-9_-]+)\}\s*$/)
    if (custom) ids.add(custom[2])
    else ids.add(raw.replace(/\s*\{#.*?\}\s*$/, '').trim())
  }
  return ids
}

function checkLink(link, from) {
  if (!link || /^(https?:|mailto:)/.test(link)) return
  const [pathname, rawAnchor] = link.split('#')
  const file = resolveFile(pathname)
  if (!fs.existsSync(file)) {
    errors.push(`${from}: missing ${link} (resolved ${path.relative(root, file)})`)
    return
  }
  if (!rawAnchor) return
  const anchor = decodeURIComponent(rawAnchor)
  const body = fs.readFileSync(file, 'utf8')
  if (body.includes(`{#${anchor}}`)) return
  if (!headingIds(body).has(anchor)) {
    errors.push(`${from}: missing anchor ${link}`)
  }
}

function walk(items) {
  for (const item of items) {
    if (item.link) {
      checkLink(item.link, 'navigation')
      count++
    }
    if (item.items) walk(item.items)
  }
}

walk(nav)

for (const page of map.pages) {
  const file = resolveFile(page.path)
  if (!fs.existsSync(file)) {
    errors.push(`${page.path}: missing source file`)
    continue
  }
  const body = fs.readFileSync(file, 'utf8')
  if (body.length < 250) errors.push(`${page.path}: article is too short`)
  if (/TODO|待补充|Lorem ipsum/i.test(body)) errors.push(`${page.path}: placeholder found`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`Verified ${map.pages.length} articles, ${map.sections.length} sections and ${count} navigation links / anchors.`)
