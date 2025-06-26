<script setup lang="ts">
import { BaseEdge, getSimpleBezierPath } from '@vue-flow/core'
import type { EdgeProps, MarkerType } from '@vue-flow/core'
import type { VueFlowNode, VueFlowEdge } from '../core/interfaces/VueFlow'
import {ColumnType} from '../core/enums/VueFlow'


const props = defineProps<EdgeProps>()
  const [edgePath] = getSimpleBezierPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  targetX: props.targetX,
  targetY: props.targetY,
})
</script>

<template>
  <g>
    <!-- 主線 -->
    <path
      :d="edgePath"
      class="vue-flow__edge-path"
      :stroke="props.data?.color ?? '#0ea5e9'"
      stroke-width="3"
      fill="none"
      stroke-dasharray="8 4"
    />

    <!-- 文字沿線顯示 -->
    <text>
      <textPath :href="`#${props.id}`" startOffset="50%" text-anchor="middle">
        1111
      </textPath>
    </text>

    <!-- 自訂箭頭，跟 markerEnd 二擇一 -->
    <marker
      :id="`${props.id}-arrow`"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" :fill="props.data?.color ?? '#0ea5e9'" />
    </marker>
  </g>
</template>

<style lang="scss">
@use '../styles/components/CustomEdge.scss';
</style>
