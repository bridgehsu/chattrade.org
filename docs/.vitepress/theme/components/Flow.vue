<script setup lang="ts">
defineProps<{ steps: string[] }>()
</script>
<template>
  <figure class="flow-diagram" aria-label="业务流程图">
    <figcaption>PROCESS FLOW <span>按业务顺序阅读</span></figcaption>
    <ol>
      <li v-for="(step, i) in steps" :key="step"><span class="flow-number">{{ String(i + 1).padStart(2, '0') }}</span><span>{{ step }}</span></li>
    </ol>
  </figure>
</template>
