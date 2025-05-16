<template>
  <div class="node-library">
    <div class="node-library-header">
      <h3>元件庫</h3>
    </div>
    <div class="node-library-content">
      <div class="node-form">
        <div class="form-header" @click="toggleForm">
          <h3>{{ editingNode ? '編輯元件' : '新增元件' }}</h3>
        </div>
        <div class="form-content" :class="{ 'expanded': isFormExpanded }">
          <div class="tab-group">
            <button 
              :class="['tab-btn', { active: newNodeData.columnType === 'C' }]"
              @click="newNodeData.columnType = 'C'"
            >
              決策元件
            </button>
            <button 
              :class="['tab-btn', { active: newNodeData.columnType === 'R' }]"
              @click="newNodeData.columnType = 'R'"
            >
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
            <textarea 
              v-model="newNodeData.desc" 
              class="form-textarea" 
              placeholder="請輸入詳細內容"
              rows="4"
            ></textarea>
          </div>
          <div class="form-actions">
            <button @click="handleSubmit" class="submit-btn">確定</button>
            <button v-if="editingNode" @click="cancelEdit" class="cancel-btn">取消</button>
            <button v-if="editingNode" @click="deleteNode" class="delete-btn">刪除</button>
          </div>
        </div>
        <div class="toggle-container">
          <button class="toggle-btn" @click="toggleForm">
            <div class="arrow-icon" :class="{ 'up': isFormExpanded }"></div>
          </button>
        </div>
      </div>
      <div class="node-list">
        <div v-for="(node, index) in nodes" :key="index" class="node-item">
          <div class="node-preview">
            <div class="custom-node">
              <div class="node-header">
                <div class="node-content">
                  {{ node.data.label || '新節點' }}
                </div>
                <button class="edit-btn" @click.stop="editNode(node)">
                  <i class="fas fa-cog"></i>
                </button>
              </div>
              <div class="node-details">
                <div class="detail-item">
                  <span class="detail-label">是否為結果：</span>
                  <span class="detail-value">{{ node.data.forBE?.columnType === 'R' ? '是' : '否' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">詳細內容：</span>
                  <span class="detail-value">{{ node.data.forBE?.desc }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">欄位名：</span>
                  <span class="detail-value">{{ node.data.forBE?.columnName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">資料格式：</span>
                  <span class="detail-value">{{ node.data.forBE?.dataType }}</span>
                </div>
              </div>
            </div>
          </div>
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
const editingNode = ref<Node | null>(null)
const isFormExpanded = ref(true)

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

const editNode = (node: Node) => {
  editingNode.value = node
  // 將節點資料填入表單
  newNodeData.value = {
    label: node.data.label,
    columnType: node.data.forBE?.columnType || 'C',
    desc: node.data.forBE?.desc || '',
    columnName: node.data.forBE?.columnName || '',
    dataType: node.data.forBE?.dataType || '7'
  }
  showForm.value = true
}

const deleteNode = () => {
  if (editingNode.value) {
    const index = nodes.value.findIndex(n => n.id === editingNode.value?.id)
    if (index !== -1) {
      nodes.value.splice(index, 1)
    }
    showForm.value = false
    editingNode.value = null
  }
}

const handleSubmit = () => {
  if (editingNode.value) {
    // 更新現有節點
    const index = nodes.value.findIndex(n => n.id === editingNode.value?.id)
    if (index !== -1) {
      nodes.value[index] = {
        ...nodes.value[index],
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
    }
  } else {
    // 新增節點
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
  }
  
  // 重置表單和編輯狀態
  showForm.value = false
  editingNode.value = null
  newNodeData.value = {
    label: '',
    columnType: 'C',
    desc: '',
    columnName: '',
    dataType: '7'
  }
}

const toggleForm = () => {
  isFormExpanded.value = !isFormExpanded.value
}

const cancelEdit = () => {
  editingNode.value = null
  newNodeData.value = {
    label: '',
    columnType: 'C',
    desc: '',
    columnName: '',
    dataType: '7'
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
  padding: 16px;
}

.node-form {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: visible;
  transition: margin-bottom 0.3s ease;
}

.form-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}

.form-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.toggle-container {
  position: relative;
  height: 24px;
  display: flex;
  justify-content: center;
  margin-top: -12px;
  margin-bottom: -12px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-content.expanded + .toggle-container {
  opacity: 1;
}

.toggle-btn {
  position: relative;
  width: 24px;
  height: 24px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  padding: 0;
}

.toggle-btn:hover {
  background-color: #f8f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
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
  transition: all 0.3s ease-out;
  border-bottom: 1px solid transparent;
  opacity: 0;
  transform: translateY(-10px);
}

.form-content.expanded {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-in;
  border-bottom: 1px solid #ddd;
}

.form-group {
  margin-bottom: 12px;
  padding: 0 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.submit-btn,
.cancel-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #da190b;
}

.node-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 8px;
  transition: transform 0.3s ease;
}

.node-item {
  background-color: transparent;
  border: none;
  padding: 4px;
  cursor: move;
  width: 100%;
}

.node-item:hover .custom-node {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.node-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  padding: 8px;
}

.custom-node {
  padding: 0;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #ddd;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.edit-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.node-details {
  display: none;
  padding: 8px;
  font-size: 12px;
}

.custom-node:hover .node-details {
  display: block;
}

.detail-item {
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.detail-label {
  color: #666;
  margin-right: 8px;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.node-content {
  text-align: left;
  font-size: 14px;
  color: #333;
  flex: 1;
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
}

.tab-btn:hover {
  background-color: #e9ecef;
}

.tab-btn.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
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
</style> 