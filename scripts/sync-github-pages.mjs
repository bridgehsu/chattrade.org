import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const dist = join(root, 'dist')
const docs = join(root, 'docs')
const NUMBERED_SOURCE = /^\d+\./

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else files.push(path)
  }
  return files
}

async function cleanCopiedAssets() {
  await rm(join(docs, 'assets'), { recursive: true, force: true })
  await rm(join(docs, 'pages'), { recursive: true, force: true })
  for (const name of ['vp-icons.css', 'index.html', '404.html', 'hashmap.json', 'sitemap.xml']) {
    await rm(join(docs, name), { force: true })
  }

  // Drop leftover English slug publish dirs; keep NN.标题 source trees.
  const entries = await readdir(docs, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (['.vitepress', 'public', 'assets', 'pages'].includes(entry.name)) continue
    if (NUMBERED_SOURCE.test(entry.name)) continue
    if (/^[a-z][a-z0-9-]*$/i.test(entry.name)) {
      await rm(join(docs, entry.name), { recursive: true, force: true })
    }
  }
}

async function sync() {
  await cleanCopiedAssets()
  await writeFile(join(docs, '.nojekyll'), '')
  const files = await walk(dist)
  for (const file of files) {
    const rel = relative(dist, file).replaceAll('\\', '/')
    if (rel === 'CNAME') continue
    if (rel.endsWith('.html') && rel !== 'index.html' && rel !== '404.html') {
      const destDir = join(docs, rel.slice(0, -'.html'.length))
      await mkdir(destDir, { recursive: true })
      await cp(file, join(destDir, 'index.html'))
      continue
    }
    const dest = join(docs, rel)
    await mkdir(dirname(dest), { recursive: true })
    await cp(file, dest)
  }
  console.log('Synced GitHub Pages files from dist/ into docs/ (pages/* + site assets)')
}

await sync()
