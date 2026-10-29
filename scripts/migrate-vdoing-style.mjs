/**
 * Migrate pure-numeric docs (00/0001/000001.md) to eladmin/vdoing-style
 * trees (01.项目介绍/01.项目概述.md). Public URLs stay English via rewrites.
 *
 * Writes into a staging directory first to avoid clashing with numeric folders
 * like docs/07/ when creating docs/07.现货手册/.
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const docs = join(root, 'docs')
const staging = join(docs, '.migration-out')
const mapPath = join(root, 'content-map.json')
const pathMapPath = join(root, 'scripts/path-map.json')
const navPath = join(docs, '.vitepress/navigation.json')

function pad(n) {
  return String(n).padStart(2, '0')
}

function collectAnchorChildren(nav) {
  const byLink = new Map()
  const walk = (items) => {
    for (const item of items || []) {
      if (item.link && !item.link.includes('#') && item.items?.length) {
        byLink.set(item.link, item.items.map((child) => ({
          text: child.text,
          anchor: child.link.includes('#') ? child.link.split('#')[1] : null
        })))
      }
      if (item.items) walk(item.items)
    }
  }
  walk(nav)
  return byLink
}

async function listMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (['.vitepress', 'assets', 'public', '.migration-out'].includes(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await listMarkdown(path))
    else if (entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

async function rewriteTextFiles(pathReplacements) {
  const targets = [
    join(docs, 'index.md'),
    join(docs, '.vitepress/theme/components/HomePage.vue'),
    join(docs, '.vitepress/config.mts'),
    join(root, 'README.md'),
    ...await listMarkdown(docs)
  ]
  const sorted = [...pathReplacements.entries()].sort((a, b) => b[0].length - a[0].length)
  for (const file of targets) {
    if (!existsSync(file)) continue
    let text = await readFile(file, 'utf8')
    let next = text
    for (const [from, to] of sorted) next = next.split(from).join(to)
    if (next !== text) await writeFile(file, next)
  }
}

async function main() {
  const map = JSON.parse(await readFile(mapPath, 'utf8'))
  const numericToEnglish = Object.fromEntries(
    Object.entries(JSON.parse(await readFile(pathMapPath, 'utf8'))).map(([en, num]) => [num, en])
  )
  const oldNav = JSON.parse(await readFile(navPath, 'utf8'))
  const anchorsByNumeric = collectAnchorChildren(oldNav)

  await rm(staging, { recursive: true, force: true })
  await mkdir(staging, { recursive: true })

  const pathReplacements = new Map()
  const planned = []
  const rewrites = {}
  const sidebar = []

  map.sections.forEach((section, sectionIndex) => {
    const sectionNo = pad(sectionIndex + 1)
    const sectionDirName = `${sectionNo}.${section.text}`
    const sideItems = []

    ;(section.items || []).forEach((item, pageIndex) => {
      const pageNo = pad(pageIndex + 1)
      const title = item.text
      const numericLink = item.link
      const englishPath = numericToEnglish[numericLink]
      if (!englishPath) throw new Error(`No english path for ${numericLink}`)

      const sourceRel = `${sectionDirName}/${pageNo}.${title}.md`
      const publicRel = `${englishPath.slice(1)}.md`
      const oldFile = join(docs, `${numericLink.slice(1)}.md`)
      const stagedFile = join(staging, sourceRel)
      if (!existsSync(oldFile)) throw new Error(`Missing ${oldFile}`)

      rewrites[sourceRel] = publicRel
      pathReplacements.set(numericLink, englishPath)

      const anchorMeta = anchorsByNumeric.get(numericLink) || []
      const sideItem = { text: title, link: englishPath }
      if (anchorMeta.length) {
        sideItem.items = anchorMeta.map((child) => ({
          text: child.text,
          link: child.anchor ? `${englishPath}#${child.anchor}` : englishPath
        }))
      }
      sideItems.push(sideItem)

      const mapItem = JSON.parse(JSON.stringify(item))
      mapItem.link = englishPath
      if (mapItem.items) {
        for (const child of mapItem.items) {
          if (child.link?.startsWith(numericLink)) {
            child.link = child.link.replace(numericLink, englishPath)
          }
        }
      }

      planned.push({ oldFile, stagedFile, sourceRel, englishPath, mapItem, sectionText: section.text })
    })

    sidebar.push({
      text: section.text,
      collapsed: section.text !== '现货手册',
      items: sideItems
    })
  })

  for (const item of planned) {
    await mkdir(dirname(item.stagedFile), { recursive: true })
    let body = await readFile(item.oldFile, 'utf8')
    for (const [from, to] of [...pathReplacements.entries()].sort((a, b) => b[0].length - a[0].length)) {
      body = body.split(from).join(to)
    }
    await writeFile(item.stagedFile, body)
  }

  // Remove old numeric trees, then move staged trees into docs/
  for (let i = 0; i <= 17; i++) {
    await rm(join(docs, pad(i)), { recursive: true, force: true })
  }
  const stagedSections = await readdir(staging)
  for (const name of stagedSections) {
    await cp(join(staging, name), join(docs, name), { recursive: true })
  }
  await rm(staging, { recursive: true, force: true })

  await rewriteTextFiles(pathReplacements)

  const sectionsOut = map.sections.map((section) => ({
    key: section.key,
    text: section.text,
    caption: section.caption,
    items: planned.filter((p) => p.sectionText === section.text).map((p) => p.mapItem)
  }))
  const pagesOut = planned.map((p) => ({
    path: p.englishPath,
    title: p.mapItem.text,
    group: p.sectionText,
    source: p.sourceRel
  }))

  await writeFile(navPath, JSON.stringify(sidebar, null, 2) + '\n')
  await writeFile(mapPath, JSON.stringify({ sections: sectionsOut, pages: pagesOut }, null, 2) + '\n')
  await writeFile(join(docs, '.vitepress/structure.json'), JSON.stringify({ rewrites, pages: pagesOut }, null, 2) + '\n')

  // Restore English public paths in path-map for reference
  await writeFile(pathMapPath, JSON.stringify(
    Object.fromEntries([...pathReplacements.entries()].map(([num, en]) => [en, num])),
    null,
    2
  ) + '\n')

  console.log(`Migrated ${planned.length} pages to NN.标题 style`)
  console.log(`Example: ${planned[0].sourceRel} -> ${planned[0].englishPath}`)
}

await main()
