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
  getConnectedEdges,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import UnderwritingFlow from './components/UnderwritingFlow.vue'

const initialNodes = [
  {
    id: '1',
    label: '疾病症狀 是否已知？',
    position: { x: 0, y: 0 },
    type: 'input',
    style: { backgroundColor: '#FFB6C1', color: '#000000', border: '1px solid #333' },
  },
  {
    id: '2',
    label: '手術狀況？',
    position: { x: 142, y: 105 },
    style: { backgroundColor: '#FFB6C1', color: '#000000', border: '1px solid #333' },
  },
  {
    id: '3',
    label: '腫瘤類型？',
    position: { x: -83, y: 187 },
    style: { backgroundColor: '#FFB6C1', color: '#000000', border: '1px solid #333' },
  },
  { id: '5', label: '診斷期間 >= 1 年？', position: { x: 350, y: 187 } },
  { id: '9', label: '依病因評估', position: { x: 500, y: 275 } },
  { id: 'r1', label: '結果：P', position: { x: -450, y: 130 }, type: 'output' },
  {
    id: 'r7',
    label: '結果：依肺癌標準評估',
    position: { x: -380, y: 290 },
    type: 'output',
    style: { backgroundColor: '#FFB6C1', color: '#000000', border: '1px solid #333' },
  },
  { id: 'r8', label: '結果：依病因評估', position: { x: 235, y: 275 }, type: 'output' },
  { id: 'r9', label: '結果：P', position: { x: 400, y: 390 }, type: 'output' },
  { id: 'r10', label: '結果：CMO', position: { x: 600, y: 390 }, type: 'output' },
]

const initialEdges = [
  { id: 'e1-r1', source: '1', target: 'r1', label: '不明' },
  {
    id: 'e1-2_2',
    source: '1',
    target: '2',
    label: '已知',
    style: { stroke: '#f00', strokeWidth: 2 },
  },
  {
    id: 'e2-3_2',
    source: '2',
    target: '3',
    label: '已手術(完全切除)',
    style: { stroke: '#f00', strokeWidth: 2 },
  },
  {
    id: 'e3-r7',
    source: '3',
    target: 'r7',
    label: '惡性',
    style: { stroke: '#f00', strokeWidth: 2 },
  },
  { id: 'e2-5_8', source: '2', target: '5', label: '未手術(未完全切除)' },
  { id: 'e5-r8', source: '5', target: 'r8', label: '有病因' },
  { id: 'e5-9', source: '5', target: '9', label: '無病因' },
  { id: 'e9-r9', source: '9', target: 'r9', label: '<1' },
  { id: 'e9-r10', source: '9', target: 'r10', label: '>=1' },
]

// const nodes = ref<Node[]>([...initialNodes])
// const edges = ref<Edge[]>([...initialEdges])

const nodes = ref<Node[]>([...initialNodes])
const edges = ref<Edge[]>([...initialEdges])

const { onConnect, addEdges, onNodesChange, onEdgesChange, project, getNodes, getEdges } = useVueFlow()

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

// 更新連接線文字
const updateEdgeLabel = () => {
  if (selectedEdge.value && edgeUpdateText.value) {
    edges.value = edges.value.map(edge => 
      edge.id === selectedEdge.value?.id 
        ? { ...edge, label: edgeUpdateText.value }
        : edge
    )
  }
  isEditing.value = false
  selectedEdge.value = null
  edgeUpdateText.value = ''
}

// 取消編輯
const cancelEditing = () => {
  isEditing.value = false
  selectedEdge.value = null
  edgeUpdateText.value = ''
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

onConnect(onConnectHandler)

// Clean node/edge
const cleanNodeData = (node: any) => ({
  id: node.id,
  label: node.label,
  position: node.position,
  type: node.type,
})
const cleanEdgeData = (edge: any) => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  label: edge.label,
})
const parseData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item) =>
      item?.id ? (item.source && item.target ? cleanEdgeData(item) : cleanNodeData(item)) : item,
    )
  }
  return data
}
const getCurrentState = () => ({
  nodes: JSON.stringify(parseData(nodes.value), null, 2),
  edges: JSON.stringify(parseData(edges.value), null, 2),
})
const logCurrentState = () => {
  console.log(getCurrentState())
}

// 新增節點功能
let nodeIdCounter = initialNodes.length + 1

interface Factor {
  id: string
  label: string
  type: string
  fieldCategory: string
  variableName: string
  isExpanded?: boolean
}

const newNodeData = ref<Factor>({
  id: '',
  label: '',
  type: 'default',
  fieldCategory: 'string',
  variableName: '',
})

const factorLibrary = ref<Factor[]>([])

