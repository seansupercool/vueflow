<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'
import type { VueFlowNode } from '../core/interfaces/VueFlow'
import {ColumnType} from '../core/enums/VueFlow'


const props = defineProps<NodeProps<VueFlowNode>>()

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
    <div class="node-content" :class="{ 'result-node': props.data?.columnType === ColumnType.RESULT }">
      <div v-for="(item, index) in props.data.metadataList" :key="index" class="metadata-item">
        {{ item.label }}: {{ item.resultValue }}
      </div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style lang="scss">
@import '../styles/components/CustomNode.scss';
</style>
