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

const { decisionNodes, decisionEdges, addNode, deleteNode, addEdge, deleteEdge, clearSelectionEdge, toDecisionDiagramJson } = useDecisionTree()
const { project, getNodes, getEdges, addNodes, addEdges, setNodes, setEdges, updateNode } = useVueFlow()

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
  console.log("onEdgeClick", edge)
  clearSelectionEdge()
  const updateEdge = {
    ...edge,
    style: selectionEdgeStyle,
  }
  selectedNode.value = null
  selectedEdge.value = updateEdge as DecisionEdge
  const updateDecisionEdges = decisionEdges.value.map(originEdge => 
  originEdge.id === updateEdge.id ? updateEdge : originEdge
  )
  setEdges(updateDecisionEdges)
  
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
  selectedNode.value = null
  selectedEdge.value = newEdge as DecisionEdge
  propertiesState.value = PropertiesState.NEW_EDGE
}

// 處理連接線更新
const handleEdgeUpdate = (decisionEdge: DecisionEdge) => {
  console.log('🟢 updatedEdge:', decisionEdge)
  decisionEdge.label = `${parseExpressionType(decisionEdge.data?.expressionType || '')} ${decisionEdge.data?.entryText}`
  console.log("decisionEdges", decisionEdges)
  // 更新邊緣數據
  const updateDecisionEdges = decisionEdges.value.map(edge => 
    edge.id === decisionEdge.id ? decisionEdge : edge
  )
  setEdges(updateDecisionEdges)
}

// 處理取消編輯連接線
const handleEdgeCancel = () => {
  selectedEdge.value = null

  // 清除所有邊的選中狀態
  decisionEdges.value = decisionEdges.value.map(e => ({...e,style: {}}))
  propertiesState.value = PropertiesState.NONE
}

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
      if (json.nodes && json.edges) {
        decisionNodes.value = json.nodes
        decisionEdges.value = json.edges
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
  toDecisionDiagramJson()
  downloadJson(toDecisionDiagramJson(), 'structure.json')
}

// 處理節點更新 finish
const handleNodeUpdate = (newDecisionNode: DecisionNode) => {
  console.log("handleNodeUpdate", newDecisionNode)
  updateNode(newDecisionNode.id, (node) => {
    node.selected = false // 單獨改 selected
    node.data = {
      ...node.data,
      ...newDecisionNode.data
    }
    return node
  })
  selectedNode.value = null
  propertiesState.value = PropertiesState.NONE
}

// 處理節點刪除 finish
const handleNodeDelete = (nodeId: string) => {
  decisionNodes.value = decisionNodes.value.filter((node) => node.id !== nodeId)
  selectedNode.value = null
  propertiesState.value = PropertiesState.NONE
}

const handleCloseNodeForm = () => {
  if (selectedNode.value?.id) {
    updateNode(selectedNode.value?.id, (node) => {
      node.selected = false
      return node
    })
  }
  selectedNode.value = null
  propertiesState.value = PropertiesState.NONE
}

// 處理點擊新增按鈕
const handleAddNodeClick = () => {
  selectedNode.value = null
  selectedEdge.value = null
  propertiesState.value = PropertiesState.NEW_NODE
}

// 處理新增元件
const handleAddNode = (decisionNode: DecisionNode) => {
  addNodes([decisionNode])
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