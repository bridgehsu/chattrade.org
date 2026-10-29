/**
 * Rebuild sidebar + rewrites from docs/NN.标题 trees only.
 * Does not inherit anchors/captions from previous navigation or content-map.
 * Public URL: /pages/{sectionNo}{pageNo}  e.g. 01.项目介绍/01.项目概述 → /pages/0101
 */
import { readdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const docs = join(root, 'docs')
const structurePath = join(docs, '.vitepress/structure.json')
const navPath = join(docs, '.vitepress/navigation.json')
const mapPath = join(root, 'content-map.json')
const NUMBERED = /^(\d+)\.(.+)$/

function stripNumber(name) {
  const m = name.match(NUMBERED)
  return m ? m[2] : name
}

async function main() {
  const sectionDirs = (await readdir(docs, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && NUMBERED.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => Number(a.match(NUMBERED)[1]) - Number(b.match(NUMBERED)[1]))

  const rewrites = {}
  const sidebar = []
  const pages = []

  for (const sectionDir of sectionDirs) {
    const sectionNo = sectionDir.match(NUMBERED)[1]
    const sectionTitle = stripNumber(sectionDir)
    const files = (await readdir(join(docs, sectionDir)))
      .filter((name) => name.endsWith('.md') && NUMBERED.test(name.slice(0, -3)))
      .sort((a, b) => Number(a.match(NUMBERED)[1]) - Number(b.match(NUMBERED)[1]))

    const items = []
    for (const file of files) {
      const pageNo = file.match(NUMBERED)[1]
      const sourceRel = `${sectionDir}/${file}`
      const title = stripNumber(file.slice(0, -3))
      const code = `${sectionNo}${pageNo}`
      const publicMd = `pages/${code}.md`
      const publicPath = `/pages/${code}`
      rewrites[sourceRel] = publicMd

      items.push({ text: title, link: publicPath })
      pages.push({ path: publicPath, title, group: sectionTitle, source: sourceRel, code })
    }

    sidebar.push({
      text: sectionTitle,
      collapsed: sectionTitle !== '现货手册',
      items
    })
  }

  const sections = sidebar.map((section, index) => ({
    key: `section-${String(index + 1).padStart(2, '0')}`,
    text: section.text,
    items: section.items.map((item) => ({ text: item.text, link: item.link }))
  }))

  await writeFile(structurePath, JSON.stringify({ rewrites, pages }, null, 2) + '\n')
  await writeFile(navPath, JSON.stringify(sidebar, null, 2) + '\n')
  await writeFile(mapPath, JSON.stringify({ sections, pages }, null, 2) + '\n')
  console.log(`Generated structure for ${pages.length} pages / ${sidebar.length} sections`)
  console.log(`Example: ${pages[0]?.source} -> ${pages[0]?.path}`)
}

await main()
