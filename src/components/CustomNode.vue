<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'

interface CustomNodeData {
  label: string
  metadata?: {
    columnType: string
    label: string
    desc: string
    columnName: string
    dataType: string
    mandatory: boolean
  }
}

defineProps<NodeProps<CustomNodeData>>()
</script>

<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-content" :class="{ 'result-node': data.metadata?.columnType === 'R' }">
      {{ data.metadata?.label || data.label }}
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
