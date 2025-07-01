<script lang="ts" setup>
import { ref, watch, markRaw, onMounted, onUnmounted, computed } from 'vue'
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
import { useDecisionTree, parseExpressionType } from './composable/useDecisionTree'
import type { DecisionNode, DecisionEdge } from './core/interfaces/DecisionTree'
import { ColumnType, PropertiesState } from './core/enums/VueFlow'
import { downloadJson } from './utils/downloadJson'

const { decisionNodes, decisionEdges, addNode, deleteNode, addEdge, deleteEdge, clearSelectionEdge } = useDecisionTree()
const { project, getNodes, getEdges, addNodes, addEdges, setNodes, setEdges } = useVueFlow()

const nodeTypes = {
  custom: markRaw(CustomNode)
}
const selectionEdgeStyle = {
      stroke: '#ff0000',
      strokeWidth: 2
    }
// 修改狀態相關的變數
const propertiesState = ref<PropertiesState>(PropertiesState.NONE)
const selectedNode = ref<DecisionNode | null>(null)
const selectedEdge = ref<DecisionEdge | null>(null)

const onNodeClick = (event: NodeMouseEvent) => {
  selectedNode.value = event.node as DecisionNode
  selectedEdge.value = null
  propertiesState.value = PropertiesState.SELECT_NODE
}

// 處理點擊連接線
const onEdgeClick = ({ edge }: EdgeMouseEvent) => {
  selectedNode.value = null
  selectedEdge.value = edge as DecisionEdge
  propertiesState.value = PropertiesState.SELECT_EDGE;
}

// 處理點擊空白處
const onPaneClick = () => {
  clearSelectionEdge()
  selectedNode.value = null
  selectedEdge.value = null
  propertiesState.value = PropertiesState.NONE
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
  console.log("onConnectHandler", params)
  // 找到來源節點
  const sourceNode: DecisionNode = getNodes.value.find((n: DecisionNode) => n.id === params.source) as DecisionNode;
  const newEdge: DecisionEdge = {
    id: `e${Date.now()}`,
    source: params.source,
    target: params.target,
    type: 'custom',
    animated: false,
    style: selectionEdgeStyle,
    data: {
      columnLabel: sourceNode.data?.metadataList?.[0]?.label || '',
      columnName: sourceNode.data?.metadataList?.[0]?.columnName || '',
      selected: true,
      expressionType: "等於",  // 預設值
      entryText: ''           // 預設值
    }
  }
  addEdges([newEdge])
  selectedEdge.value = newEdge
  selectedNode.value = null
  propertiesState.value = PropertiesState.NEW_EDGE
}

// 處理連接線更新
const handleEdgeUpdate = (decisionEdge: DecisionEdge) => {
  console.log('🟢 updatedEdge:', decisionEdge)
  // 更新邊緣數據
  const updateDecisionEdges = decisionEdges.value.map(edge => 
    edge.id === decisionEdge.id ? decisionEdge : edge
  )
  setEdges(updateDecisionEdges)
  // const edgeIndex = decisionEdges.value.findIndex(e => e.id === updatedEdge.id)
  // if (edgeIndex !== -1) {
  //   // 創建新的邊緣數據
  //   const updatedEdgeData = {
  //     ...graphData.value.edges[edgeIndex],
  //     label: `${parseExpressionType(updatedEdge.metadata.expressionType)} ${updatedEdge.metadata.entryText}`,
  //     data: {
  //       ...graphData.value.edges[edgeIndex].data,
  //       metadata: {
  //         columnName: updatedEdge.metadata.columnName,
  //         expressionType: updatedEdge.metadata.expressionType,
  //         entryText: updatedEdge.metadata.entryText
  //       }
  //     }
  //   }
    
  //   // 更新邊緣數據
  //   const newEdges = graphData.value.edges.map(edge => 
  //     edge.id === updatedEdge.id ? updatedEdgeData : edge
  //   )
  //   setEdges(newEdges)
  // }
  // selectedEdge.value = null
  // propertiesState.value = PropertiesState.NONE
}

// 處理取消編輯連接線
const handleEdgeCancel = () => {
  selectedEdge.value = null

  // 清除所有邊的選中狀態
  decisionEdges.value = decisionEdges.value.map(e => ({...e,style: {}}))
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
  // const input = event.target as HTMLInputElement
  // if (!input.files || input.files.length === 0) return
  // const file = input.files[0]
  // const reader = new FileReader()
  // reader.onload = (e) => {
  //   try {
  //     const result = e.target?.result as string
  //     const json = JSON.parse(result)
  //     console.log('🟢 json:', json)
  //     if (json.nodes && json.edges) {
  //       console.log(1)
  //       graphData.value.nodes = json.nodes
  //       console.log(2)
  //       graphData.value.edges = json.edges
  //       console.log(3)
  //     } else {
  //       alert('JSON 檔案格式錯誤，需包含 nodes 與 edges')
  //     }
  //   } catch (err) {
  //     alert('解析 JSON 檔案失敗')
  //   }
  // }
  // reader.readAsText(file)
}

const getStructure = () => {
  console.log("getNodes", getNodes)
  console.log('getEdges', getEdges)
  // console.log('🟢 nodes:', JSON.parse(JSON.stringify(graphData.value.nodes)))
  // console.log('🟠 edges:', JSON.parse(JSON.stringify(graphData.value.edges)))
  // console.log('getNodes', getNodes)
  // console.log('getEdges', getEdges)
  // downloadJson({ nodes: graphData.value.nodes, edges: graphData.value.edges }, 'structure.json')
}

// 處理節點更新
const handleNodeUpdate = (newDecisionNode: DecisionNode) => {
  // const nodeIndex = graphData.value.nodes.findIndex(n => n.id === newDecisionNode.id)
  // if (nodeIndex !== -1) {
  //   const oldDecisionNode: DecisionNode = graphData.value.nodes[nodeIndex];
  //   // const decisionNodeData: DecisionNodeData = newDecisionNode.data;
  //   const updateDecisionNode: DecisionNode = {
  //     ...oldDecisionNode,
  //     data: newDecisionNode.data
  //   }
  //   // 使用 updateNode 來更新節點
  //   updateNode(updateDecisionNode.id, updateDecisionNode)
  // }
  
  // // 清除所有節點的選中狀態
  // graphData.value.nodes = graphData.value.nodes.map(n => ({
  //   ...n,
  //   selected: false
  // }))
}

// 處理節點刪除
const handleNodeDelete = (nodeId: string) => {
  decisionNodes.value = decisionNodes.value.filter((node) => node.id !== nodeId)
}

const handleCloseNodeForm = () => {
  // propertiesState.value = PropertiesState.NONE
  // selectedNode.value = null
  // // 清除所有節點的選中狀態
  // graphData.value.nodes = graphData.value.nodes.map(n => ({
  //   ...n,
  //   selected: false
  // }))
}

// 處理點擊新增按鈕
const handleAddNodeClick = () => {
  selectedNode.value = null
  selectedEdge.value = null
  propertiesState.value = PropertiesState.NEW_NODE
}

// 處理新增元件
const handleAddNode = (decisionNode: DecisionNode) => {
  decisionNode.selected = false
  addNodes([decisionNode])
  propertiesState.value = PropertiesState.NONE
}

const handleEdgeDelete = (edgeId: string) => {
  setEdges((edges) => edges.filter((edge) => edge.id !== edgeId))
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
        v-model:nodes="decisionNodes"
        v-model:edges="decisionEdges"
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