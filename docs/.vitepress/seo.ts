/**
 * Site SEO: keywords, Open Graph / Twitter, canonical, JSON-LD, sitemap.
 * Wired from config.mts via `seoHead` + `transformSeoPageData` + `seoSitemap`.
 */
import type { HeadConfig, PageData } from 'vitepress'
import structure from './structure.json'

export const SITE = (process.env.DOCS_SITE || 'https://chattrade.org').replace(/\/$/, '')
export const SITE_NAME = 'ChatTrade 工作区知识库'
export const OG_IMAGE = `${SITE}/og.jpg`
export const DEFAULT_DESCRIPTION =
  'ChatTrade 工作区文档：面向 chattrade-web、chattrade-mobile 与 chattrade.org，覆盖 AI 研究、策略回测、自动执行、券商交易、双端客户端与部署运维。不包含 tgex.net 内容。'

export const SITE_KEYWORDS = [
  'ChatTrade',
  'chattrade.org',
  'chattrade-web',
  'chattrade-mobile',
  '量化交易',
  'AI量化',
  '策略回测',
  '自动交易',
  '交易机器人',
  '券商账户',
  '闪电交易',
  '指标IDE',
  'AI资产分析',
  'VitePress文档'
]

const SECTION_KEYWORDS: Record<string, string[]> = {
  '01': ['ChatTrade介绍', '工作区工程', '功能全景'],
  '02': ['本地启动', '环境准备', '工程结构'],
  '03': ['系统架构', 'API代理', '会话'],
  '04': ['chattrade-web', '桌面端', 'Vue'],
  '05': ['chattrade-mobile', '手机端', 'Capacitor'],
  '06': ['AI研究', '资产分析', 'Copilot'],
  '07': ['策略中心', '回测', '交易机器人'],
  '08': ['券商账户', 'IBKR', 'Alpaca', '闪电交易'],
  '09': ['指标IDE', '指标社区', '行情'],
  '10': ['登录鉴权', '计费', '运营后台'],
  '11': ['接口约定', 'API分组'],
  '12': ['部署', 'Nginx', '故障排查']
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
    return String(pageData.frontmatter.titleTemplate || pageData.title || 'ChatTrade')
  }
  return pageData.title ? `${pageData.title} · ChatTrade` : 'ChatTrade'
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
        name: 'ChatTrade',
        alternateName: [
          SITE_NAME,
          'ChatTrade 工作区文档',
          'chattrade-web',
          'chattrade-mobile'
        ],
        url: `${SITE}/`,
        description,
        keywords,
        inLanguage: 'zh-CN',
        about: [
          '量化交易',
          'AI 研究',
          '策略回测',
          '自动执行',
          '双端客户端'
        ],
        publisher: {
          '@type': 'Organization',
          name: 'ChatTrade',
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
          name: 'ChatTrade',
          url: `${SITE}/`
        },
        author: {
          '@type': 'Organization',
          name: 'ChatTrade'
        },
        publisher: {
          '@type': 'Organization',
          name: 'ChatTrade',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE}/logo.svg`
          }
        },
        image: OG_IMAGE
      }

  return ['script', { type: 'application/ld+json' }, JSON.stringify(data)]
}

export const seoHead: HeadConfig[] = [
  ['meta', { name: 'author', content: 'ChatTrade' }],
  ['meta', { name: 'keywords', content: SITE_KEYWORDS.join(',') }],
  ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
  ['meta', { property: 'og:site_name', content: SITE_NAME }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: 'zh_CN' }],
  ['meta', { property: 'og:image', content: OG_IMAGE }],
  ['meta', { property: 'og:image:type', content: 'image/jpeg' }],
  ['meta', { property: 'og:image:width', content: '1280' }],
  ['meta', { property: 'og:image:height', content: '720' }],
  ['meta', { property: 'og:image:alt', content: 'ChatTrade · chattrade-workspace 知识库' }],
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
