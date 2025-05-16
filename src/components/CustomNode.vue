<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'

interface CustomNodeData {
  label: string
  forBE?: {
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
    <div class="node-content">
      {{ data.label }}
    </div>
  </div>
</template>

<style scoped>
.custom-node {
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #ddd;
  min-width: 150px;
}

.node-content {
  text-align: center;
  font-size: 14px;
}
</style>
