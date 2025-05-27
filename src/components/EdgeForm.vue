<template>
  <div class="edge-form" v-if="edge">
    <div class="edge-form-header">
      <h3>連接線設定</h3>
    </div>
    <div class="edge-form-content">
      <div class="form-group">
        <label>欄位名稱</label>
        <input 
          disabled
          type="text" 
          v-model="edgeData.metadata.columnName" 
          class="form-input"
          placeholder="請輸入欄位名稱"
        />
      </div>
      <div class="form-group">
        <label>表達式類型</label>
        <select v-model="edgeData.metadata.expressionType" class="form-select">
          <option value="">請選擇表達式類型</option>
          <option v-for="option in expressionTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>輸入文字</label>
        <input 
          type="text" 
          v-model="edgeData.metadata.entryText" 
          class="form-input"
          placeholder="請輸入文字"
        />
      </div>
      <div class="form-actions">
        <button class="submit-btn" @click="handleSubmit">確定</button>
        <button class="cancel-btn" @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { GraphEdge } from '../core/types/graph'
import { expressionTypeOptions } from '@/constants/expressionTypeMapping'

const props = defineProps<{
  edge: GraphEdge | null
}>()

const emit = defineEmits<{
  (e: 'update', edge: GraphEdge): void
  (e: 'cancel'): void
  (e: 'select', edge: GraphEdge | null): void
}>()

const edgeData = ref<GraphEdge>({
  id: '',
  source: '',
  target: '',
  type: 'default',
  animated: false,
  style: {},
  metadata: {
    columnName: '',
    expressionType: '',
    entryText: ''
  }
})

watch(() => props.edge, (newEdge) => {
  if (newEdge) {
    edgeData.value = { ...newEdge }
    // 當邊被選取時，更新樣式
    edgeData.value.style = {
      ...edgeData.value.style,
      stroke: '#ff0000',
      strokeWidth: 2
    }
  } else {
    // 當取消選取時，恢復預設樣式
    edgeData.value.style = {
      ...edgeData.value.style,
      stroke: '#000',
      strokeWidth: 1
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('update', edgeData.value)
}

// 當表單關閉時，取消選取
const handleCancel = () => {
  emit('select', null)
  emit('cancel')
}
</script>

<style scoped>
.edge-form {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100%;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.edge-form-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.edge-form-header h3 {
  margin: 0;
  font-size: 16px;
}

.edge-form-content {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #26a862;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

.submit-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: #26a862;
  color: white;
}

.submit-btn:hover {
  background-color: #229357;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style> 