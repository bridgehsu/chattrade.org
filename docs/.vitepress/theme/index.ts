import Teek from 'vitepress-theme-teek'
import type { Theme } from 'vitepress'
import HomePage from './components/HomePage.vue'
import Flow from './components/Flow.vue'
import SpotLedger from './components/SpotLedger.vue'
import 'vitepress-theme-teek/index.css'
import './style.css'

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('Flow', Flow)
    app.component('SpotLedger', SpotLedger)
  }
} satisfies Theme
