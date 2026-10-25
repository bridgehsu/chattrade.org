import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
const map = JSON.parse(fs.readFileSync(path.join(root, 'content-map.json'), 'utf8'))
const nav = JSON.parse(fs.readFileSync(path.join(root, 'docs/.vitepress/navigation.json'), 'utf8'))
let count = 0
const errors = []
function checkLink(link, from) {
  if (!link || /^(https?:|mailto:)/.test(link)) return
  const [pathname, anchor] = link.split('#')
  const file = path.join(root, 'docs', pathname === '/' ? 'index.md' : pathname.replace(/^\//, '') + '.md')
  if (!fs.existsSync(file)) { errors.push(`${from}: missing ${link}`); return }
  if (anchor && !fs.readFileSync(file, 'utf8').includes(`{#${anchor}}`)) errors.push(`${from}: missing anchor ${link}`)
}
function walk(items) { for (const item of items) { if (item.link) {checkLink(item.link, 'navigation');count++} if (item.items) walk(item.items) } }
walk(nav)
for (const p of map.pages) {
  const file = path.join(root, 'docs', p.path.slice(1) + '.md')
  const body = fs.readFileSync(file, 'utf8')
  if (body.length < 250) errors.push(`${p.path}: article is too short`)
  if (/TODO|待补充|Lorem ipsum/i.test(body)) errors.push(`${p.path}: placeholder found`)
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log(`Verified ${map.pages.length} articles, ${map.sections.length} sections and ${count} navigation links / anchors.`)
