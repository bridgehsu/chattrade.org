import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomePage from './components/HomePage.vue'
import Flow from './components/Flow.vue'
import SpotLedger from './components/SpotLedger.vue'
import './style.css'
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('Flow', Flow)
    app.component('SpotLedger', SpotLedger)
  }
} satisfies Theme
