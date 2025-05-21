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
  type NodeMouseEvent,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import NodeLibrary from './components/NodeLibrary.vue'
import CustomNode from './components/CustomNode.vue'
import { useGraph } from './composable/useGraph'
import type { GraphNode, GraphEdge } from './types/graph'

const { graphData, addNode, addEdge, deleteNode, deleteEdge } = useGraph()
const { updateNode } = useVueFlow()

const nodeTypes = {
  custom: CustomNode
}

const { onConnect, onNodesChange, onEdgesChange, project } = useVueFlow()

// 新增連接線文字相關的狀態
const edgeUpdateText = ref('')
const selectedEdge = ref<Edge | null>(null)
const isEditing = ref(false)
const selectedNode = ref<GraphNode | null>(null)

// 處理節點點擊
const onNodeClick = (event: NodeMouseEvent) => {
  const node = event.node
  // 從節點數據中提取必要的信息
  const graphNode: GraphNode = {
    id: node.id,
    type: node.type || 'custom',
    position: node.position,
    metadata: {
      index: 0,
      columnType: node.data?.metadata?.columnType || 'C',
      label: node.data?.label || '',
      desc: node.data?.metadata?.desc || '',
      columnName: node.data?.metadata?.columnName || '',
      dataType: node.data?.metadata?.dataType || 'STRING',
      mandatory: node.data?.metadata?.mandatory || false,
      codeId: node.data?.metadata?.codeId || '',
      codeUid: node.data?.metadata?.codeUid || ''
    }
  }
  selectedNode.value = graphNode
}

// 處理新增連接
const onConnectHandler = (params: Connection) => {
  const newEdge: GraphEdge = {
    id: `e${Date.now()}`,
    source: params.source,
    target: params.target,
    type: 'default',
    animated: false,
    style: {},
    metadata: {
      columnName: '',
      expressionType: '',
      entryText: ''
    }
  }
  selectedEdge.value = newEdge
  isEditing.value = true
  addEdge(newEdge)
}

// 處理點擊連接線
const onEdgeClick = ({ edge }: EdgeMouseEvent) => {
  selectedEdge.value = edge
  edgeUpdateText.value = edge.label as string || ''
  isEditing.value = true
}

onNodesChange((changes: NodeChange[]) => {
  graphData.value.nodes = applyNodeChanges(changes, graphData.value.nodes)
})

onEdgesChange((changes: EdgeChange[]) => {
  graphData.value.edges = applyEdgeChanges(changes, graphData.value.edges)
})

watch(
  () => graphData.value.nodes,
  (val) => {
    console.log('🟢 nodes updated:', val)
  },
  { deep: true },
)

watch(
  () => graphData.value.edges,
  (val) => {
    console.log('🟠 edges updated:', val)
  },
  { deep: true },
)

const getStructure = () => {
  console.log('🟢 nodes:', graphData.value.nodes)
  console.log('🟠 edges:', graphData.value.edges)
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

    const newNode: GraphNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      metadata: {
        index: 0,
        columnType: nodeData.data.metadata.columnType || 'C',
        label: nodeData.data.label || '新節點',
        desc: nodeData.data.metadata.desc || '',
        columnName: nodeData.data.metadata.columnName || '',
        dataType: nodeData.data.metadata.dataType || 'STRING',
        mandatory: nodeData.data.metadata.mandatory || false,
        codeId: nodeData.data.metadata.codeId || '',
        codeUid: nodeData.data.metadata.codeUid || ''
      }
    }

    addNode(newNode)
  } catch (error) {
    console.error('拖拽節點時發生錯誤:', error)
  }
}

// 處理節點更新
const handleNodeUpdate = (updatedNode: GraphNode) => {
  const nodeIndex = graphData.value.nodes.findIndex(n => n.id === updatedNode.id)
  console.log('🟢 nodeIndex:', nodeIndex)
  if (nodeIndex !== -1) {
    const updatedData = {
      ...graphData.value.nodes[nodeIndex],
      label: updatedNode.metadata.label,
      data: {
        ...graphData.value.nodes[nodeIndex].data,
        label: updatedNode.metadata.label,
        metadata: updatedNode.metadata
      }
    }
    console.log('🟢 updatedData:', updatedData)
    console.log('🟢 graphData.value.nodes:', graphData.value.nodes)
    
    // 使用 updateNode 來更新節點
    updateNode(updatedNode.id, updatedData)
  }
}

// 處理節點刪除
const handleNodeDelete = (nodeId: string) => {
  deleteNode(nodeId)
  selectedNode.value = null
}
</script>

<template>
  <div class="app-container">
    <NodeLibrary 
      class="node-library" 
      :selectedNode="selectedNode"
      @update:selectedNode="selectedNode = $event"
      @updateNode="handleNodeUpdate"
      @deleteNode="handleNodeDelete"
    />
    <div class="flow-container">
      <VueFlow
        v-model:nodes="graphData.nodes"
        v-model:edges="graphData.edges"
        :node-types="nodeTypes"
        :default-viewport="{ x: 0, y: 0, zoom: 1.5 }"
        :min-zoom="0.01"
        :max-zoom="4"
        :auto-connect="false"
        :connect-on-click="false"
        class="vue-flow"
        @connect="onConnectHandler"
        @edge-click="onEdgeClick"
        @node-click="onNodeClick"
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
