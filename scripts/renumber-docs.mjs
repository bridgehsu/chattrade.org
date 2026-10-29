import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const docs = join(root, 'docs')
const mapPath = join(root, 'content-map.json')
const navPath = join(docs, '.vitepress/navigation.json')

const sections = [
  {
    key: 'introduction', old: 'introduction', text: '项目介绍', caption: '先建立全景，再进入业务',
    pages: [
      { old: 'overview', title: '项目概述' },
      { old: 'landscape', title: '功能全景' },
      { old: 'technology', title: '技术栈' },
      { old: 'reading-guide', title: '文档阅读指南' }
    ]
  },
  {
    key: 'quickstart', old: 'quickstart', text: '快速开始', caption: '先辨认环境和依赖',
    pages: [
      { old: 'environment', title: '环境准备' },
      { old: 'structure', title: '工程结构' },
      { old: 'startup', title: '服务启动与验证' }
    ]
  },
  {
    key: 'architecture', old: 'architecture', text: '系统架构', caption: '理解职责边界与数据流',
    pages: [
      { old: 'overview', title: '整体架构' },
      { old: 'communication', title: '服务通信与消息流转' },
      { old: 'data', title: '数据存储与缓存' },
      { old: 'tenancy', title: '多商户架构' }
    ]
  },
  {
    key: 'fundamentals', old: 'fundamentals', text: '交易所基础知识', caption: '建立共同的业务语言',
    pages: [
      { old: 'assets', title: '币种、网络与账户' },
      { old: 'orders', title: '委托、撮合与成交' },
      { old: 'products', title: '现货、合约与期权' }
    ]
  },
  {
    key: 'users', old: 'users', text: '用户与账户', caption: '身份、认证与访问边界',
    pages: [
      { old: 'overview', title: '用户与账户体系' },
      { old: 'flows', title: '注册、登录与认证流程' },
      { old: 'permissions', title: '权限与账户保护' }
    ]
  },
  {
    key: 'ledger', old: 'ledger', text: '资产与账务', caption: '每一次资金变化都应有依据',
    pages: [
      { old: 'model', title: '资产体系与余额设计' },
      { old: 'flows', title: '核心资金流程' },
      { old: 'reconciliation', title: '对账与资金一致性' }
    ]
  },
  {
    key: 'spot', old: 'spot', text: '现货手册', caption: '围绕订单、资金与成交建立完整认知',
    pages: [
      { old: 'overview', title: '业务概述' },
      { old: 'architecture', title: '系统架构' },
      { old: 'rules', title: '交易规则' },
      { old: 'design', title: '核心设计' },
      { old: 'flows', title: '核心交易流程' },
      { old: 'market', title: '行情与推送' },
      { old: 'exceptions', title: '异常处理与一致性保障' }
    ]
  },
  {
    key: 'contract', old: 'contract', text: '合约手册', caption: '从订单进入持仓与风险体系',
    pages: [
      { old: 'overview', title: '业务概述与系统架构' },
      { old: 'rules', title: '交易规则' },
      { old: 'design', title: '核心设计' },
      { old: 'flows', title: '核心交易流程' },
      { old: 'prices', title: '行情与异常处理' }
    ]
  },
  {
    key: 'options', old: 'options', text: '期权手册', caption: '先确认产品，再解释周期和结算',
    pages: [
      { old: 'overview', title: '业务概述与版本说明' },
      { old: 'rules', title: '产品与交易规则' },
      { old: 'design', title: '核心设计' },
      { old: 'flows', title: '核心交易流程' },
      { old: 'exceptions', title: '行情与异常处理' }
    ]
  },
  {
    key: 'wallet', old: 'wallet', text: '钱包手册', caption: '连接链上事实与内部资产',
    pages: [
      { old: 'overview', title: '业务概述与钱包架构' },
      { old: 'design', title: '核心设计' },
      { old: 'flows', title: '核心充提流程' },
      { old: 'operations', title: '核对、安全与异常处理' }
    ]
  },
  {
    key: 'otc', old: 'otc', text: 'OTC 手册', caption: '理解商家、订单与资金托管',
    pages: [
      { old: 'overview', title: '业务概述与系统架构' },
      { old: 'design', title: '商家、规则与核心设计' },
      { old: 'flows', title: '核心交易流程' },
      { old: 'risk', title: '风控与异常处理' }
    ]
  },
  {
    key: 'automation', old: 'automation', text: '机器人与量化', caption: '区分行情接入、交易执行与策略',
    pages: [
      { old: 'overview', title: '业务概述与外部接入' },
      { old: 'flows', title: '策略与跟单流程' }
    ]
  },
  {
    key: 'operations', old: 'operations', text: '运营与奖励', caption: '把活动规则变成可核算的业务',
    pages: [
      { old: 'activities', title: '活动与内容管理' },
      { old: 'rewards', title: '邀请关系与奖励流程' }
    ]
  },
  {
    key: 'administration', old: 'administration', text: '商户与后台管理', caption: '让配置和管理操作可解释',
    pages: [
      { old: 'structure', title: '总后台、商户与权限' },
      { old: 'flows', title: '产品管理与审核流程' }
    ]
  },
  {
    key: 'reports', old: 'reports', text: '报表与风控', caption: '统一统计口径，明确风险动作',
    pages: [
      { old: 'metrics', title: '统计指标与资产报表' },
      { old: 'risk', title: '风控规则与事件处理' }
    ]
  },
  {
    key: 'infrastructure', old: 'infrastructure', text: '公共基础服务', caption: '认识跨业务复用的能力',
    pages: [
      { old: 'components', title: '公共组件与配置' },
      { old: 'services', title: '消息、上传与国际化' }
    ]
  },
  {
    key: 'api', old: 'api', text: '接口文档', caption: '记录协议语义，不虚构接口地址',
    pages: [
      { old: 'conventions', title: '接口约定与鉴权' },
      { old: 'business', title: '业务接口与错误处理' }
    ]
  },
  {
    key: 'deployment', old: 'deployment', text: '部署与运维', caption: '验证业务可用，而不只看进程存活',
    pages: [
      { old: 'topology', title: '部署架构与服务配置' },
      { old: 'recovery', title: '监控、备份与恢复' },
      { old: 'troubleshooting', title: '常见故障排查' }
    ]
  }
]

