<script lang="ts" setup>
import { ref, watch, markRaw } from 'vue'
import {
  VueFlow,
  useVueFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type EdgeMouseEvent,
  type NodeMouseEvent,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import PropertiesPanel from './components/PropertiesPanel.vue'
import CustomNode from './components/CustomNode.vue'
import { useGraph } from './composable/useGraph'
import type { VueFlowNode, VueFlowEdge } from './core/interfaces/VueFlow'
import { PropertiesState } from './core/enums/VueFlow'

const { graphData, addNode, addEdge, deleteNode, deleteEdge } = useGraph()
const { updateNode, setEdges } = useVueFlow()

const nodeTypes = {
  custom: markRaw(CustomNode)
}

const { onConnect, onNodesChange, onEdgesChange, project } = useVueFlow()

// 修改狀態相關的變數
const propertiesState = ref<PropertiesState>(PropertiesState.NONE)
const selectedNode = ref<VueFlowNode | null>(null)
const selectedEdge = ref<VueFlowEdge | null>(null)

// 處理節點點擊
const onNodeClick = (event: NodeMouseEvent) => {
  console.log("onNodeClick")
  const node = event.node
  
  // 先清除所有節點的選中狀態
  graphData.value.nodes = graphData.value.nodes.map(n => ({
    ...n,
    selected: false
  }))
  // 從節點數據中提取必要的信息
  const VueFlowNode: VueFlowNode = {
    id: node.id,
    type: node.type || 'custom',
    position: node.position,
    columnType: node.data?.columnType || 'C',
    metadataList: node.data?.metadataList
  }
  selectedNode.value = VueFlowNode
  selectedEdge.value = null
  propertiesState.value = PropertiesState.SELECT_NODE
  
  // 更新當前節點的選中狀態
  graphData.value.nodes = graphData.value.nodes.map(n => ({
    ...n,
    selected: n.id === node.id
  }))
}

// 處理點擊空白處
const onPaneClick = () => {
  selectedNode.value = null
  selectedEdge.value = null
  propertiesState.value = PropertiesState.NONE
  
  // 清除所有節點的選中狀態
  graphData.value.nodes = graphData.value.nodes.map(n => ({
    ...n,
    selected: false
  }))

  // 清除所有邊的選中狀態
  graphData.value.edges = graphData.value.edges.map(e => ({
    ...e,
    style: {
      ...e.style,
      stroke: '#000',
      strokeWidth: 1
    }
  }))
}

// 處理新增連接
const onConnectHandler = (params: Connection) => {
  const newEdge: VueFlowEdge = {
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
  selectedNode.value = null
  propertiesState.value = PropertiesState.NEW_EDGE
  
  addEdge(newEdge)
}

// 處理點擊連接線
const onEdgeClick = ({ edge }: EdgeMouseEvent) => {
  propertiesState.value = PropertiesState.SELECT_EDGE;
  const graphEdge: VueFlowEdge = {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type || 'default',
    animated: edge.animated || false,
    style: {
      ...edge.style,
      stroke: '#ff0000',
      strokeWidth: 2
    },
    metadata: {
      columnName: edge.data?.metadata?.columnName || '',
      expressionType: edge.data?.metadata?.expressionType || '',
      entryText: edge.data?.metadata?.entryText || ''
    }
  }
  console.log("selectedEdge", selectedEdge)
  selectedEdge.value = graphEdge

  // 更新所有邊的樣式
  graphData.value.edges = graphData.value.edges.map(e => ({
    ...e,
    style: {
      ...e.style,
      stroke: e.id === edge.id ? '#ff0000' : '#000',
      strokeWidth: e.id === edge.id ? 2 : 1
    }
  }))
}

// 處理連接線更新
const handleEdgeUpdate = (updatedEdge: VueFlowEdge) => {
  const edgeIndex = graphData.value.edges.findIndex(e => e.id === updatedEdge.id)
  if (edgeIndex !== -1) {
    // 創建新的邊緣數據
    const updatedEdgeData = {
      ...graphData.value.edges[edgeIndex],
      label: updatedEdge.metadata.entryText,
      data: {
        ...graphData.value.edges[edgeIndex].data,
        label: updatedEdge.metadata.entryText,
        metadata: {
          columnName: updatedEdge.metadata.columnName,
          expressionType: updatedEdge.metadata.expressionType,
          entryText: updatedEdge.metadata.entryText
        }
      }
    }
    
    // 更新邊緣數據
    const newEdges = graphData.value.edges.map(edge => 
      edge.id === updatedEdge.id ? updatedEdgeData : edge
    )
    setEdges(newEdges)
  }
  selectedEdge.value = null
}

// 處理取消編輯連接線
const handleEdgeCancel = () => {
  selectedEdge.value = null

  // 清除所有邊的選中狀態
  graphData.value.edges = graphData.value.edges.map(e => ({
    ...e,
    style: {
      ...e.style,
      stroke: '#000',
      strokeWidth: 1
    }
  }))
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
    // console.log('🟢 nodes updated:', val)
  },
  { deep: true },
)

watch(
  () => graphData.value.edges,
  (val) => {
    // console.log('🟠 edges updated:', val)
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

    const newNode: VueFlowNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      columnType: nodeData.data.metadataList?.[0]?.columnType || 'C',
      metadataList: [{
        index: 0,
        label: nodeData.data.label || '新節點',
        desc: nodeData.data.metadataList?.[0]?.desc || '',
        columnName: nodeData.data.metadataList?.[0]?.columnName || '',
        dataType: nodeData.data.metadataList?.[0]?.dataType || 'STRING',
        mandatory: nodeData.data.metadataList?.[0]?.mandatory || false,
        codeId: nodeData.data.metadataList?.[0]?.codeId || '',
        codeUid: nodeData.data.metadataList?.[0]?.codeUid || '',
        resultValue: ''
      }]
    }

    addNode(newNode)
  } catch (error) {
    console.error('拖拽節點時發生錯誤:', error)
  }
}

