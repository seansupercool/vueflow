<template>
  <div 
    class="node-form" 
    :class="{ 'expanded': isExpanded }"
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
        <div 
          v-for="type in Object.values(ColumnType)" 
          v-show="(isNewNode || editingFlowNode.columnType === type)"
          :key="type"
          :class="['tab-btn', { active: editingFlowNode?.columnType === type }]" 
          @click="editingFlowNode.columnType = type"
        >
          {{ ColumnTypeLabel[type] }}元件
        </div>
      </div>
      <div v-for="(metadata, index) in editingFlowNode.metadataList" :key="index" class="metadata-section">
        <div class="metadata-header">
        </div>
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
        <div v-if="editingFlowNode.columnType === ColumnType.RESULT" class="form-group">
          <label>結果值：</label>
          <input v-model="metadata.resultValue" type="text" placeholder="請輸入結果值">
        </div>
      </div>
      <!-- <div v-if="editingFlowNode.columnType === ColumnType.RESULT" class="form-group"> -->
        <div v-if="editingFlowNode.columnType === ColumnType.RESULT" class="btn btn-secondary" @click="handleAddMetadata">
          新增 Metadata
        </div>
      <!-- </div> -->
      <div class="form-actions">
        <div style="flex:1"></div>
        <button @click="handleSubmit" class="btn submit-btn">確定</button>
        <button v-if="!isNewNode" @click="handleCopy" class="btn copy-btn">複製</button>
        <button v-if="!isNewNode" @click="handleDelete" class="btn delete-btn">刪除</button>
        <button @click="handleCancel" class="btn cancel-btn">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '../styles/components/NodeForm.scss'
import { ref, watch } from 'vue'
import { MetaDataType, MetaDataTypeLabel, ColumnType, ColumnTypeLabel } from '../core/enums/VueFlow'
import type { VueFlowNode, NodeMetadata } from '../core/interfaces/VueFlow'

const props = defineProps<{
  isNewNode: boolean,
  node?: VueFlowNode,
  onSave?: (node: VueFlowNode) => void,
  onAdd?: (node: VueFlowNode) => void,
  onDelete?: () => void,
  isExpanded: boolean
}>()

const emit = defineEmits(['toggle', 'cancel', 'copy'])

const editingFlowNode = ref<VueFlowNode>({
  id: '',
  type: 'custom',
  position: { x: 0, y: 0 },
  columnType: ColumnType.CONDITION,
  metadataList: [{
    index: 0,
    label: '',
    desc: '',
    columnName: '',
    dataType: MetaDataType.STRING,
    mandatory: false,
    codeId: '',
    codeUid: '',
    resultValue: ''
  }]
})

// 監聽 nodeData 的變化
watch(
  () => props.node,
  (node) => {
    if (node) {
      editingFlowNode.value = { ...node }
      console.log("editingFlowNode", editingFlowNode)
    }
  },
  { immediate: true }
)

const handleAddMetadata = () => {
  const newMetadata: NodeMetadata = {
    index: editingFlowNode.value.metadataList.length,
    label: '',
    desc: '',
    columnName: '',
    dataType: MetaDataType.STRING,
    mandatory: false,
    codeId: '',
    codeUid: '',
    resultValue: ''
  }
  editingFlowNode.value.metadataList.push(newMetadata)
}

const handleRemoveMetadata = (index: number) => {
  editingFlowNode.value.metadataList.splice(index, 1)
  // 重新設置索引
  editingFlowNode.value.metadataList.forEach((metadata, idx) => {
    metadata.index = idx
  })
}

const handleSubmit = () => {
  if(props.isNewNode)
    props.onAdd?.(editingFlowNode.value)
  else
    props.onSave?.(editingFlowNode.value)
}

const handleCancel = () => {
  emit('cancel')
}

const handleDelete = () => {
  props.onDelete?.()
}

const handleCopy = () => {
  const copiedNode: VueFlowNode = {
    ...editingFlowNode.value,
    id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    position: { 
      x: editingFlowNode.value.position.x + 200,
      y: editingFlowNode.value.position.y
    }
  }
  console.log("editingFlowNode.value.position.x", editingFlowNode.value.position.x)
  console.log("editingFlowNode", editingFlowNode)
  console.log("copiedNode", copiedNode)
  props.onAdd?.(copiedNode)
}

const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
console.log("handleDragStart")
  const nodeData = {
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: editingFlowNode.value.metadataList[0].label || '新節點',
      metadataList: editingFlowNode.value.metadataList
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
</script>