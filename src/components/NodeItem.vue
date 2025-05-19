<template>
  <div class="node-form" :class="{ 'expanded': showForm }">
    <div class="form-header" style="background-color: #26a862;" @click="toggleForm">
      <h3>新增</h3>
      <div class="arrow-icon" :class="{ 'up': showForm }"></div>
    </div>
    <div class="form-content">
      <div class="tab-group">
        <button :class="['tab-btn', { active: newNodeData.columnType === 'C' }]" @click="newNodeData.columnType = 'C'">
          決策元件
        </button>
        <button :class="['tab-btn', { active: newNodeData.columnType === 'R' }]" @click="newNodeData.columnType = 'R'">
          結果元件
        </button>
      </div>
      <div class="form-group">
        <label>中文名稱：</label>
        <input v-model="newNodeData.label" type="text" placeholder="請輸入顯示名稱">
      </div>
      <div class="form-group">
        <label>欄位名稱：</label>
        <input v-model="newNodeData.columnName" type="text" placeholder="請輸入欄位名">
      </div>
      <div class="form-group">
        <label>資料格式：</label>
        <select v-model="newNodeData.dataType" class="form-select">
          <option v-for="option in dataTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>詳細內容：</label>
        <textarea v-model="newNodeData.desc" class="form-textarea" placeholder="請輸入詳細內容" rows="4"></textarea>
      </div>
      <div class="form-actions">
        <button @click="handleSubmit" class="submit-btn">確定</button>
      </div>
    </div>
  </div>

  <div class="node-list">
    <div v-for="(node, index) in nodes" :key="index" class="node-form"
      :class="{ 'expanded': expandedNodeId === node.id }" draggable="true" @dragstart="onDragStart($event, node)"
      @dragend="onDragEnd">
      <div class="form-header" @click="toggleNodeForm(node)">
        <h3>{{ node.data.label || '新節點' }}</h3>
        <div class="arrow-icon" :class="{ 'up': expandedNodeId === node.id }"></div>
      </div>
      <div class="node-popup">
        <div class="popup-content">
          <div class="popup-item">
            <span class="popup-label">類型：</span>
            <span class="popup-value">{{ node.data.forBE?.columnType === 'R' ? '結果元件' : '決策元件' }}</span>
          </div>
          <div class="popup-item">
            <span class="popup-label">欄位名：</span>
            <span class="popup-value">{{ node.data.forBE?.columnName }}</span>
          </div>
          <div class="popup-item">
            <span class="popup-label">資料格式：</span>
            <span class="popup-value">{{ getDataTypeLabel(node.data.forBE?.dataType) }}</span>
          </div>
        </div>
      </div>
      <div class="form-content">
        <div class="tab-group">
          <button :class="['tab-btn', { active: node.data.forBE?.columnType === 'C' }]"
            @click="updateNodeType(node, 'C')">
            決策元件
          </button>
          <button :class="['tab-btn', { active: node.data.forBE?.columnType === 'R' }]"
            @click="updateNodeType(node, 'R')">
            結果元件
          </button>
        </div>
        <div class="form-group">
          <label>中文名稱：</label>
          <input v-model="node.data.label" type="text" placeholder="請輸入顯示名稱">
        </div>
        <div class="form-group">
          <label>欄位名稱：</label>
          <input v-model="node.data.forBE.columnName" type="text" placeholder="請輸入欄位名">
        </div>
        <div class="form-group">
          <label>資料格式：</label>
          <select v-model="node.data.forBE.dataType" class="form-select">
            <option v-for="option in dataTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>詳細內容：</label>
          <textarea v-model="node.data.forBE.desc" class="form-textarea" placeholder="請輸入詳細內容" rows="4"></textarea>
        </div>
        <div class="form-actions">
          <button @click="deleteNode(node)" class="delete-btn">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Node } from '@vue-flow/core'

enum DataType {
  STRING = '1',
  INTEGER = '2',
  DECIMAL = '3',
  DATE = '4',
  TIME = '5',
  BOOLEAN = '6',
  CODE = '7',
  VARIABLE = '8'
}

const dataTypeOptions = [
  { value: DataType.STRING, label: '字串' },
  { value: DataType.INTEGER, label: '整數' },
  { value: DataType.DECIMAL, label: '小數' },
  { value: DataType.DATE, label: '日期' },
  { value: DataType.TIME, label: '時間' },
  { value: DataType.BOOLEAN, label: '布林' },
  { value: DataType.CODE, label: '代碼' },
  { value: DataType.VARIABLE, label: '變數' }
]

