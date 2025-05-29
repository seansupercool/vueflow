<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'
import { ref } from 'vue'
import type { NodeMetadata } from '../core/interfaces/VueFlow'

interface CustomNodeData {
  label: string,
  metadataList: NodeMetadata[]
}

const props = defineProps<NodeProps<CustomNodeData>>()

// 移除本地的 isSelected ref
// const isSelected = ref(false)

// 移除本地的 handleClick 函數
// const handleClick = () => {
//   isSelected.value = true
// }
</script>

<template>
  <div 
    class="custom-node" 
    :class="{ 'selected': props.selected }"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="node-content" :class="{ 'result-node': props.data.metadataList[0]?.columnType === 'R' }">
      {{ props.data.metadataList[0]?.label || props.data.label }}
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.custom-node {
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #ddd;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-node.selected {
  border: 2px solid #ff0000;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
}

.node-content {
  text-align: center;
  font-size: 14px;
  color: #333;
}

.node-content.result-node {
  color: #b91e1e;
}
</style>
