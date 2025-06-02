<template>
  <div class="node-library" v-if="selectedNode || nodeState === NodeState.NEW_NODE">
    <div class="node-library-header">
      <h3>{{ nodeState === NodeState.NEW_NODE ? '新增元件' : '修改元件' }}</h3>
      <button class="close-btn" @click="handleClose">×</button>
    </div>
    <div class="node-library-content">
      <NodeForm
        :isNewNode="nodeState === NodeState.NEW_NODE"
        :nodeData="currentNode"
        :onSubmit="handleSubmit"
        :onDelete="handleDelete"
        :isExpanded="true"
        @toggle="handleToggle"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NodeForm from './NodeForm.vue'
import type { VueFlowNode } from '../core/interfaces/VueFlow'

enum NodeState {
  NONE = 'none',
  SELECT_NODE = 'selectNode',
  NEW_NODE = 'newNode'
}

const props = defineProps<{
  selectedNode: VueFlowNode | null
  nodeState: NodeState
}>()

const emit = defineEmits<{
  (e: 'updateNode', node: VueFlowNode): void
  (e: 'addNode', node: VueFlowNode): void
  (e: 'deleteNode', nodeId: string): void
  (e: 'closeNodeForm'): void
}>()

// 計算當前顯示的節點數據
const currentNode = computed(() => {
  if (props.nodeState === NodeState.NEW_NODE) {
    return undefined
  }
  return props.selectedNode || undefined
})

const handleToggle = () => {
  // 由於現在只有一個 NodeItem，不需要處理展開/收起的狀態
}

const handleSubmit = (nodeData: VueFlowNode) => {
  if (props.nodeState === NodeState.NEW_NODE) {
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

const handleCancel = () => {
  emit('closeNodeForm')
}

const handleClose = () => {
  emit('closeNodeForm')
}

const handleDelete = () => {
  if (props.nodeState === NodeState.SELECT_NODE) {
    emit('deleteNode', props.selectedNode?.id)
  }
  emit('closeNodeForm')
}
</script>

<style lang="scss">
@use '../styles/components/NodeLibrary.scss';
</style> 