function pad(n, width) {
  return String(n).padStart(width, '0')
}

function buildPlan() {
  const pathMap = new Map()
  const planned = []
  sections.forEach((section, sectionIndex) => {
    const l1 = pad(sectionIndex, 2)
    section.l1 = l1
    section.pages.forEach((page, pageIndex) => {
      const l2seq = pad(pageIndex + 1, 2)
      const l2 = `${l1}${l2seq}`
      // L3 keeps the L1 prefix: under 00 → 000001; under 06 → 060001
      const l3 = `${l1}${pad(pageIndex + 1, 4)}`
      const oldPath = `/${section.old}/${page.old}`
      const newPath = `/${l1}/${l2}/${l3}`
      page.l2 = l2
      page.l3 = l3
      page.oldPath = oldPath
      page.newPath = newPath
      pathMap.set(oldPath, newPath)
      planned.push({ section, page, oldFile: join(docs, section.old, `${page.old}.md`), newFile: join(docs, l1, l2, `${l3}.md`) })
    })
  })
  return { pathMap, planned }
}

function rewriteLinks(text, pathMap) {
  let out = text
  const sorted = [...pathMap.entries()].sort((a, b) => b[0].length - a[0].length)
  for (const [oldPath, newPath] of sorted) {
    out = out.split(oldPath).join(newPath)
  }
  return out
}

function rewriteRelativeLinks(text, sectionOld, pathMap) {
  return text.replace(/\]\(\.\/([a-z0-9-]+)(#[^)]+)?\)/g, (full, page, hash = '') => {
    const oldPath = `/${sectionOld}/${page}`
    const newPath = pathMap.get(oldPath)
    if (!newPath) return full
    return `](${newPath}${hash})`
  })
}

