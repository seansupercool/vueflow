<template>
  <div class="edge-form" v-if="editingDecisionEdge.data">
    <div class="edge-form-content">
      <div class="form-group">
        <label>欄位名稱</label>
        <input 
          disabled
          type="text" 
          v-model="editingDecisionEdge.data.columnLabel" 
          class="form-input"
          placeholder="請輸入欄位名稱"
        />
      </div>
      <div class="form-group">
        <label>表達式類型</label>
        <select v-model="editingDecisionEdge.data.expressionType" class="form-select">
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
          v-model="editingDecisionEdge.data.entryText" 
          class="form-input"
          placeholder="請輸入文字"
        />
      </div>
      <div class="form-actions">
        <div style="flex:1"></div>
        <button class="btn submit-btn" @click="handleSubmit">確定</button>
        <button class="btn delete-btn" @click="handleDelete">刪除</button>
        <button class="btn cancel-btn" @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DecisionEdge } from '../core/interfaces/DecisionTree'
import { expressionTypeOptions } from '@/constants/expressionTypeMapping'

const props = defineProps<{
  decisionEdge?: DecisionEdge
}>()

const emit = defineEmits<{
  (e: 'delete', decisionEdge: DecisionEdge): void
  (e: 'confirm', decisionEdge: DecisionEdge): void
  (e: 'cancel'): void
}>()

const editingDecisionEdge = ref<DecisionEdge>({
  id: '',
  source: '',
  target: '',
  type: 'default',
  animated: false,
  style: {},
  label: '',
  data: {
    columnLabel: '',
    columnName: '',
    expressionType: '',
    entryText: ''
  }
})

watch(() => props.decisionEdge, (decisionEdge) => {
  console.log("decisionEdge", decisionEdge)
  if (decisionEdge) {
    editingDecisionEdge.value = JSON.parse(JSON.stringify(decisionEdge))
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('confirm', editingDecisionEdge.value)
}

// 當表單關閉時，取消選取
const handleCancel = () => {
  emit('cancel')
}

const handleDelete = () => {
  emit('delete', editingDecisionEdge.value)
}
</script>

<style lang="scss">
@use '../styles/components/EdgeForm.scss';
</style> 