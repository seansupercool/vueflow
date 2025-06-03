<template>
  <div class="properties-panel" v-if="propertiesState != PropertiesState.NONE">
    <div class="properties-panel-header">
      <h3>{{ title }}</h3>
      <button class="close-btn" @click="handleClose">×</button>
    </div>
    <div class="properties-panel-content">
      <NodeForm
        v-if="propertiesState === PropertiesState.NEW_NODE || propertiesState === PropertiesState.SELECT_NODE"
        :isNewNode="propertiesState === PropertiesState.NEW_NODE"
        :vueflowNode="currentNode"
        :onSubmit="handleNodeSubmit"
        :onDelete="handleNodeDelete"
        :isExpanded="true"
        @toggle="handleToggleToggle"
        @cancel="handleNodeCancel"
      />
      <EdgeForm
        :edge="selectedEdge"
        :onSubmit="handleEdgeSubmit"
        :onDelete="handleEdgeDelete"
        @cancel="handleCancelEdge"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NodeForm from './NodeForm.vue'
import type { VueFlowNode, VueFlowEdge } from '../core/interfaces/VueFlow'
import EdgeForm from './EdgeForm.vue'
import { PropertiesState } from '../core/enums/VueFlow'

const props = defineProps<{
  selectedNode: VueFlowNode | null
  selectedEdge: VueFlowEdge | null
  propertiesState: PropertiesState
}>()

const emit = defineEmits<{
  (e: 'updateNode', node: VueFlowNode): void
  (e: 'addNode', node: VueFlowNode): void
  (e: 'deleteNode', nodeId: string): void
  (e: 'closeNodeForm'): void
  (e: 'updateEdge', edge: VueFlowEdge): void
  (e: 'deleteEdge', edgeId: string): void
  (e: 'cancelEdge'): void
}>()

// 計算當前顯示的節點數據
const currentNode = computed(() => {
  // if (props.propertiesState === PropertiesState.NEW_NODE) {
  //   return undefined
  // }
  if (props.propertiesState === PropertiesState.NEW_NODE) {
    return {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'custom',
      position: { x: 0, y: 0 },
      columnType: 'C',
      metadataList: [{
        index: 0,
        label: '新節點',
        desc: '',
        columnName: '',
        dataType: 'STRING',
        mandatory: false,
        codeId: '',
        codeUid: '',
        resultValue: ''
      }]
    }
  }
  console.log("props.selectedNode", props.selectedNode)
  return props.selectedNode || undefined
})
const title = computed(() => {
  switch (props.propertiesState) {
    case PropertiesState.NEW_NODE:
      return '新增元件'
    case PropertiesState.SELECT_NODE:
      return '修改元件'
    case PropertiesState.NEW_EDGE:
      return '新增條件'
    case PropertiesState.SELECT_EDGE:
      return '修改條件'
    default:
      return '元件設定'
  }
})

const handleToggleToggle = () => {
  // 由於現在只有一個 NodeItem，不需要處理展開/收起的狀態
}

const handleNodeSubmit = (nodeData: VueFlowNode) => {
  if (props.propertiesState === PropertiesState.NEW_NODE) {
    emit('addNode', { ...nodeData, type: 'custom' })
  } else if (props.selectedNode) {
    // 更新現有節點
    const updatedNode: VueFlowNode = {
      ...props.selectedNode,
      ...nodeData,
      metadataList: nodeData.metadataList
    }
    emit('updateNode', updatedNode)
  }
  emit('closeNodeForm')
}

const handleEdgeSubmit = (edgeData: VueFlowEdge) => {
  emit('updateEdge', edgeData)
}

const handleCancelEdge = () => {
  emit('cancelEdge')
}

const handleNodeCancel = () => {
  emit('closeNodeForm')
}

const handleClose = () => {
  emit('closeNodeForm')
}

const handleNodeDelete = () => {
  if (props.propertiesState === PropertiesState.SELECT_NODE) {
    emit('deleteNode', props.selectedNode?.id)
  }
  emit('closeNodeForm')
}

const handleEdgeDelete = () => {
  if (props.selectedEdge) {
    emit('deleteEdge', props.selectedEdge.id)
  }
  emit('closeNodeForm')
}
</script>

<style lang="scss">
@use '../styles/components/PropertiesPanel.scss';
</style> 