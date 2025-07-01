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
          v-show="(isNewNode || editingFlowNode.data?.columnType === type)"
          :key="type"
          :class="['tab-btn', { active: editingFlowNode.data?.columnType === type }]" 
          @click="editingFlowNode.data && (editingFlowNode.data.columnType = type)"
        >
          {{ ColumnTypeLabel[type] }}元件
        </div>
      </div>
      <template v-if="editingFlowNode.data">
        <div v-for="(metadata, index) in editingFlowNode.data.metadataList" :key="index" class="metadata-section">
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
          <div v-if="editingFlowNode.data.columnType === ColumnType.RESULT" class="form-group">
            <label>結果值：</label>
            <input v-model="metadata.resultValue" type="text" placeholder="請輸入結果值">
          </div>
        </div>
        <div v-if="editingFlowNode.data?.columnType === ColumnType.RESULT" class="btn btn-secondary" @click="handleAddMetadata">
          新增 Metadata
        </div>
      </template>
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
import type { DecisionNode, DecisionNodeMetadata } from '../core/interfaces/DecisionTree'

const props = defineProps<{
  isNewNode: boolean,
  decisionNode?: DecisionNode,
  onSave?: (node: DecisionNode) => void,
  onAdd?: (node: DecisionNode) => void,
  onDelete?: () => void,
  isExpanded: boolean
}>()

const emit = defineEmits(['toggle', 'cancel', 'copy'])

const editingFlowNode = ref<DecisionNode>({
  id: '',
  type: 'custom',
  position: { x: 0, y: 0 },
  data: {
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
    }]}
})

// 監聽 nodeData 的變化
watch(
  () => props.decisionNode,
  (decisionNode) => {
    if (decisionNode) {
      editingFlowNode.value = JSON.parse(JSON.stringify(decisionNode))
      if (!editingFlowNode.value.data) {
        editingFlowNode.value.data = {
          columnType: ColumnType.CONDITION,
          metadataList: [],
        }
      }
    }
  },
  { immediate: true, deep: true },
)

const handleAddMetadata = () => {
  if (!editingFlowNode.value.data) return
  const newMetadata: DecisionNodeMetadata = {
    index: editingFlowNode.value.data.metadataList.length,
    label: '',
    desc: '',
    columnName: '',
    dataType: MetaDataType.STRING,
    mandatory: false,
    codeId: '',
    codeUid: '',
    resultValue: ''
  }
  editingFlowNode.value.data.metadataList.push(newMetadata)
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
  const copiedNode: DecisionNode = {
    ...editingFlowNode.value,
    id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'custom',
    position: { 
      x: editingFlowNode.value.position.x + 200,
      y: editingFlowNode.value.position.y
    }
  }
  props.onAdd?.(copiedNode)
}
</script>