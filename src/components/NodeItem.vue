<template>
  <div 
    class="node-form" 
    :class="{ 'expanded': isExpanded }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="form-header" :class="{ 'is-new': isNewNode }" @click="$emit('toggle')">
      <h3 :class="{ 'decision-node': formData.columnType === 'C', 'result-node': formData.columnType === 'R' }">
        <span v-if="!isNewNode" class="type-indicator">{{ formData.columnType === 'C' ? '條件:' : '結果:' }}</span>
        {{ isNewNode ? '新增' : formData.label }}
      </h3>
      <div class="arrow-icon" :class="{ 'up': isExpanded }"></div>
    </div>
    <div class="form-content" v-show="isExpanded">
      <div class="tab-group">
        <button :class="['tab-btn', { active: formData.columnType === 'C' }]" @click="formData.columnType = 'C'">
          決策元件
        </button>
        <button :class="['tab-btn', { active: formData.columnType === 'R' }]" @click="formData.columnType = 'R'">
          結果元件
        </button>
      </div>
      <div class="form-group">
        <label>中文名稱：</label>
        <input v-model="formData.label" type="text" placeholder="請輸入顯示名稱">
      </div>
      <div class="form-group">
        <label>欄位名稱：</label>
        <input v-model="formData.columnName" type="text" placeholder="請輸入欄位名">
      </div>
      <div class="form-group">
        <label>資料格式：</label>
        <select v-model="formData.dataType" class="form-select">
          <option v-for="option in dataTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>詳細內容：</label>
        <textarea v-model="formData.desc" class="form-textarea" placeholder="請輸入詳細內容" rows="4"></textarea>
      </div>
      <div class="form-actions">
        <button @click="handleSubmit" class="btn submit-btn">確定</button>
        <button @click="handleCancel" class="btn cancel-btn">取消</button>
        <button v-if="!isNewNode" @click="handleDelete" class="btn delete-btn">刪除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataType } from '../core/enums'
import type { GraphNode, NodeMetadata } from '../types/graph'

const props = defineProps<{
  isNewNode: boolean,
  nodeData?: GraphNode,
  onSubmit?: (node: GraphNode) => void,
  onDelete?: () => void,
  isExpanded: boolean
}>()

defineEmits(['toggle'])

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

const formData = ref<NodeMetadata>({
  index: 0,
  columnType: 'C',
  label: '',
  desc: '',
  columnName: '',
  dataType: DataType.STRING,
  mandatory: false,
  codeId: '',
  codeUid: '',
  ...(props.nodeData?.metadata || {})
})

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return

  const nodeData = {
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: formData.value.label || '新節點',
      metadata: {
        columnType: formData.value.columnType,
        label: formData.value.label || '新節點',
        desc: formData.value.desc,
        columnName: formData.value.columnName,
        dataType: formData.value.dataType,
        mandatory: formData.value.mandatory,
        codeId: formData.value.codeId,
        codeUid: formData.value.codeUid
      }
    }
  }

  event.dataTransfer.setData('application/json', JSON.stringify(nodeData))
  event.dataTransfer.effectAllowed = 'move'
}

const handleDragEnd = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.clearData()
  }
}

const handleSubmit = () => {
  const graphNode: GraphNode = {
    id: props.nodeData?.id || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'custom',
    position: props.nodeData?.position || { x: 0, y: 0 },
    metadata: {
      index: formData.value.index,
      columnType: formData.value.columnType,
      label: formData.value.label,
      desc: formData.value.desc,
      columnName: formData.value.columnName,
      dataType: formData.value.dataType,
      mandatory: formData.value.mandatory,
      codeId: formData.value.codeId,
      codeUid: formData.value.codeUid
    }
  }
  console.log('🟢 Submitting node:', graphNode)
  props.onSubmit?.(graphNode)
  
  if (props.isNewNode) {
    formData.value = {
      index: 0,
      columnType: 'C',
      label: '',
      desc: '',
      columnName: '',
      dataType: DataType.STRING,
      mandatory: false,
      codeId: '',
      codeUid: ''
    }
  }
}

const handleCancel = () => {
  // 重置表單數據到原始值
  if (props.nodeData?.metadata) {
    formData.value = { ...props.nodeData.metadata }
  }
}

const handleDelete = () => {
  props.onDelete?.()
}
</script>

<style lang="scss">
@use '../styles/components/_node-item.scss';

.form-header {
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;

    .type-indicator {
      font-size: 0.9em;
      opacity: 0.8;
    }

    &.decision-node {
      color: #000000;
    }
    
    &.result-node {
      color: #a82626;
    }
  }
}
</style>