/**
 * Rebuild sidebar + rewrites from docs/NN.标题 trees.
 * Public URL: /pages/{sectionNo}{pageNo}/  e.g. 01.项目介绍/01.项目概述 → /pages/0101/
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
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

function walkAnchors(nav, into = new Map()) {
  for (const section of nav || []) {
    for (const item of section.items || []) {
      if (item.link && !item.link.includes('#') && item.items?.length) {
        into.set(item.link, item.items)
      }
      if (item.items) walkAnchors([{ items: item.items }], into)
    }
  }
  return into
}

function remapAnchorItems(items, newPath) {
  return (items || []).map((child) => {
    const anchor = child.link?.includes('#') ? child.link.split('#')[1] : null
    return {
      text: child.text,
      link: anchor ? `${newPath}#${anchor}` : newPath
    }
  })
}

async function main() {
  const map = existsSync(mapPath) ? JSON.parse(await readFile(mapPath, 'utf8')) : { sections: [], pages: [] }
  const prevNav = existsSync(navPath) ? JSON.parse(await readFile(navPath, 'utf8')) : []
  const anchorsByOldPath = walkAnchors(prevNav)

  // Also index anchors by page title within section for remapping after URL change
  const anchorsBySourceHint = new Map()
  for (const page of map.pages || []) {
    if (page.source && anchorsByOldPath.has(page.path)) {
      anchorsBySourceHint.set(page.source, anchorsByOldPath.get(page.path))
    }
  }

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

      const sideItem = { text: title, link: publicPath }
      const oldAnchors = anchorsBySourceHint.get(sourceRel)
        || anchorsByOldPath.get(publicPath)
        || null
      if (oldAnchors?.length) sideItem.items = remapAnchorItems(oldAnchors, publicPath)

      items.push(sideItem)
      pages.push({ path: publicPath, title, group: sectionTitle, source: sourceRel, code })
    }

    sidebar.push({
      text: sectionTitle,
      collapsed: sectionTitle !== '现货手册',
      items
    })
  }

  const sections = sidebar.map((section, index) => {
    const prevSection = map.sections.find((s) => s.text === section.text) || {}
    return {
      key: prevSection.key || `section-${index + 1}`,
      text: section.text,
      caption: prevSection.caption || '',
      items: section.items.map((item) => {
        const node = { text: item.text, link: item.link }
        if (item.items) node.items = item.items
        return node
      })
    }
  })

  await writeFile(structurePath, JSON.stringify({ rewrites, pages }, null, 2) + '\n')
  await writeFile(navPath, JSON.stringify(sidebar, null, 2) + '\n')
  await writeFile(mapPath, JSON.stringify({ sections, pages }, null, 2) + '\n')
  console.log(`Generated structure for ${pages.length} pages / ${sidebar.length} sections`)
  console.log(`Example: ${pages[0]?.source} -> ${pages[0]?.path}`)
}

await main()
