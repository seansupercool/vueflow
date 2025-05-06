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
  getConnectedEdges,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

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
  { id: '4', label: '已知病因？', position: { x: -13, y: 273 } },
  { id: '5', label: '診斷期間 >= 1 年？', position: { x: 350, y: 187 } },
  { id: '6', label: '是否復發？', position: { x: 140, y: 390 } },
  { id: '7', label: '有無併發症？', position: { x: 50, y: 580 } },
  { id: '8', label: '癒後期間 >= 6 月？', position: { x: -252, y: 771 } },
  { id: '9', label: '結果：依病因評估', position: { x: 500, y: 275 } },
  { id: 'r1', label: '結果：P', position: { x: -450, y: 130 }, type: 'output' },
  { id: 'r2', label: '結果：依病因評估', position: { x: -277, y: 401 }, type: 'output' },
  { id: 'r3', label: '結果：P', position: { x: -510, y: 970 }, type: 'output' },
  { id: 'r4', label: '結果：分數', position: { x: -150, y: 950 }, type: 'output' },
  { id: 'r5', label: '結果：CMO', position: { x: 370, y: 590 }, type: 'output' },
  { id: 'r6', label: '結果：CMO', position: { x: 270, y: 960 }, type: 'output' },
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
  { id: 'e3-4_2', source: '3', target: '4', label: '良性' },
  { id: 'e4-r2', source: '4', target: 'r2', label: '有病因' },
  { id: 'e4-6_3', source: '4', target: '6', label: '無病因' },
  { id: 'e6-7_3', source: '6', target: '7', label: '否' },
  { id: 'e7-8_3', source: '7', target: '8', label: '無併發症' },
  { id: 'e8-r3', source: '8', target: 'r3', label: '<6月' },
  { id: 'e8-r4', source: '8', target: 'r4', label: '>=6月' },
  { id: 'e6-r5', source: '6', target: 'r5', label: '是' },
  { id: 'e7-r6', source: '7', target: 'r6', label: '有併發症' },
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

const nodes = ref<Node[]>([...initialNodes])
const edges = ref<Edge[]>([...initialEdges])

const { onConnect, addEdges, onNodesChange, onEdgesChange, project } = useVueFlow()

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

onConnect((params: Connection) => {
  addEdges([params])
})

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
</script>

<template>
  <div style="flex: 1; height: 100vh; display: flex">
    <!-- 左側為新增節點區域 -->
    <div
      style="width: 250px; padding: 10px; background-color: #f4f4f4; border-right: 2px solid #ddd"
    >
      <div>
        <h3>新增因子</h3>
        <div
          style="
            margin: 10px 0;
            background-color: #ffb6c1;
            color: #000000;
            border: 1px solid #333;
            border-radius: 4px;
            overflow: hidden;
          "
        >
          <div style="padding: 10px; background-color: #fff; border-bottom: 1px solid #ddd">
            <!-- 欄位中文 -->
            <div style="display: flex; align-items: center; margin: 0px 0">
              <label style="width: 80px; margin-right: 0px">欄位中文</label>
              <input v-model="newNodeData.label" placeholder="例如：疾病症狀 是否已知？" style="flex: 1" />
            </div>

            <!-- 欄位名稱 -->
            <div style="display: flex; align-items: center; margin: 0px 0">
              <label style="width: 80px; margin-right: 0px">欄位變數名</label>
              <input v-model="newNodeData.variableName" placeholder="例如：var_1" style="flex: 1" />
            </div>

            <!-- 欄位類型 -->
            <div style="display: flex; align-items: center; margin: 0px 0">
              <label style="width: 80px; margin-right: 0px">欄位類型</label>
              <select v-model="newNodeData.fieldCategory" style="flex: 1">
                <option value="string">文字</option>
                <option value="number">數值</option>
                <option value="boolean">布林</option>
              </select>
            </div>

            <button @click="addNewNode" style="margin-top: 10px; width: 100%">新增因子</button>
          </div>
        </div>
      </div>
      <div style="margin-top: 50px; border-top: 2px solid #ddd">
        <h3>因子庫</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div
            v-for="factor in factorLibrary"
            :key="factor.id"
            draggable="true"
            @dragstart="onDragStart($event, factor)"
            style="
              flex: 0 0 calc(50% - 5px);
              margin: 0;
              background-color: #ffb6c1;
              color: #000000;
              border: 1px solid #333;
              border-radius: 4px;
              overflow: hidden;
              cursor: move;
            "
          >
            <!-- 標題部分 -->
            <div
              style="
                padding: 10px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
             
            >
              <div style="font-weight: bold">{{ factor.label }}</div>
              <div style="font-size: 10px" @click="toggleFactor(factor)">{{ factor.isExpanded ? '▼' : '▶' }}</div>
            </div>

            <!-- 展開的詳細內容 -->
            <div
              v-if="factor.isExpanded"
              style="padding:5px 10px; background-color: #fff; border-top: 1px solid #ddd"
            >
              <div style="margin: 5px 0; font-size: 10px;"><strong>欄位名稱：</strong>{{ factor.variableName }}</div>
              <div style="margin: 5px 0; font-size: 10px;"><strong>欄位類型：</strong>{{ factor.fieldCategory }}</div>
              <div style="margin: 5px 0; font-size: 10px;"><strong>型態：</strong>{{ factor.type }}</div>
              <!-- <button @click.stop="addNodeFromLibrary(factor)" style="margin-top: 10px; width: 100%">
                添加到圖表
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右側為 VueFlow 節點場景 -->
    <div style="flex: 1; height: 100%; position: relative">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        class="h-full w-full"
        :fit-view-on-init="true"
        @drop="onDrop"
        @dragover="onDragOver"
      >
        <Background />
        <Controls />
        <MiniMap />
      </VueFlow>

      <div style="position: absolute; top: 10px; left: 10px; z-index: 999">
        <button @click="logCurrentState">📝 輸出目前狀態</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-full {
  height: 100%;
}
.w-full {
  width: 100%;
}
button {
  margin: 4px;
  padding: 6px 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #4338ca;
}
input,
select {
  margin: 10px 0;
  width: 100%;
  padding: 6px;
  border-radius: 6px;
}
</style>
