<template>
  <div class="node-library">
    <div class="node-library-header">
      <h3>元件庫</h3>
    </div>
    <div class="node-library-content">
      <NodeItem
        :isNewNode="true"
        :onSubmit="handleSubmit"
        :isExpanded="!selectedNode"
        @toggle="handleToggle('new')"
      ></NodeItem>

      <div class="node-list">
        <NodeItem
          v-if="selectedNode"
          :key="selectedNode.id"
          :isNewNode="false"
          :nodeData="selectedNode"
          :onSubmit="handleSubmit"
          :onDelete="() => deleteNode(selectedNode)"
          :isExpanded="true"
          @toggle="handleToggle(selectedNode.id)"
        ></NodeItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NodeItem from './NodeItem.vue'
import type { GraphNode } from '../types/graph'

const props = defineProps<{
  selectedNode: GraphNode | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedNode', node: GraphNode | null): void
  (e: 'updateNode', node: GraphNode): void
  (e: 'deleteNode', nodeId: string): void
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
  emit('update:selectedNode', nodeData)
  expandedNodeId.value = null
}

const deleteNode = (nodeData: GraphNode) => {
  emit('deleteNode', nodeData.id)
  emit('update:selectedNode', null)
}
</script>

<style scoped>
.node-library {
  width: 250px;
  height: 100%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.node-library-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-library-header h3 {
  margin: 0;
  font-size: 16px;
}

.node-library-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.node-form {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: move;
  user-select: none;
}

.form-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.form-header h3 {
  margin: 0;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.arrow-icon {
  width: 8px;
  height: 8px;
  border-right: 2px solid #666;
  border-bottom: 2px solid #666;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.arrow-icon.up {
  transform: rotate(-135deg);
}

.form-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.node-form.expanded .form-content {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}

.node-popup {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  margin-top: 8px;
}

.node-form:hover .node-popup {
  display: block;
}

.popup-content {
  font-size: 12px;
}

.popup-item {
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.popup-label {
  color: #666;
  margin-right: 8px;
}

.popup-value {
  color: #333;
  font-weight: 500;
}

.node-content {
  font-size: 16px;
  color: #333;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.tab-group {
  display: flex;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  border: 0px solid #ddd;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
}

.tab-btn:hover {
  background-color: #e9ecef;
}

.tab-btn.active {
  background-color: #26a862;
  color: white;
  border-color: #26a862;
}

.form-select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.form-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-textarea {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 8px;
  margin: 5px;
}

.submit-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #26a862;
}

.submit-btn:hover {
  transform: scale(1.05); /* 放大 1.2 倍 */
  
  /* background-color: #45a049; */
}

.form-group {
  padding: 0 16px;
}
</style> 