<script setup lang="ts">
import { computed } from 'vue'
import { Handle } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data?: { label?: string }
  selected?: boolean
}>()

const nodeStyle = computed(() => ({
  padding: '5px',
  border: '2px solid',
  borderColor: props.selected ? 'red' : '#555',
  backgroundColor: '#fff',
  borderRadius: '6px',
  minWidth: '100px',
  textAlign: 'center',
  userSelect: 'none'
}))
</script>

<template>
  <div :style="nodeStyle">
    {{ data?.label || 'No label' }}
    <Handle type="target" position="top" />
    <Handle type="source" position="bottom" />
  </div>
</template>
