import { defineConfig } from 'vitepress'
import sidebar from './navigation.json'
import structure from './structure.json'
import {
  DEFAULT_DESCRIPTION,
  seoHead,
  seoSitemap,
  transformSeoPageData
} from './seo'

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
  sitemap: seoSitemap,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#087f68' }],
    ...seoHead
  ],
  transformPageData: transformSeoPageData,
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
