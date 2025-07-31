<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'
import type { DecisionNodeData } from '../core/interfaces/DecisionTree'
import {ColumnType} from '../core/enums/VueFlow'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<NodeProps<DecisionNodeData>>()
const showMeta = ref(false)
const labelRef = ref<HTMLElement | null>(null)
const tooltipPos = ref({ left: 0, top: 0 })

const updateTooltipPos = () => {
  if (labelRef.value) {
    const rect = labelRef.value.getBoundingClientRect()
    tooltipPos.value = {
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY,
    }
  }
}

const tooltipStyle = computed(() => ({
  position: 'absolute',
  left: tooltipPos.value.left + 'px',
  top: tooltipPos.value.top + 'px',
  zIndex: '9999',
}) as Record<string, string>)

// 👇你要的累積 metadata 顯示邏輯
const metaSummary = computed(() => {
  return props.data.metadataList
    .map((item) => `${item.label}${item.resultValue ? ':' + item.resultValue : ''}`)
    .join(' & ')
})

onMounted(() => {
  window.addEventListener('scroll', updateTooltipPos, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateTooltipPos, true)
})
watch(showMeta, (val) => {
  if (val) updateTooltipPos()
})
</script>

<template v-if="props.data">
  <div 
    class="custom-node" 
    :class="{ 'selected': props.selected }"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="node-content" :class="{ 'result-node': props.data.columnType === ColumnType.RESULT }">
      <span
        class="node-label"
        @mouseenter="showMeta = true"
        @mouseleave="showMeta = false"
        ref="labelRef"
      >
        {{ metaSummary }}
        <teleport to="body">
          <div
            v-if="showMeta && props.data.metadataList?.length"
            class="metadata-tooltip"
            :style="tooltipStyle"
          >
            <div
              v-for="(item, index) in props.data.metadataList"
              :key="index"
              class="metadata-item"
            >
              {{ item.label }}{{ props.data?.columnType === ColumnType.RESULT ? ':' + item.resultValue : '' }}
            </div>
          </div>
        </teleport>
      </span>
    </div>
    <Handle v-if="props.data?.columnType !== ColumnType.RESULT" type="source" :position="Position.Bottom" />
  </div>
</template>

<style lang="scss">
@use '../styles/components/CustomNode.scss';

.node-label {
  position: relative;
  cursor: pointer;
}

.metadata-tooltip {
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 8px 12px;
  min-width: 120px;
  margin-top: 4px;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  white-space: pre-line;
}
</style>
