<template>
  <div 
    class="node-form" 
    :class="{ 'expanded': isExpanded }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- <div class="form-header" :class="{ 'is-new': isNewNode }" @click="$emit('toggle')">
      <h3 :class="{ 'decision-node': formData.columnType === ColumnType.CONDITION, 'result-node': formData.columnType === ColumnType.RESULT }">
        <span v-if="!isNewNode" class="type-indicator">{{ ColumnTypeLabel[formData.columnType] }}:</span>
        {{ isNewNode ? '新增' : '修改' }}
      </h3>
      <div class="arrow-icon" :class="{ 'up': isExpanded }"></div>
    </div> -->
    <div class="form-content" v-show="isExpanded">
      <div class="tab-group">
        <button 
          v-for="type in Object.values(ColumnType)" 
          :key="type"
          :class="['tab-btn', { active: editingFlowNode?.columnType === type }]" 
          @click="editingFlowNode.columnType = type"
        >
          {{ ColumnTypeLabel[type] }}元件
        </button>
      </div>
      <div v-for="(metadata, index) in editingFlowNode.metadataList" :key="index" class="metadata-section">
        <div class="form-group">
          <label>欄位中文名稱：</label>
          <input v-model="metadata.label" type="text" placeholder="請輸入顯示名稱">
        </div>
        <div class="form-group">
          <label>欄位變數名：</label>
          <input v-model="metadata.columnName" type="text" placeholder="請輸入欄位名">
        </div>
        <div class="form-group">
          <label>資料格式：</label>
          <select v-model="metadata.dataType" class="form-select">
            <option v-for="type in Object.values(MetaDataType)" :key="type" :value="type">
              {{ MetaDataTypeLabel[type] }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>詳細內容：</label>
          <textarea v-model="metadata.desc" class="form-textarea" placeholder="請輸入詳細內容" rows="2"></textarea>
        </div>
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
import { ref, watch } from 'vue'
import { MetaDataType, MetaDataTypeLabel, ColumnType, ColumnTypeLabel } from '../core/enums/VueFlow'
import type { VueFlowNode, NodeMetadata } from '../core/interfaces/VueFlow'

const props = defineProps<{
  isNewNode: boolean,
  vueflowNode?: VueFlowNode,
  onSubmit?: (node: VueFlowNode) => void,
  onDelete?: () => void,
  isExpanded: boolean
}>()

const emit = defineEmits(['toggle', 'cancel'])

const editingFlowNode = ref<VueFlowNode>({
  id: '',
  type: 'custom',
  position: { x: 0, y: 0 },
  columnType: ColumnType.CONDITION,
  metadataList: []
})

// 監聽 nodeData 的變化
watch(
  () => props.vueflowNode,
  (vueflowNode) => {
    if (vueflowNode) {
      editingFlowNode.value = { ...vueflowNode }
    }
  },
  { immediate: true }
)


const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return

  const nodeData = {
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: formData.value.label || '新節點',
      metadataList: [{
        columnType: formData.value.columnType,
        label: formData.value.label || '新節點',
        desc: formData.value.desc,
        columnName: formData.value.columnName,
        dataType: formData.value.dataType,
        mandatory: formData.value.mandatory,
        codeId: formData.value.codeId,
        codeUid: formData.value.codeUid
      }]
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
  const VueFlowNode: VueFlowNode = {
    id: props.vueflowNode?.id || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'custom',
    position: props.vueflowNode?.position || { x: 0, y: 0 },
    metadataList: [{
      index: vueflowNode.value.index,
      columnType: formData.value.columnType,
      label: formData.value.label,
      desc: formData.value.desc,
      columnName: formData.value.columnName,
      dataType: formData.value.dataType,
      mandatory: formData.value.mandatory,
      codeId: formData.value.codeId,
      codeUid: formData.value.codeUid
    }]
  }
  props.onSubmit?.(VueFlowNode)
  
  if (props.isNewNode) {
    formData.value = {
      index: 0,
      columnType: ColumnType.CONDITION,
      label: '',
      desc: '',
      columnName: '',
      dataType: MetaDataType.STRING,
      mandatory: false,
      codeId: '',
      codeUid: ''
    }
  }
}

const handleCancel = () => {
  // 重置表單數據到原始值
  if (props.nodeData?.metadataList?.[0]) {
    formData.value = { ...props.nodeData.metadataList[0] }
  }
  // 觸發取消事件，通知父組件關閉元件庫
  emit('cancel')
}

const handleDelete = () => {
  props.onDelete?.()
}
</script>

<style lang="scss">
@use '../styles/components/NodeForm.scss';
</style>