<template>
  <div class="node-form" :class="{ 'expanded': showForm }">
    <div class="form-header" style="background-color: #26a862;" @click="toggleForm">
      <h3>新增</h3>
      <div class="arrow-icon" :class="{ 'up': showForm }"></div>
    </div>
    <div class="form-content">
      <div class="tab-group">
        <button :class="['tab-btn', { active: nodeData.columnType === 'C' }]" @click="nodeData.columnType = 'C'">
          決策元件
        </button>
        <button :class="['tab-btn', { active: nodeData.columnType === 'R' }]" @click="nodeData.columnType = 'R'">
          結果元件
        </button>
      </div>
      <div class="form-group">
        <label>中文名稱：</label>
        <input v-model="nodeData.label" type="text" placeholder="請輸入顯示名稱">
      </div>
      <div class="form-group">
        <label>欄位名稱：</label>
        <input v-model="nodeData.columnName" type="text" placeholder="請輸入欄位名">
      </div>
      <div class="form-group">
        <label>資料格式：</label>
        <select v-model="nodeData.dataType" class="form-select">
          <option v-for="option in dataTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>詳細內容：</label>
        <textarea v-model="nodeData.desc" class="form-textarea" placeholder="請輸入詳細內容" rows="4"></textarea>
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
import type { Node } from '@vue-flow/core'
import { DataType } from '../core/enums'
import type { GraphNode, NodeMetadata } from '../types/graph'

const props = defineProps<{
  isNewNode: boolean,
  node: GraphNode,
  onSubmit: (node: GraphNode) => void,
  onDelete: () => void
}>()

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

const showForm = ref(false)
const expandedNodeId = ref<string | null>(null)

const nodeData = ref<NodeMetadata>({
  label: '',
  columnType: 'C',
  desc: '',
  columnName: '',
  dataType: '7',
  codeId: '',
  codeUid: '',
  index: 0,
  mandatory: false
})

const toggleForm = () => {
  if (showForm.value) {
    showForm.value = false
  } else {
    showForm.value = true
  }
}

const handleSubmit = () => {
  showForm.value = false
  const graphNode: GraphNode = {
    id: "",
    position: { x: 0, y: 0 },
    type: "",
    metadata: nodeData.value
  }
  props.onSubmit(graphNode)
}

const handleCancel = () => {
  showForm.value = false
}

const handleDelete = () => {
  props.onDelete()
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