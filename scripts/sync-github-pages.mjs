import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const dist = join(root, 'dist')
const docs = join(root, 'docs')
const copiedRoots = ['assets', 'vp-icons.css', 'index.html', '404.html', 'hashmap.json', 'logo.svg']

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
  for (const name of ['vp-icons.css', 'index.html', '404.html', 'hashmap.json']) {
    await rm(join(docs, name), { force: true })
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
  console.log(`Synced GitHub Pages files from dist/ into docs/ (${copiedRoots.join(', ')} and page indexes)`)
}

await sync()
