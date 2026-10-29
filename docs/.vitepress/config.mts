import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'
import sidebar from './navigation.json'
import structure from './structure.json'
import {
  DEFAULT_DESCRIPTION,
  seoHead,
  seoSitemap,
  transformSeoPageData
} from './seo'
import { withTopNavIcon } from '../../scripts/sidebar-icons.mjs'

// Keep our gen/rewrites; disable Teek plugins that would fight them.
// Prefer a clean docs look (close to VitePress default + light Teek extras).
const teekConfig = defineTeekConfig({
  teekTheme: true,
  teekHome: false,
  vpHome: true,
  pageStyle: 'default',
  sidebarTrigger: false,
  windowTransition: false,
  breadcrumb: { enabled: true, showCurrentName: false },
  author: { name: 'ChatTrade' },
  themeEnhance: { enabled: false },
  footerInfo: {
    theme: { show: false },
    copyright: { show: false }
  },
  articleAnalyze: { showInfo: false, showIcon: false },
  articleUpdate: { enabled: false },
  articleShare: { enabled: false },
  backTop: { enabled: true },
  vitePlugins: {
    sidebar: false,
    permalink: false,
    autoFrontmatter: false,
    mdH1: false
  }
})

const docsBase = process.env.DOCS_BASE || '/'

export default defineConfig({
  extends: teekConfig,
  lang: 'zh-CN',
  title: 'ChatTrade',
  titleTemplate: ':title · ChatTrade',
  description: DEFAULT_DESCRIPTION,
  base: docsBase,
  srcDir: '.',
  outDir: '../dist',
  cleanUrls: true,
  srcExclude: ['**/index.html', 'assets/**', 'pages/**'],
  rewrites: structure.rewrites,
  sitemap: seoSitemap,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#087f68' }],
    ...seoHead
  ],
  transformPageData: transformSeoPageData,
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'ChatTrade' },
    siteTitle: 'ChatTrade',
    nav: [
      {
        text: withTopNavIcon('文档指南'),
        link: '/pages/0101',
        activeMatch: '/pages/01|/pages/02|/pages/03'
      },
      {
        text: withTopNavIcon('产品能力'),
        items: [
          { text: withTopNavIcon('桌面端'), link: '/pages/0401' },
          { text: withTopNavIcon('手机端'), link: '/pages/0501' },
          { text: withTopNavIcon('AI 研究'), link: '/pages/0601' },
          { text: withTopNavIcon('策略与回测'), link: '/pages/0701' },
          { text: withTopNavIcon('交易与券商'), link: '/pages/0801' }
        ]
      },
      { text: withTopNavIcon('部署与运维'), link: '/pages/1201' }
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
      quote: '可以返回首页，或搜索 ChatTrade 工作区相关文档。',
      linkLabel: '返回首页',
      linkText: '返回首页'
    },
    footer: {
      message: 'ChatTrade · chattrade-workspace 知识库',
      copyright: '仅覆盖工作区工程 · 与 tgex.net 无关'
    }
  }
})
