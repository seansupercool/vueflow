<template>
  <div class="edge-form" v-if="edge">
    <div class="edge-form-content">
      <div class="form-group">
        <label>欄位名稱</label>
        <input 
          disabled
          type="text" 
          v-model="edgeData.metadata.label" 
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
        <label>條件</label>
        <input 
          type="text" 
          v-model="edgeData.metadata.entryText" 
          class="form-input"
          placeholder="請輸入文字"
        />
      </div>
      <div class="form-actions">
        <div style="flex:1"></div>
        <button class="btn submit-btn" @click="handleSubmit">確定</button>
        <button class="btn cancel-btn" @click="handleCancel">取消</button>
        <button class="btn delete-btn" @click="handleDelete">刪除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VueFlowEdge } from '../core/interfaces/VueFlow'
import { expressionTypeOptions } from '@/constants/expressionTypeMapping'

const props = defineProps<{
  edge: VueFlowEdge | null
}>()

const emit = defineEmits<{
  (e: 'delete', edge: VueFlowEdge): void
  (e: 'confirm', edge: VueFlowEdge): void
  (e: 'cancel'): void
}>()

const edgeData = ref<VueFlowEdge>({
  id: '',
  source: '',
  target: '',
  type: 'default',
  animated: false,
  style: {},
  metadata: {
    label: '',
    columnName: '',
    expressionType: '',
    entryText: ''
  }
})

watch(() => props.edge, (newEdge) => {
  console.log("newEdge", newEdge)
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
  emit('confirm', edgeData.value)
}

// 當表單關閉時，取消選取
const handleCancel = () => {
  emit('cancel')
}

const handleDelete = () => {
  emit('delete', edgeData.value)
}
</script>

<style lang="scss">
@use '../styles/components/EdgeForm.scss';
</style> 