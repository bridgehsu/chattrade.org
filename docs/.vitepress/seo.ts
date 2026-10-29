/**
 * Site SEO: keywords, Open Graph / Twitter, canonical, JSON-LD, sitemap.
 * Wired from config.mts via `seoHead` + `transformSeoPageData` + `seoSitemap`.
 */
import type { HeadConfig, PageData } from 'vitepress'
import structure from './structure.json'

export const SITE = 'https://tgex.net'
export const SITE_NAME = 'TGEX 开源交易所设计文档'
export const OG_IMAGE = `${SITE}/og.jpg`
export const DEFAULT_DESCRIPTION =
  'TGEX 开源交易所设计与业务流程知识库：覆盖数字货币/加密货币交易所架构、撮合引擎、现货交易、合约、期权、区块链钱包、开源 OTC、多商户与商业源码级业务设计，帮助理解交易、资金与清算核心流程。'

/** Site-wide keywords (Baidu / Chinese engines still use meta keywords). */
export const SITE_KEYWORDS = [
  '开源交易所',
  '交易所开源',
  '交易所源码',
  '开源交易所源码',
  '商业源码',
  '交易所商业源码',
  '数字货币交易所',
  '加密货币交易所',
  '虚拟货币交易所',
  '区块链交易所',
  '撮合引擎',
  '开发撮合引擎',
  '开源撮合引擎',
  '订单簿',
  '现货交易',
  '现货交易所',
  '合约交易',
  '永续合约',
  '合约交易所',
  '期权交易',
  '加密期权',
  '开源OTC',
  'OTC交易',
  '场外交易',
  '法币交易',
  '区块链钱包',
  '数字货币钱包',
  '充值提现',
  '多商户交易所',
  '交易所架构',
  '交易所设计',
  '交易系统设计',
  '资金清算',
  '资产账务',
  '风控系统',
  '行情推送',
  'WebSocket行情',
  'TGEX'
]

const SECTION_KEYWORDS: Record<string, string[]> = {
  '01': ['交易所文档', '开源交易所介绍', '交易所功能全景'],
  '02': ['交易所部署', '交易所本地启动', '交易所工程结构'],
  '03': ['交易所架构', '微服务架构', '多商户架构', '消息队列'],
  '04': ['交易所基础知识', '币种网络', '委托撮合成交', '现货合约期权'],
  '05': ['用户体系', '账户体系', 'KYC认证', '登录鉴权'],
  '06': ['资产账务', '资金冻结', '余额设计', '对账一致性'],
  '07': ['现货手册', '现货撮合', '现货订单', '现货结算'],
  '08': ['合约手册', '永续合约', '保证金', '强平清算'],
  '09': ['期权手册', '期权结算', '周期期权'],
  '10': ['钱包手册', '链上充提', '地址管理', '资金归集'],
  '11': ['开源OTC', 'OTC商家', '法币出入金', 'OTC托管'],
  '12': ['交易机器人', '量化交易', '做市策略', '跟单'],
  '13': ['运营活动', '邀请奖励', '内容运营'],
  '14': ['商户后台', '交易所后台', '产品审核'],
  '15': ['交易报表', '风控规则', '风险事件'],
  '16': ['公共基础服务', '短信邮件', '国际化'],
  '17': ['交易所API', '交易接口', 'WebSocket接口'],
  '18': ['交易所运维', '监控告警', '备份恢复']
}

const rewriteToPublic = Object.fromEntries(
  Object.entries(structure.rewrites as Record<string, string>).map(([source, publicMd]) => [
    source,
    `/${publicMd.replace(/\.md$/, '')}`
  ])
)

function publicPath(relativePath: string): string {
  if (relativePath === 'index.md') return '/'
  if (relativePath === '404.md') return '/404'
  return rewriteToPublic[relativePath]
    || `/${relativePath.replace(/(?:\/index)?\.md$/, '')}`
}

function absoluteUrl(relativePath: string): string {
  const path = publicPath(relativePath)
  return path === '/' ? `${SITE}/` : `${SITE}${path}`
}

