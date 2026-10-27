import { defineConfig } from 'vitepress'
import sidebar from './navigation.json'
export default defineConfig({
  lang: 'zh-CN', title: 'TGEX', titleTemplate: ':title · TGEX',
  description: '交易所设计与业务流程知识库。理解现货、合约、期权、钱包与 OTC 的架构、资金和核心流程。',
  srcDir: '.', outDir: '../dist', cleanUrls: true,
  srcExclude: ['**/index.html', 'assets/**'],
  sitemap: { hostname: 'https://tgex.net' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#087f68' }],
    ['meta', { property: 'og:site_name', content: 'TGEX 交易所设计文档' }]
  ],
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'TGEX' }, siteTitle: 'TGEX',
    nav: [
      { text: '文档指南', 
        link: '/introduction/overview', activeMatch: '/introduction/|/quickstart/|/architecture/|/fundamentals/' 
      },
      { text: '交易业务', 
        items: [
        { text: '现货手册', link: '/spot/overview' }, 
        { text: '合约手册', link: '/contract/overview' },
        { text: '期权手册', link: '/options/overview' }, 
        { text: '钱包手册', link: '/wallet/overview' },
        { text: 'OTC手册', link: '/otc/overview' }
      ] },
      { text: '部署与运维', link: '/deployment/topology' }
    ],
    sidebar,
    outline: { level: [2, 3], label: '本页内容' },
    search: { provider: 'local', options: {
      miniSearch: {
        options: { tokenize: (text: string) => text.toLowerCase().match(/[\p{Script=Han}]|[a-z0-9_]+/gu) || [] },
        searchOptions: { combineWith: 'AND', prefix: true, fuzzy: false }
      },
      locales: { root: { translations: {
      button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
      modal: { noResultsText: '没有找到相关内容', resetButtonTitle: '清空搜索',
        footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
    } } } } },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '文档目录', returnToTopLabel: '返回顶部', darkModeSwitchLabel: '外观',
    darkModeSwitchTitle: '切换深色模式', lightModeSwitchTitle: '切换浅色模式',
    notFound: { title: '页面未找到', quote: '可以返回首页，或搜索你想了解的业务流程。', linkLabel: '返回首页', linkText: '返回首页' },
    footer: { message: 'TGEX · 交易所设计与业务流程', copyright: '基于 Coinex 工程整理 · 教学示例不代表实际交易参数' }
  }
})
