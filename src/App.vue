<script lang="ts" setup>
import { ref, watch, markRaw, onMounted, onUnmounted } from 'vue'
import {
  VueFlow,
  useVueFlow,
  type Connection,
  type EdgeMouseEvent,
  type NodeMouseEvent,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import PropertiesPanel from './components/PropertiesPanel.vue'
import CustomNode from './components/CustomNode.vue'
import { useGraph, parseExpressionType } from './composable/useGraph'
import type { DecisionNode, DecisionNodeData, VueFlowEdge } from './core/interfaces/VueFlow'
import { PropertiesState } from './core/enums/VueFlow'
import { downloadJson } from './utils/downloadJson'

const { viewport } = useVueFlow()

const { graphData, addNode, addEdge, deleteNode, deleteEdge } = useGraph()
const { updateNode, setEdges,  onConnect, onNodesChange, onEdgesChange, project, getNodes, getEdges } = useVueFlow()

const nodeTypes = {
  custom: markRaw(CustomNode)
}

// 修改狀態相關的變數
const propertiesState = ref<PropertiesState>(PropertiesState.NONE)
const selectedNode = ref<DecisionNode | null>(null)
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
  const decisionNode: DecisionNode = {
    id: node.id,
    type: node.type || 'custom',
    position: node.position,
    data: {
      columnType: node.data?.columnType || 'C',
      metadataList: node.data?.metadataList
    }
  }
  selectedNode.value = decisionNode
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

// 處理鍵盤刪除事件
const handleKeyPress = (event: KeyboardEvent) => {
  // 如果焦點在輸入框內，則不觸發刪除
  const target = event.target as HTMLElement
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
      selectedNode.value = null
      selectedEdge.value = null
      propertiesState.value = PropertiesState.NONE
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyPress))
onUnmounted(() => window.removeEventListener('keydown', handleKeyPress))

// 處理新增連接
const onConnectHandler = (params: Connection) => {
  console.log("onConnectHandler")
  // 找到來源節點
  const sourceNode = graphData.value.nodes.find(n => n.id === params.source)
  const newEdge: VueFlowEdge = {
    id: `e${Date.now()}`,
    source: params.source,
    target: params.target,
    type: 'default',
    animated: false,
    style: {},
    metadata: {
      label: sourceNode?.data?.metadataList?.[0]?.label || '',
      columnName: sourceNode?.data?.metadataList?.[0]?.columnName || '',
      expressionType: "等於",  // 預設值
      entryText: ''  // 預設值
    }
  }
  selectedEdge.value = newEdge
  selectedNode.value = null
  propertiesState.value = PropertiesState.NEW_EDGE
  
  addEdge(newEdge)
}

// 處理點擊連接線
const onEdgeClick = ({ edge }: EdgeMouseEvent) => {
  console.log("onEdgeClick", edge)
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
      label: edge.data?.metadata?.label || '',
      columnName: edge.data?.metadata?.columnName || '',
      expressionType: edge.data?.metadata?.expressionType || '',
      entryText: edge.data?.metadata?.entryText || ''
    }
  }
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
  console.log('🟢 updatedEdge:', updatedEdge)
  const edgeIndex = graphData.value.edges.findIndex(e => e.id === updatedEdge.id)
  if (edgeIndex !== -1) {
    // 創建新的邊緣數據
    const updatedEdgeData = {
      ...graphData.value.edges[edgeIndex],
      label: `${parseExpressionType(updatedEdge.metadata.expressionType)} ${updatedEdge.metadata.entryText}`,
      data: {
        ...graphData.value.edges[edgeIndex].data,
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
  propertiesState.value = PropertiesState.NONE
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
  propertiesState.value = PropertiesState.NONE
}

// watch(
//   () => graphData.value.nodes,
//   (val) => {
//     // console.log('🟢 nodes updated:', val)
//   },
//   { deep: true },
// )

// watch(
//   () => graphData.value.edges,
//   (val) => {
//     // console.log('🟠 edges updated:', val)
//   },
//   { deep: true },
// )

const fileInput = ref<HTMLInputElement | null>(null)

const setStructure = () => {
  fileInput.value?.click()
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string
      const json = JSON.parse(result)
      console.log('🟢 json:', json)
      if (json.nodes && json.edges) {
        console.log(1)
        graphData.value.nodes = json.nodes
        console.log(2)
        graphData.value.edges = json.edges
        console.log(3)
      } else {
        alert('JSON 檔案格式錯誤，需包含 nodes 與 edges')
      }
    } catch (err) {
      alert('解析 JSON 檔案失敗')
    }
  }
  reader.readAsText(file)
}

const getStructure = () => {
  console.log('🟢 nodes:', JSON.parse(JSON.stringify(graphData.value.nodes)))
  console.log('🟠 edges:', JSON.parse(JSON.stringify(graphData.value.edges)))
  console.log('getNodes', getNodes)
  console.log('getEdges', getEdges)
  downloadJson({ nodes: graphData.value.nodes, edges: graphData.value.edges }, 'structure.json')
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

    const newNode: decisionNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      data: {
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
    }

    addNode(newNode)
  } catch (error) {
    console.error('拖拽節點時發生錯誤:', error)
  }
}

// 處理節點更新
const handleNodeUpdate = (newDecisionNode: DecisionNode) => {
  const nodeIndex = graphData.value.nodes.findIndex(n => n.id === newDecisionNode.id)
  if (nodeIndex !== -1) {
    const oldDecisionNode: DecisionNode = graphData.value.nodes[nodeIndex];
    // const decisionNodeData: DecisionNodeData = newDecisionNode.data;
    const updateDecisionNode: DecisionNode = {
      ...oldDecisionNode,
      data: newDecisionNode.data
    }
    // 使用 updateNode 來更新節點
    updateNode(updateDecisionNode.id, updateDecisionNode)
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
  console.log("nodeData", nodeData)
  console.log("viewport", viewport)
  console.log("viewport.x", viewport.value.x)
  // 設置新節點的位置在視圖中心
  // const viewport = { x: 0, y: 0, zoom: 1.5 }
  // const x: number = nodeData.position.x===0?viewport.value.x/2: nodeData.position.x;
  // const y: number = nodeData.position.y===0?viewport.value.y/2: nodeData.position.y;
  // const position = {x,y};
  
  const newNode: VueFlowNode = {
    ...nodeData,
    // position,
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
  propertiesState.value = PropertiesState.NONE
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
      @close="handleCloseNodeForm"
      @updateEdge="handleEdgeUpdate"
      @deleteEdge="handleEdgeDelete"
      @cancelEdge="handleEdgeCancel"
    />
    <div class="flow-container">
      <div class="absolute-group" style="top: 1rem; right: 1rem;" aria-label="匯入匯出按鈕群組">
        <button class="btn add-node-btn" @click="handleAddNodeClick">
          <span class="plus-icon">+</span>
          新增元件
        </button>
      </div>
      <VueFlow
        v-model:nodes="graphData.nodes"
        v-model:edges="graphData.edges"
        :node-types="nodeTypes"
        :default-viewport="{ x:  900, y: 100, zoom: 0.8 }"
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
      </VueFlow>
      <div class="absolute-group" style="bottom: 1rem; right: 1rem;" aria-label="匯入匯出按鈕群組">
        <input ref="fileInput" type="file" accept="application/json" style="display:none" @change="onFileChange" />
        <button @click="setStructure" class="btn">匯入結構</button>
        <button @click="getStructure" class="btn">匯出結構</button>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
@use './styles/app.scss';

.edge-label {
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 12px;
  pointer-events: all;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>