const addNewNode = () => {
  const { label, type, fieldCategory, variableName } = newNodeData.value
  const newFactor: Factor = {
    id: `factor_${factorLibrary.value.length + 1}`,
    label,
    type,
    fieldCategory,
    variableName,
    isExpanded: false,
  }

  // 只添加到因子庫
  factorLibrary.value.push(newFactor)

  // 重置表單
  newNodeData.value = {
    id: '',
    label: '',
    type: 'default',
    fieldCategory: 'string',
    variableName: '',
  }
}

const toggleFactor = (factor: Factor) => {
  factor.isExpanded = !factor.isExpanded
}

const addNodeFromLibrary = (factor: Factor) => {
  const newNode: Node = {
    id: `${nodeIdCounter++}`,
    label: factor.label,
    position: { x: 0, y: 0 },
    type: factor.type,
    style: { backgroundColor: '#FFB6C1', color: '#000000', border: '1px solid #333' },
    data: {
      fieldCategory: factor.fieldCategory,
      variableName: factor.variableName,
    },
  }
  nodes.value = [...nodes.value, newNode]
}

// 新增拖拉相關函數
const onDragStart = (event: DragEvent, factor: Factor) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify(factor))
    event.dataTransfer.effectAllowed = 'move'
  }
}

const onDrop = (event: DragEvent) => {
  if (!event.dataTransfer) return

  const factor = JSON.parse(event.dataTransfer.getData('application/vueflow'))
  
  // 獲取滑鼠放置的位置
  const bounds = (event.target as HTMLElement).getBoundingClientRect()
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  })

  // 創建新節點
  const newNode: Node = {
    id: `${nodeIdCounter++}`,
    label: factor.label,
    position,
    type: 'default',
    style: { backgroundColor: '#FFB6C1', color: '#000000', border: '1px solid #333' },
    data: {
      fieldCategory: factor.fieldCategory,
      variableName: factor.variableName,
    },
  }

  nodes.value = [...nodes.value, newNode]
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

// 新增因子編輯相關的狀態
const editingFactor = ref<Factor | null>(null)
const editingFactorData = ref({
  label: '',
  variableName: '',
  fieldCategory: 'string',
})

// 開始編輯因子
const startEditFactor = (factor: Factor, event: Event) => {
  event.stopPropagation()
  editingFactor.value = factor
  editingFactorData.value = {
    label: factor.label,
    variableName: factor.variableName,
    fieldCategory: factor.fieldCategory,
  }
}

// 保存因子編輯
const saveFactorEdit = () => {
  if (editingFactor.value) {
    const index = factorLibrary.value.findIndex(f => f.id === editingFactor.value?.id)
    if (index !== -1) {
      factorLibrary.value[index] = {
        ...factorLibrary.value[index],
        ...editingFactorData.value
      }
    }
  }
  editingFactor.value = null
}

// 取消因子編輯
const cancelFactorEdit = () => {
  editingFactor.value = null
}

function logAllNodePositions() {
  const currentNodes = getNodes.value
  const currentEdges = getEdges.value
  console.log("currentNodes", JSON.stringify(currentNodes))
  // console.log("currentEdges", JSON.stringify(currentEdges))


  // 取得畫完圖後的edge初始資料使用
  const vueFlowEdges = convertToVueFlowEdges(getEdges.value);
  console.log(JSON.stringify(vueFlowEdges));
  
  // 取得畫完圖後的node初始資料使用
  const currentNodesInit = transformNodesForStorage(currentNodes);
  console.log(JSON.stringify(currentNodesInit, null, 2)); // 可以存起來用
  // currentNodes.forEach((node) => {
  //   console.log(`節點 ${node.id} 的位置是 x=${node.position.x}, y=${node.position.y}`)
  // })


}

function transformNodesForStorage(nodes) {
  return nodes.map((node) => {
    const { id, data, position, type, style, label } = node;
    return {
      id,
      label: label || data?.label || '',
      position,
      ...(type && { type }),
      ...(style && { style }),
    };
  });
}
function convertToVueFlowEdges(getEdges) {
  return getEdges.map((edge, index) => {
    const { sourceNode, targetNode, data, label, style } = edge;
    return {
      id: `e${index + 1}`, // 設定 id，這裡假設 id 是 "e" + 索引
      source: sourceNode.id, // 來自 sourceNode.id
      target: targetNode.id, // 來自 targetNode.id
      label: label || data?.label || '', // 從 data.label 取得標籤
      animated: false, // 設定是否動畫
      style: { stroke: '#000' }, // 設定預設的邊線樣式
      type: 'step'
    };
  });
}

</script>

<template>
  <UnderwritingFlow />
  <button @click="logAllNodePositions">列出所有節點位置</button>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
