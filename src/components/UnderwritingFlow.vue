<script setup lang="ts">
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { parseUnderwritingData } from '../utils/underwritingParser'
import underwritingData from '../data/underwriting/100A.json'
import initData from '../data/decisionDiagram/100A_init.json'
import { ref } from 'vue'

// const { nodes: initialNodes, edges: initialEdges } = parseUnderwritingData(underwritingData)
const { nodes: initialNodes, edges: initialEdges } = initData

const nodes = ref(initialNodes)
const edges = ref(initialEdges)

const { onInit, fitView } = useVueFlow()

onInit((instance) => {
  instance.fitView()
})

const handleFitView = () => {
  fitView()
}
</script>

<template>
  <div style="width: 100vw; height: 100vh">
    <!-- <VueFlow v-model="nodes" v-model:edges="edges"> -->
      <VueFlow :min-zoom="0.01"
      :max-zoom="2" :nodes="nodes" :edges="edges" @update:nodes="nodes = $event" @update:edges="edges = $event">
      <Panel position="top-right">
        <button @click="handleFitView">適應視圖</button>
      </Panel>
    </VueFlow>
  </div>
</template>

<style scoped>
.vue-flow {
  background-color: #f8f8f8;
}
</style> 