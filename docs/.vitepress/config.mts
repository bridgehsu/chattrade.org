import { defineConfig, type HeadConfig } from 'vitepress'
import sidebar from './navigation.json'
import structure from './structure.json'

const SITE = 'https://tgex.net'
const SITE_NAME = 'TGEX 交易所设计文档'
const OG_IMAGE = `${SITE}/og.jpg`
const DEFAULT_DESCRIPTION =
  '交易所设计与业务流程知识库。理解现货、合约、期权、钱包与 OTC 的架构、资金和核心流程。'

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

function pageTitle(pageData: { title: string; frontmatter: Record<string, unknown> }): string {
  if (pageData.frontmatter.layout === 'home') {
    return String(pageData.frontmatter.titleTemplate || pageData.title || 'TGEX')
  }
  return pageData.title ? `${pageData.title} · TGEX` : 'TGEX'
}

function jsonLd(pageData: {
  title: string
  description: string
  relativePath: string
  frontmatter: Record<string, unknown>
}): HeadConfig {
  const url = absoluteUrl(pageData.relativePath)
  const description = pageData.description || DEFAULT_DESCRIPTION
  const isHome = pageData.relativePath === 'index.md' || pageData.frontmatter.layout === 'home'

  const data = isHome
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TGEX',
        alternateName: SITE_NAME,
        url: `${SITE}/`,
        description,
        inLanguage: 'zh-CN',
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

export default defineConfig({
  lang: 'zh-CN',
  title: 'TGEX',
  titleTemplate: ':title · TGEX',
  description: DEFAULT_DESCRIPTION,
  srcDir: '.',
  outDir: '../dist',
  cleanUrls: true,
  srcExclude: ['**/index.html', 'assets/**', 'pages/**'],
  rewrites: structure.rewrites,
  sitemap: {
    hostname: SITE,
    transformItems(items) {
      return items
        .filter((item) => !item.url.includes('/404'))
        .map((item) => ({
          ...item,
          // Prefer trailing-slash-free canonicals that match cleanUrls pages.
          url: item.url.replace(/\/$/, '') || `${SITE}/`,
          changefreq: item.url === `${SITE}/` || item.url === SITE ? 'weekly' : 'monthly',
          priority: item.url === `${SITE}/` || item.url === SITE ? 1 : 0.7
        }))
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#087f68' }],
    ['meta', { name: 'author', content: 'TGEX' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:type', content: 'image/jpeg' }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '720' }],
    ['meta', { property: 'og:image:alt', content: 'TGEX 交易所设计与业务流程' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
    ['link', { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }]
  ],
  transformPageData(pageData) {
    if (pageData.relativePath === '404.md') return

    const url = absoluteUrl(pageData.relativePath)
    const title = pageTitle(pageData)
    const description = pageData.description || DEFAULT_DESCRIPTION
    const isHome = pageData.frontmatter.layout === 'home'

    pageData.frontmatter.head ??= []
    ;(pageData.frontmatter.head as HeadConfig[]).push(
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
  },
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'TGEX' },
    siteTitle: 'TGEX',
    nav: [
      {
        text: '文档指南',
        link: '/pages/0101',
        activeMatch: '/pages/01|/pages/02|/pages/03|/pages/04'
      },
      {
        text: '交易业务',
        items: [
          { text: '现货手册', link: '/pages/0701' },
          { text: '合约手册', link: '/pages/0801' },
          { text: '期权手册', link: '/pages/0901' },
          { text: '钱包手册', link: '/pages/1001' },
          { text: 'OTC手册', link: '/pages/1101' }
        ]
      },
      { text: '部署与运维', link: '/pages/1801' }
    ],
    sidebar,
    outline: { level: [2, 3], label: '本页内容' },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text: string) =>
              text.toLowerCase().match(/[\p{Script=Han}]|[a-z0-9_]+/gu) || []
          },
          searchOptions: { combineWith: 'AND', prefix: true, fuzzy: false }
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清空搜索',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '文档目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    darkModeSwitchTitle: '切换深色模式',
    lightModeSwitchTitle: '切换浅色模式',
    notFound: {
      title: '页面未找到',
      quote: '可以返回首页，或搜索你想了解的业务流程。',
      linkLabel: '返回首页',
      linkText: '返回首页'
    },
    footer: {
      message: 'TGEX · 交易所设计与业务流程',
      copyright: '基于 Coinex 工程整理 · 教学示例不代表实际交易参数'
    }
  }
})
