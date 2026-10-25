<script setup lang="ts">
import { computed, ref } from 'vue'
const phase = ref('partial')
const fill = ref(60)
const stages = [{ id: 'initial', text: '初始' }, { id: 'placed', text: '已下单' }, { id: 'partial', text: '部分成交' }, { id: 'cancelled', text: '撤销剩余' }]
const filled = computed(() => ['partial', 'cancelled'].includes(phase.value) ? fill.value : 0)
const spentCents = computed(() => 600 * filled.value)
const remainingCents = computed(() => 60000 - spentCents.value)
const available = computed(() => phase.value === 'initial' ? 100000 : phase.value === 'cancelled' ? 100000 - spentCents.value : 40000)
const frozen = computed(() => phase.value === 'initial' || phase.value === 'cancelled' ? 0 : remainingCents.value)
const btc = computed(() => (filled.value / 10000).toFixed(4))
const money = (cents: number) => (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>
<template>
  <section class="ledger-demo" aria-label="现货资产变化演算">
    <div class="demo-heading"><div><span class="small-label">INTERACTIVE EXAMPLE</span><h3>订单变化，资金如何变化？</h3></div><span class="example-tag">教学演算</span></div>
    <p>本金 1,000 USDT · 限价 60,000 · 买入 0.01 BTC · 不计手续费</p>
    <div class="demo-tabs" role="group" aria-label="选择交易阶段">
      <button v-for="stage in stages" :key="stage.id" :aria-pressed="phase === stage.id" :class="{ active: phase === stage.id }" @click="phase = stage.id">{{ stage.text }}</button>
    </div>
    <div class="slider-row" v-if="phase === 'partial' || phase === 'cancelled'">
      <label for="fill-ratio">已成交比例 <strong>{{ fill }}%</strong></label>
      <input id="fill-ratio" type="range" min="1" max="99" step="1" v-model.number="fill" />
    </div>
    <div class="balance-grid" aria-live="polite" aria-atomic="true">
      <div><span>可用 USDT</span><strong>{{ money(available) }}</strong></div>
      <div><span>冻结 USDT</span><strong>{{ money(frozen) }}</strong></div>
      <div><span>新增 BTC</span><strong>{{ btc }}</strong></div>
    </div>
    <div class="demo-equation">资金核对：可用 {{ money(available) }} + 冻结 {{ money(frozen) }} + 已支出 {{ money(spentCents) }} = 1,000.00 USDT</div>
    <small>假设成交价等于限价；真实结算还需考虑价格差与手续费。</small>
  </section>
</template>
