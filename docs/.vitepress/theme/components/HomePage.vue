<script setup lang="ts">
import { withBase } from 'vitepress'

const businesses = [
  {
    n: '01',
    title: 'AI 研究',
    en: 'RESEARCH',
    desc: '资产分析与 Copilot，把市场上下文变成可行动结论。',
    link: '/pages/0601',
    tags: '分析 / 报告 / 上下文',
    icon: 'M4 19V5m0 14h16M8 15l3-4 3 2 4-6'
  },
  {
    n: '02',
    title: '策略与回测',
    en: 'STRATEGY',
    desc: '在 IDE 中编写策略，用回测检验规则与风险。',
    link: '/pages/0701',
    tags: 'IDE / 回测 / 参数',
    icon: 'M4 18 10 12 14 15 21 5 M15 5h6v6'
  },
  {
    n: '03',
    title: '自动执行',
    en: 'AUTOMATION',
    desc: '机器人与执行器连接信号、账户和真实订单。',
    link: '/pages/0703',
    tags: 'Bot / 启停 / 敞口',
    icon: 'M5 6h14M5 18h14M9 3v6m6 6v6M5 12h14'
  },
  {
    n: '04',
    title: '券商与交易',
    en: 'BROKER',
    desc: '绑定交易通道，使用闪电交易完成快速下单。',
    link: '/pages/0801',
    tags: '凭证 / 下单 / 持仓',
    icon: 'M4 7h15l-3-3m3 3-3 3M20 17H5l3 3m-3-3 3-3'
  },
  {
    n: '05',
    title: '双端客户端',
    en: 'CLIENTS',
    desc: 'chattrade-web 完整工作台，mobile 随身轻量操作。',
    link: '/pages/0401',
    tags: 'Web / Mobile / API',
    icon: 'M4 7h15v13H4zM4 7V4h13v3M15 11h6v5h-6z'
  }
]

const steps = [
  { n: '01', title: '认识工作区', desc: '弄清 org / web / mobile 各自职责。', link: '/pages/0101' },
  { n: '02', title: '本地跑起来', desc: '准备环境并启动任一客户端。', link: '/pages/0203' },
  { n: '03', title: '理解接入层', desc: '看清 /api 代理与会话如何工作。', link: '/pages/0302' },
  { n: '04', title: '跟一条主链路', desc: '从研究到策略、回测再到执行。', link: '/pages/0701' }
]
</script>

<template>
<main class="tg-home">
  <section class="home-hero">
    <div class="hero-copy">
      <div class="eyebrow"><span class="status-dot"></span> CHATTRADE WORKSPACE DOCS</div>
      <h1 class="brand-hero">ChatTrade</h1>
      <p class="hero-tagline">量化交易，从<span>研究到执行</span>。</p>
      <p class="hero-description">本站只描述 chattrade-workspace 内的工程：桌面端、手机端与文档站。<br>与 tgex.net 等其它产品无关。</p>
      <div class="hero-actions">
        <a class="primary-action" :href="withBase('/pages/0101')">认识 ChatTrade <span aria-hidden="true">↗</span></a>
        <a class="secondary-action" :href="withBase('/pages/0203')">本地启动 <span aria-hidden="true">→</span></a>
      </div>
      <div class="hero-facts">
        <span><b>03</b> 工作区工程</span>
        <span><b>12</b> 知识栏目</span>
        <span><b>31</b> 专题文档</span>
      </div>
    </div>

    <div class="architecture-card" aria-label="ChatTrade 工作区示意">
      <div class="arch-top">
        <span class="arch-mark">C<span>↗</span></span>
        <span>WORKSPACE</span>
        <span class="arch-dot"></span>
      </div>
      <div class="arch-caption">三个工程，一套交易工作流。</div>
      <div class="arch-node client"><span class="node-indicator"></span> chattrade-web / mobile <small>CLIENTS</small></div>
      <div class="arch-connector"><span></span><em>/api 代理</em></div>
      <div class="arch-node engine">
        <div>
          <span class="small-label">BACKEND API</span>
          <strong>研究 · 策略 · 执行</strong>
        </div>
        <span class="engine-symbol">⇄</span>
      </div>
      <div class="branch-line"></div>
      <div class="arch-branches">
        <div><span>01 / WEB</span><strong>桌面工作台</strong></div>
        <div><span>02 / MOBILE</span><strong>随身客户端</strong></div>
        <div><span>03 / DOCS</span><strong>chattrade.org</strong></div>
      </div>
      <div class="arch-bottom"><span>WORKSPACE ONLY. NO TGEX CONTENT.</span><span>↗</span></div>
    </div>
  </section>

  <section class="business-section">
    <div class="section-header">
      <div>
        <div class="eyebrow">THE CHATTRADE MAP</div>
        <h2>五条主线，覆盖工作区能力。</h2>
      </div>
      <a :href="withBase('/pages/0102')">查看功能全景 <span aria-hidden="true">↗</span></a>
    </div>
    <div class="business-grid">
      <a v-for="b in businesses" :key="b.n" :href="withBase(b.link)" class="business-card">
        <div class="business-meta">
          <span>{{ b.n }} / {{ b.en }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="b.icon" />
          </svg>
        </div>
        <h3>{{ b.title }}<span aria-hidden="true">↗</span></h3>
        <p>{{ b.desc }}</p>
        <div class="business-tags">{{ b.tags }}</div>
      </a>
    </div>
  </section>

  <section class="reading-section">
    <div class="section-header">
      <div>
        <div class="eyebrow">A CLEAR LEARNING PATH</div>
        <h2>从工作区认知，走到主链路。</h2>
      </div>
      <span class="reading-note">建议从左到右阅读</span>
    </div>
    <div class="reading-grid">
      <a v-for="s in steps" :key="s.n" :href="withBase(s.link)">
        <span class="reading-number">{{ s.n }}</span>
        <h3>{{ s.title }}</h3>
        <p>{{ s.desc }}</p>
        <span class="reading-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </section>

  <section class="home-bottom">
    <div>
      <span class="eyebrow">SCOPE BOUNDARY</span>
      <h2>只写 chattrade-workspace。</h2>
      <p>现货撮合引擎、期权手册、OTC 等多商户交易所模版内容不属于本站。若你在维护 tgex.net，请使用对应仓库文档。</p>
    </div>
    <a :href="withBase('/pages/0101')">查看项目边界 <span aria-hidden="true">→</span></a>
  </section>
</main>
</template>
