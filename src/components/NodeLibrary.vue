<template>
  <div class="node-library">
    <div class="node-library-header">
      <h3>元件庫</h3>
      <button @click="showForm = true" class="add-node-btn">新增節點</button>
    </div>
    <div class="node-library-content">
      <div v-if="showForm" class="node-form">
        <div class="form-group">
          <label>是否為結果：</label>
          <select v-model="newNodeData.columnType">
            <option value="C">否</option>
            <option value="R">是</option>
          </select>
        </div>
        <div class="form-group">
          <label>顯示名稱：</label>
          <input v-model="newNodeData.label" type="text" placeholder="請輸入顯示名稱">
        </div>
        <div class="form-group">
          <label>詳細內容：</label>
          <input v-model="newNodeData.desc" type="text" placeholder="請輸入詳細內容">
        </div>
        <div class="form-group">
          <label>欄位名：</label>
          <input v-model="newNodeData.columnName" type="text" placeholder="請輸入欄位名">
        </div>
        <div class="form-group">
          <label>資料格式：</label>
          <input v-model="newNodeData.dataType" type="text" placeholder="請輸入資料格式">
        </div>
        <div class="form-actions">
          <button @click="handleSubmit" class="submit-btn">確定</button>
          <button @click="showForm = false" class="cancel-btn">取消</button>
          <button v-if="editingNode" @click="deleteNode" class="delete-btn">刪除</button>
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

const nodes = ref<Node[]>([])
const showForm = ref(false)
const editingNode = ref<Node | null>(null)

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

.add-node-btn {
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-node-btn:hover {
  background-color: #45a049;
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
  padding: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 12px;
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
</style> 