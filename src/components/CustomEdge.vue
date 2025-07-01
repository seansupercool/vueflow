<script setup lang="ts">
import { defineProps } from 'vue'
import type { EdgeProps } from '@vue-flow/core'

interface CustomEdgeProps extends EdgeProps {
  path: string
  bounds: { x: number; y: number; width: number; height: number }
}

const props = defineProps<CustomEdgeProps>()

const viewBox = `${props.bounds.x} ${props.bounds.y} ${props.bounds.width} ${props.bounds.height}`
</script>

<template>
  <svg
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow: visible;"
  >
    <path
      :d="props.path"
      fill="none"
      :stroke="props.selected ? 'red' : '#222'"
      stroke-width="3"
    />
  </svg>
</template>
