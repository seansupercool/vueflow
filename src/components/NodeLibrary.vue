<template>
  <div class="node-library" v-if="selectedNode || showNewNodeForm">
    <div class="node-library-header">
      <h3>{{ showNewNodeForm ? '新增元件' : '元件庫' }}</h3>
    </div>
    <div class="node-library-content">
      <NodeItem
        v-if="showNewNodeForm"
        :isNewNode="true"
        :onSubmit="handleNewNodeSubmit"
        :isExpanded="true"
        @cancel="$emit('closeNewNodeForm')"
      ></NodeItem>

      <div v-if="selectedNode" class="node-list">
        <NodeItem
          :key="selectedNode.id"
          :isNewNode="false"
          :nodeData="selectedNode"
          :onSubmit="handleSubmit"
          :onDelete="() => deleteNode(selectedNode)"
          :isExpanded="true"
          @toggle="handleToggle(selectedNode.id)"
          @cancel="$emit('update:selectedNode', null)"
        ></NodeItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NodeItem from './NodeItem.vue'
import type { GraphNode } from '../core/interfaces/Graph'

const props = defineProps<{
  selectedNode: GraphNode | null
  showNewNodeForm: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedNode', node: GraphNode | null): void
  (e: 'updateNode', node: GraphNode): void
  (e: 'addNode', node: GraphNode): void
  (e: 'deleteNode', nodeId: string): void
  (e: 'closeNewNodeForm'): void
}>()

const expandedNodeId = ref<string | null>(null)

const handleToggle = (nodeId: string) => {
  if (expandedNodeId.value === nodeId) {
    expandedNodeId.value = null
  } else {
    expandedNodeId.value = nodeId
  }
}

const handleSubmit = (nodeData: GraphNode) => {
  emit('updateNode', nodeData)
  emit('update:selectedNode', null)
  expandedNodeId.value = null
}

const handleNewNodeSubmit = (nodeData: GraphNode) => {
  const newNodeData: GraphNode = {
    ...nodeData,
    type: 'custom'
  }
  emit('addNode', newNodeData)
  emit('closeNewNodeForm')
  expandedNodeId.value = null
}

const deleteNode = (nodeData: GraphNode) => {
  emit('deleteNode', nodeData.id)
  emit('update:selectedNode', null)
}
</script>

<style lang="scss">
@use '../styles/components/_node-library.scss';
</style> 