// 處理節點更新
const handleNodeUpdate = (updatedNode: VueFlowNode) => {
  const nodeIndex = graphData.value.nodes.findIndex(n => n.id === updatedNode.id)
  if (nodeIndex !== -1) {
    const updatedData = {
      ...graphData.value.nodes[nodeIndex],
      label: updatedNode.metadataList[0].label,
      data: {
        ...graphData.value.nodes[nodeIndex].data,
        label: updatedNode.metadataList[0].label,
        metadataList: updatedNode.metadataList
      }
    }
    // 使用 updateNode 來更新節點
    updateNode(updatedNode.id, updatedData)
  }
  
  // 清除所有節點的選中狀態
  graphData.value.nodes = graphData.value.nodes.map(n => ({
    ...n,
    selected: false
  }))
}

// 處理節點刪除
const handleNodeDelete = (nodeId: string) => {
  deleteNode(nodeId)
  selectedNode.value = null
  
  // 清除所有節點的選中狀態
  graphData.value.nodes = graphData.value.nodes.map(n => ({
    ...n,
    selected: false
  }))
}

const handleCloseNodeForm = () => {
  propertiesState.value = PropertiesState.NONE
  selectedNode.value = null
  // 清除所有節點的選中狀態
  graphData.value.nodes = graphData.value.nodes.map(n => ({
    ...n,
    selected: false
  }))
}

// 處理點擊新增按鈕
const handleAddNodeClick = () => {
  selectedNode.value = null
  selectedEdge.value = null
  propertiesState.value = PropertiesState.NEW_NODE
}

// 處理新增元件
const handleAddNode = (nodeData: VueFlowNode) => {
  // 設置新節點的位置在視圖中心
  const viewport = { x: 0, y: 0, zoom: 1.5 }
  const position = {
    x: (window.innerWidth / 2 - 100) / viewport.zoom,
    y: (window.innerHeight / 2 - 50) / viewport.zoom
  }
  
  const newNode: VueFlowNode = {
    ...nodeData,
    position,
    type: 'custom',
  }
  
  console.log('新增節點:', newNode)
  addNode(newNode)
  propertiesState.value = PropertiesState.NONE
}

const handleEdgeDelete = (edgeId: string) => {
  deleteEdge(edgeId)
  selectedEdge.value = null
  
  // 清除所有邊的選中狀態
  graphData.value.edges = graphData.value.edges.map(e => ({
    ...e,
    style: {
      ...e.style,
      stroke: '#000',
      strokeWidth: 1
    }
  }))
}
</script>

<template>
  <div class="app-container">
    <PropertiesPanel 
      class="properties-panel" 
      :selectedNode="selectedNode"
      :propertiesState="propertiesState"
      :selectedEdge="selectedEdge"
      @updateNode="handleNodeUpdate"
      @addNode="handleAddNode"
      @deleteNode="handleNodeDelete"
      @closeNodeForm="handleCloseNodeForm"
      @updateEdge="handleEdgeUpdate"
      @deleteEdge="handleEdgeDelete"
      @cancelEdge="handleEdgeCancel"
    />
    <div class="flow-container">
      <button class="btn btn-absolute add-node-btn" @click="handleAddNodeClick">
        <span class="plus-icon">+</span>
        新增元件
      </button>
      <VueFlow
        v-model:nodes="graphData.nodes"
        v-model:edges="graphData.edges"
        :node-types="nodeTypes"
        :default-viewport="{ x:  1500, y: 300, zoom: 0.5 }"
        :min-zoom="0.01"
        :max-zoom="4"
        :auto-connect="false"
        :connect-on-click="false"
        class="vue-flow"
        @connect="onConnectHandler"
        @edge-click="onEdgeClick"
        @node-click="onNodeClick"
        @pane-click="onPaneClick"
        @dragover="onDragOver"
        @drop="onDrop"
      >
        <Background />
        <Controls />
        <MiniMap />
        <template #edge-label="{ data }">
          <div class="edge-label">
            {{ data?.metadata?.columnName }}
            {{ data?.metadata?.expressionType }}
            {{ data?.metadata?.entryText }}
          </div>
        </template>
      </VueFlow>
      <button @click="getStructure" class="btn btn-absolute structure-btn">取得結構</button>
    </div>
  </div>
</template>


<style lang="scss">
@use './styles/app.scss';
</style>