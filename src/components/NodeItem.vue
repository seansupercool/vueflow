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
        <button @click="handleSubmit" class="btn submit-btn">確定</button>
        <button @click="handleCancel" class="btn cancel-btn">取消</button>
        <button @click="handleDelete" class="btn delete-btn">刪除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const nodes = ref<CustomNode[]>([])
const showForm = ref(false)
const expandedNodeId = ref<string | null>(null)

interface NodeFormData {
  label: string
  columnType: string
  desc: string
  columnName: string
  dataType: string
  codeId?: string
  codeUid?: string
}

const newNodeData = ref<NodeFormData>({
  label: '',
  columnType: 'C',
  desc: '',
  columnName: '',
  dataType: '7',
  codeId: '',
  codeUid: ''
})

const toggleForm = () => {
  if (showForm.value) {
    showForm.value = false
    newNodeData.value = {
      label: '',
      columnType: 'C',
      desc: '',
      columnName: '',
      dataType: '7',
      codeId: '',
      codeUid: ''
    }
  } else {
    expandedNodeId.value = null
    showForm.value = true
  }
}

const handleSubmit = () => {
  const newNode: CustomNode = {
    id: `node-${nodes.value.length}`,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      index: nodes.value.length,
      columnType: newNodeData.value.columnType,
      label: newNodeData.value.label,
      desc: newNodeData.value.desc,
      columnName: newNodeData.value.columnName,
      dataType: newNodeData.value.dataType,
      mandatory: true,
      codeId: newNodeData.value.codeId,
      codeUid: newNodeData.value.codeUid
    }
  }
  nodes.value.push(newNode)
  showForm.value = false
  newNodeData.value = {
    label: '',
    columnType: 'C',
    desc: '',
    columnName: '',
    dataType: '7',
    codeId: '',
    codeUid: ''
  }
}

const handleCancel = () => {
  showForm.value = false
}

const handleDelete = () => {
  
}

const toggleNodeForm = (node: CustomNode) => {
  if (expandedNodeId.value === node.id) {
    expandedNodeId.value = null
  } else {
    showForm.value = false
    expandedNodeId.value = node.id
  }
}
</script>

<style scoped>
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
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
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

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn {
  background-color: #26a862;
}

.submit-btn:hover {
  background-color: #229357;
}

.cancel-btn {
  background-color: #ffffff;
  color: black;
  border: 2px solid #ddd;
}

.cancel-btn:hover {
  background-color: #efefef;
}

.delete-btn {
  background-color: #dc3545;
}

.delete-btn:hover {
  background-color: #c82333;
}

.form-group {
  padding: 0 16px;
}
</style>