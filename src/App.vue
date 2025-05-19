<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  VueFlow,
  useVueFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type EdgeMouseEvent,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import NodeLibrary from './components/NodeLibrary.vue'
import CustomNode from './components/CustomNode.vue'
import initData from './data/decisionDiagram/100A_Init.json'

// const nodes = ref<Node[]>(initData.nodes)
  const nodes = ref<Node[]>(initData.nodes.map(node => ({
  id: node.id,
  type: 'custom',
  position: node.position,
  data: {
    label: node.metadata.label,
    metadata: node.metadata
  }
})))
const edges = ref<Edge[]>(initData.edges)

const nodeTypes = {
  custom: CustomNode
}

const { onConnect, onNodesChange, onEdgesChange, project } = useVueFlow()

// 新增連接線文字相關的狀態
const edgeUpdateText = ref('')
const selectedEdge = ref<Edge | null>(null)
const isEditing = ref(false)

// 處理新增連接
const onConnectHandler = (params: Connection) => {
  const newEdge = {
    ...params,
    id: `e${edges.value.length + 1}`,
    label: '',
    labelStyle: { fill: '#000000' },
  }
  selectedEdge.value = newEdge
  isEditing.value = true
  edges.value = [...edges.value, newEdge]
}

// 處理點擊連接線
const onEdgeClick = ({ edge }: EdgeMouseEvent) => {
  selectedEdge.value = edge
  edgeUpdateText.value = edge.label as string || ''
  isEditing.value = true
}

onNodesChange((changes: NodeChange[]) => {
  nodes.value = applyNodeChanges(changes, nodes.value)
})

onEdgesChange((changes: EdgeChange[]) => {
  edges.value = applyEdgeChanges(changes, edges.value)
})

watch(
  nodes,
  (val) => {
    console.log('🟢 nodes updated:', val)
  },
  { deep: true },
)

watch(
  edges,
  (val) => {
    console.log('🟠 edges updated:', val)
  },
  { deep: true },
)

const getStructure = () => {
  console.log('🟢 nodes:', nodes.value)
  console.log('🟠 edges:', edges.value)
}

onConnect(onConnectHandler)

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  
  if (!event.dataTransfer) return
  
  try {
    const nodeData = JSON.parse(event.dataTransfer.getData('application/json'))
    const position = project({
      x: event.clientX,
      y: event.clientY,
    })

    const newNode: Node = {
      id: `node-${nodes.value.length + 1}`,
      type: nodeData.type,
      position,
      data: nodeData.data
    }

    nodes.value = [...nodes.value, newNode]
  } catch (error) {
    console.error('Error dropping node:', error)
  }
}
</script>

<template>
  <div class="app-container">
    <NodeLibrary class="node-library" />
    <div class="flow-container">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :default-viewport="{ x: 0, y: 0, zoom: 1.5 }"
        :min-zoom="0.2"
        :max-zoom="4"
        :auto-connect="false"
        :connect-on-click="false"
        class="vue-flow"
        @connect="onConnectHandler"
        @edge-click="onEdgeClick"
        @dragover="onDragOver"
        @drop="onDrop"
      >
        <Background />
        <Controls />
        <MiniMap />
      </VueFlow>
      <button @click="getStructure" class="submit-btn">取得結構</button>
    </div>
  </div>
</template>

<style>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.flow-container {
  flex: 1;
  height: 100%;
}

.vue-flow {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
}

.vue-flow__drop-target {
  background-color: rgba(0, 0, 0, 0.1);
}

body {
  margin: 0;
  padding: 0;
}
</style>