function cloneNavItems(items, pathMap) {
  return items.map((item) => {
    const next = { ...item }
    if (next.link) {
      const [pathname, anchor] = next.link.split('#')
      const mapped = pathMap.get(pathname)
      if (mapped) next.link = anchor ? `${mapped}#${anchor}` : mapped
    }
    if (next.items) next.items = cloneNavItems(next.items, pathMap)
    return next
  })
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'assets' || entry.name === 'cache') continue
      files.push(...await walkFiles(path))
    } else {
      files.push(path)
    }
  }
  return files
}

async function main() {
  const oldMap = JSON.parse(await readFile(mapPath, 'utf8'))
  const oldNav = JSON.parse(await readFile(navPath, 'utf8'))
  const { pathMap, planned } = buildPlan()

  for (const item of planned) {
    if (!existsSync(item.oldFile)) throw new Error(`missing ${item.oldFile}`)
    await mkdir(dirname(item.newFile), { recursive: true })
    let body = await readFile(item.oldFile, 'utf8')
    body = rewriteRelativeLinks(body, item.section.old, pathMap)
    body = rewriteLinks(body, pathMap)
    await writeFile(item.newFile, body)
  }

  const newSections = sections.map((section) => ({
    key: section.key,
    text: section.text,
    caption: section.caption,
    items: oldMap.sections.find((s) => s.key === section.key)?.items.map((item) => {
      const rewritten = JSON.parse(JSON.stringify(item))
      const rewrite = (node) => {
        if (node.link) {
          const [pathname, anchor] = node.link.split('#')
          const mapped = pathMap.get(pathname)
          if (mapped) node.link = anchor ? `${mapped}#${anchor}` : mapped
        }
        if (node.items) node.items.forEach(rewrite)
      }
      rewrite(rewritten)
      return rewritten
    }) || section.pages.map((page) => ({ text: page.title, link: page.newPath }))
  }))

  const newPages = sections.flatMap((section) => section.pages.map((page) => ({
    path: page.newPath,
    title: page.title,
    group: section.text
  })))

  await writeFile(mapPath, JSON.stringify({ sections: newSections, pages: newPages }, null, 2) + '\n')
  await writeFile(navPath, JSON.stringify(cloneNavItems(oldNav, pathMap), null, 2) + '\n')

  const rewriteTargets = [
    join(docs, '.vitepress/config.mts'),
    join(docs, '.vitepress/theme/components/HomePage.vue'),
    join(docs, 'index.md'),
    join(root, 'README.md')
  ]
  for (const file of rewriteTargets) {
    if (!existsSync(file)) continue
    let text = await readFile(file, 'utf8')
    text = rewriteLinks(text, pathMap)
    if (file.endsWith('config.mts')) {
      text = text.replace(
        "activeMatch: '/introduction/|/quickstart/|/architecture/|/fundamentals/'",
        "activeMatch: '/00/|/01/|/02/|/03/'"
      )
    }
    await writeFile(file, text)
  }

  const oldDirs = [...new Set(planned.map((p) => join(docs, p.section.old)))]
  for (const dir of oldDirs) {
    await rm(dir, { recursive: true, force: true })
  }

  // drop stale generated html synced beside old markdown
  const staleRoots = await readdir(docs, { withFileTypes: true })
  for (const entry of staleRoots) {
    if (!entry.isDirectory()) continue
    if (/^\d{2}$/.test(entry.name) || entry.name.startsWith('.') || ['public', 'assets'].includes(entry.name)) continue
  }

  const mappingOut = join(root, 'scripts/path-map.json')
  await writeFile(mappingOut, JSON.stringify(Object.fromEntries(pathMap), null, 2) + '\n')
  console.log(`Migrated ${planned.length} pages into numbered folders. Map written to scripts/path-map.json`)
}

await main()