export function keywordsFor(relativePath: string): string {
  // Build may pass source path or rewritten pages/XXXX.md
  const rewritten = (structure.rewrites as Record<string, string>)[relativePath]
  const code =
    relativePath.match(/(?:^|\/)pages\/(\d{4})(?:\.md)?$/)?.[1]
    || rewritten?.match(/pages\/(\d{4})\.md$/)?.[1]
    || ''
  const section = code.slice(0, 2)
  const extra = SECTION_KEYWORDS[section] || []
  return [...new Set([...SITE_KEYWORDS, ...extra])].join(',')
}

function pageTitle(pageData: PageData): string {
  if (pageData.frontmatter.layout === 'home') {
    return String(pageData.frontmatter.titleTemplate || pageData.title || 'TGEX')
  }
  return pageData.title ? `${pageData.title} · TGEX` : 'TGEX'
}

function jsonLd(pageData: PageData): HeadConfig {
  const url = absoluteUrl(pageData.relativePath)
  const description = pageData.description || DEFAULT_DESCRIPTION
  const isHome = pageData.relativePath === 'index.md' || pageData.frontmatter.layout === 'home'
  const keywords = keywordsFor(pageData.relativePath)

  const data = isHome
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TGEX',
        alternateName: [
          SITE_NAME,
          '开源交易所',
          '交易所源码文档',
          '撮合引擎设计文档'
        ],
        url: `${SITE}/`,
        description,
        keywords,
        inLanguage: 'zh-CN',
        about: [
          '开源交易所',
          '撮合引擎',
          '现货合约期权',
          '区块链钱包',
          '开源OTC'
        ],
        publisher: {
          '@type': 'Organization',
          name: 'TGEX',
          url: `${SITE}/`,
          logo: `${SITE}/logo.svg`
        }
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageData.title,
        description,
        keywords,
        url,
        mainEntityOfPage: url,
        inLanguage: 'zh-CN',
        isPartOf: {
          '@type': 'WebSite',
          name: 'TGEX',
          url: `${SITE}/`
        },
        author: {
          '@type': 'Organization',
          name: 'TGEX'
        },
        publisher: {
          '@type': 'Organization',
          name: 'TGEX',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE}/logo.svg`
          }
        },
        image: OG_IMAGE
      }

  return ['script', { type: 'application/ld+json' }, JSON.stringify(data)]
}

/** Static `<head>` entries shared by every page. */
export const seoHead: HeadConfig[] = [
  ['meta', { name: 'author', content: 'TGEX' }],
  ['meta', { name: 'keywords', content: SITE_KEYWORDS.join(',') }],
  ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
  ['meta', { property: 'og:site_name', content: SITE_NAME }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: 'zh_CN' }],
  ['meta', { property: 'og:image', content: OG_IMAGE }],
  ['meta', { property: 'og:image:type', content: 'image/jpeg' }],
  ['meta', { property: 'og:image:width', content: '1280' }],
  ['meta', { property: 'og:image:height', content: '720' }],
  ['meta', { property: 'og:image:alt', content: 'TGEX 开源交易所 · 撮合引擎 · 合约期权钱包 OTC' }],
  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:image', content: OG_IMAGE }],
  ['link', { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }]
]

type SitemapItem = { url: string; [key: string]: unknown }

export const seoSitemap = {
  hostname: SITE,
  transformItems(items: SitemapItem[]) {
    return items
      .filter((item) => !item.url.includes('/404'))
      .map((item) => ({
        ...item,
        url: item.url.replace(/\/$/, '') || `${SITE}/`,
        changefreq: item.url === `${SITE}/` || item.url === SITE ? 'weekly' : 'monthly',
        priority: item.url === `${SITE}/` || item.url === SITE ? 1 : 0.7
      }))
  }
}

/** Per-page canonical / OG / Twitter / JSON-LD. */
export function transformSeoPageData(pageData: PageData): void {
  if (pageData.relativePath === '404.md') return

  const url = absoluteUrl(pageData.relativePath)
  const title = pageTitle(pageData)
  const description = pageData.description || DEFAULT_DESCRIPTION
  const isHome = pageData.frontmatter.layout === 'home'
  const keywords = keywordsFor(pageData.relativePath)

  pageData.frontmatter.head ??= []
  ;(pageData.frontmatter.head as HeadConfig[]).push(
    ['meta', { name: 'keywords', content: keywords }],
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
    jsonLd(pageData)
  )
}
