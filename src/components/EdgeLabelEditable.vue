<!-- components/EdgeLabelEditable.vue -->
<template>
  <div>
    <BaseEdge :path="path" :marker-end="markerEnd" />
    <div class="edge-label">
      <input
        :value="label"
        @input="updateLabel"
        @click.stop
        @keydown.stop
        class="edge-label-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseEdge } from '@vue-flow/core'
import type { EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()

const emit = defineEmits<{
  (e: 'update:label', value: string): void
}>()

const updateLabel = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:label', target.value)
}
</script>

<style lang="scss">
@use '../styles/components/EdgeLabelEditable.scss';
</style>