const nodes = ref<Node[]>([])
const showForm = ref(false)
const expandedNodeId = ref<string | null>(null)

interface NodeFormData {
  label: string
  columnType: string
  desc: string
  columnName: string
  dataType: string
}

const newNodeData = ref<NodeFormData>({
  label: '',
  columnType: 'C',
  desc: '',
  columnName: '',
  dataType: '7'
})

const toggleForm = () => {
  if (showForm.value) {
    showForm.value = false
    newNodeData.value = {
      label: '',
      columnType: 'C',
      desc: '',
      columnName: '',
      dataType: '7'
    }
  } else {
    expandedNodeId.value = null
    showForm.value = true
  }
}

const handleSubmit = () => {
  const newNode: Node = {
    id: `node-${nodes.value.length}`,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: newNodeData.value.label,
      forBE: {
        columnType: newNodeData.value.columnType,
        label: newNodeData.value.label,
        desc: newNodeData.value.desc,
        columnName: newNodeData.value.columnName,
        dataType: newNodeData.value.dataType,
        mandatory: true
      }
    }
  }
  nodes.value.push(newNode)
  showForm.value = false
  newNodeData.value = {
    label: '',
    columnType: 'C',
    desc: '',
    columnName: '',
    dataType: '7'
  }
}

const toggleNodeForm = (node: Node) => {
  if (expandedNodeId.value === node.id) {
    expandedNodeId.value = null
  } else {
    showForm.value = false
    expandedNodeId.value = node.id
  }
}

const updateNodeType = (node: Node, type: string) => {
  if (node.data.forBE) {
    node.data.forBE.columnType = type
  }
}

const deleteNode = (node: Node) => {
  const index = nodes.value.findIndex(n => n.id === node.id)
  if (index !== -1) {
    nodes.value.splice(index, 1)
    if (expandedNodeId.value === node.id) {
      expandedNodeId.value = null
    }
  }
}

const getDataTypeLabel = (type: string) => {
  const option = dataTypeOptions.find(opt => opt.value === type)
  return option ? option.label : '未知'
}

const onDragStart = (event: DragEvent, node: Node) => {
  if (event.dataTransfer) {
    const nodeData = {
      type: 'custom',
      data: {
        label: node.data.label,
        forBE: {
          columnType: node.data.forBE.columnType,
          label: node.data.forBE.label,
          desc: node.data.forBE.desc,
          columnName: node.data.forBE.columnName,
          dataType: node.data.forBE.dataType,
          mandatory: node.data.forBE.mandatory
        }
      }
    }
    event.dataTransfer.setData('application/json', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'

    if (event.target instanceof HTMLElement) {
      const dragImage = event.target.cloneNode(true) as HTMLElement
      dragImage.style.width = '200px'
      dragImage.style.position = 'absolute'
      dragImage.style.top = '-1000px'
      document.body.appendChild(dragImage)
      event.dataTransfer.setDragImage(dragImage, 100, 20)
      setTimeout(() => {
        document.body.removeChild(dragImage)
      }, 0)
    }
  }
}

const onDragEnd = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.clearData()
  }
}
</script>

<style scoped>
.node-library {
  width: 250px;
  height: 100%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.node-library-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-library-header h3 {
  margin: 0;
  font-size: 16px;
}

.node-library-content {
  flex: 1;
  overflow-y: auto;
  /* padding: 16px; */
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.node-form {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: move;
  user-select: none;
}

.form-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.form-header h3 {
  margin: 0;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.arrow-icon {
  width: 8px;
  height: 8px;
  border-right: 2px solid #666;
  border-bottom: 2px solid #666;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.arrow-icon.up {
  transform: rotate(-135deg);
}

.form-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.node-form.expanded .form-content {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}

.node-popup {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  margin-top: 8px;
}

.node-form:hover .node-popup {
  display: block;
}

.popup-content {
  font-size: 12px;
}

.popup-item {
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.popup-label {
  color: #666;
  margin-right: 8px;
}

.popup-value {
  color: #333;
  font-weight: 500;
}

.node-content {
  font-size: 16px;
  color: #333;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.tab-group {
  display: flex;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  border: 0px solid #ddd;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
}

.tab-btn:hover {
  background-color: #e9ecef;
}

.tab-btn.active {
  background-color: #26a862;
  color: white;
  border-color: #26a862;
}

.form-select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.form-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-textarea {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 8px;
  margin: 5px;
}

.submit-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #26a862;
}

.submit-btn:hover {
  transform: scale(1.05);
  /* 放大 1.2 倍 */

  /* background-color: #45a049; */
}

.form-group {
  padding: 0 16px;
}
</style>