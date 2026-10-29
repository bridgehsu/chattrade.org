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

function resolveFile(pathname) {
  if (pathname === '/') return path.join(root, 'docs/index.md')
  const source = publicToSource.get(pathname)
  if (source) return path.join(root, 'docs', source)
  return path.join(root, 'docs', pathname.replace(/^\//, '') + '.md')
}

function checkLink(link, from) {
  if (!link || /^(https?:|mailto:)/.test(link)) return
  const [pathname, anchor] = link.split('#')
  const file = resolveFile(pathname)
  if (!fs.existsSync(file)) {
    errors.push(`${from}: missing ${link} (resolved ${path.relative(root, file)})`)
    return
  }
  if (anchor && !fs.readFileSync(file, 'utf8').includes(`{#${anchor}}`)) {
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
