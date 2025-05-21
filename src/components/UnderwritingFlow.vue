<script setup lang="ts">
import { VueFlow, useVueFlow, Panel, Handle } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { parseUnderwritingData } from '../utils/underwritingParser'
import underwritingData from '../data/underwriting/100A.json'
import initData from '../assets/data/decisionDiagram/100A_init.json'
import { ref, markRaw, shallowRef, provide } from 'vue'
import CustomNode from './CustomNode.vue' // <== 這裡！

const expandedNodeId = ref<string | null>(null)
provide('expandedNodeId', expandedNodeId)

// const { nodes: initialNodes, edges: initialEdges } = parseUnderwritingData(underwritingData)
const { nodes: initialNodes, edges: initialEdges } = initData
// const nodes = ref(initialNodes)
const nodes = ref(shallowRef(initialNodes.map(node => ({
  id: node.id,
  type: 'custom',
  position: node.position,
  data: {
    label: node.label,
    forBE: node.forBE
  }
}))))
const edges = ref(initialEdges)

const { onInit, fitView } = useVueFlow()

onInit((instance) => {
  instance.fitView()
})

const handleFitView = () => {
  fitView()
}
const nodeTypes = { custom: CustomNode }

</script>

<template>
  <div style="width: 100vw; height: 100vh">
    <!-- <VueFlow v-model="nodes" v-model:edges="edges"> -->
      <VueFlow :min-zoom="0.0001" :max-zoom="2" 
      :nodes="nodes" :edges="edges" @update:nodes="nodes = $event" @update:edges="edges = $event"
      :elements-selectable="true"
      :selection-on-drag="true"
      :node-types="nodeTypes">
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