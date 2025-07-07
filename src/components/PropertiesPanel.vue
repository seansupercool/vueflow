<template>
  <div class="properties-panel" v-if="propertiesState != PropertiesState.NONE">
    <div class="properties-panel-header">
      <h3>{{ title }}</h3>
      <button class="close-btn" @click="handleClose">×</button>
    </div>
    <div class="properties-panel-content">
      <NodeForm
        v-if="propertiesState === PropertiesState.NEW_NODE || propertiesState === PropertiesState.SELECT_NODE"
        :isNewNode="propertiesState === PropertiesState.NEW_NODE"
        :decisionNode="currentNode"
        :isExpanded="true"
        @confirm="handleNodeSave"
        @add="handleNodeAdd"
        @delete="handleNodeDelete"
        @cancel="handleNodeCancel"
      />
      <EdgeForm
        v-if="propertiesState === PropertiesState.NEW_EDGE || propertiesState === PropertiesState.SELECT_EDGE"
        :decisionEdge="currentEdge"
        @delete="handleEdgeDelete"
        @confirm="handleEdgeConfirm"
        @cancel="handleEdgeCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import NodeForm from './NodeForm.vue'
import type { DecisionNode, DecisionEdge } from '../core/interfaces/DecisionTree'
import EdgeForm from './EdgeForm.vue'
import { PropertiesState, ColumnType, MetaDataType } from '../core/enums/VueFlow'

const props = defineProps<{
  selectedNode: DecisionNode | null
  selectedEdge: DecisionEdge | null
  propertiesState: PropertiesState
}>()

const emit = defineEmits<{
  (e: 'close'): void
  // Node Control Functions
  (e: 'updateNode', decisionNode: DecisionNode): void
  (e: 'addNode', decisionNode: DecisionNode): void
  (e: 'deleteNode', nodeId: string): void
  (e: 'cancelNode'): void
  // Edge Control Functions
  (e: 'updateEdge', decisionEdge: DecisionEdge): void
  (e: 'deleteEdge', edgeId: string): void
  (e: 'cancelEdge'): void
}>()

const newNodeData = ref<DecisionNode | null>(null)
watch(() => props.propertiesState, (newVal) => {
  if (newVal === PropertiesState.NEW_NODE) {
    newNodeData.value = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        columnType: ColumnType.CONDITION,
        metadataList: [{
          index: 0,
          label: '',
          desc: '',
          columnName: '',
          dataType: MetaDataType.STRING,
          mandatory: false,
          codeId: '',
          codeUid: '',
          resultValue: ''
        }]
      }
    }
  } else {
    newNodeData.value = null
  }
})

// 計算當前顯示的節點數據
const currentNode = computed(() => {
  if (props.propertiesState === PropertiesState.NEW_NODE) {
    return {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        columnType: ColumnType.CONDITION,
        metadataList: [{
          index: 0,
          label: '',
          desc: '',
          columnName: '',
          dataType: MetaDataType.STRING,
          mandatory: false,
          codeId: '',
          codeUid: '',
          resultValue: ''
        }]
      }
    }
  }
  return props.selectedNode || undefined
})

const currentEdge = computed(() => {
  console.log("currentEdge", props.selectedEdge)
  return props.selectedEdge || undefined
})

const title = computed(() => {
  switch (props.propertiesState) {
    case PropertiesState.NEW_NODE:
      return '新增元件'
    case PropertiesState.SELECT_NODE:
      return '修改元件'
    case PropertiesState.NEW_EDGE:
      return '新增條件'
    case PropertiesState.SELECT_EDGE:
      return '修改條件'
    default:
      return '元件設定'
  }
})

const handleNodeSave = (editDecisionNode: DecisionNode) => {
  if (props.propertiesState === PropertiesState.NEW_NODE) {
    emit('addNode', editDecisionNode)
  } else if (props.selectedNode) {
    // 更新現有節點
    const updatedNode: DecisionNode = {
      ...props.selectedNode,
      ...editDecisionNode
    }
    emit('updateNode', updatedNode)
  }
  emit('close')
}

const handleNodeAdd = (nodeData: DecisionNode) => {
  emit('addNode', nodeData)
  if (props.propertiesState === PropertiesState.NEW_NODE) {
    emit('close')
  }
}

const handleNodeCancel = () => {
  emit('close')
}

const handleClose = () => {
  emit('close')
}

const handleNodeDelete = () => {
  if (props.selectedNode) {
    emit('deleteNode', props.selectedNode.id)
  }
}

// Edge Control Functions
const handleEdgeConfirm = (edgeData: DecisionEdge) => {
  emit('updateEdge', edgeData)
}

const handleEdgeCancel = () => {
  emit('cancelEdge')
}

const handleEdgeDelete = () => {
  if (props.selectedEdge) {
    emit('deleteEdge', props.selectedEdge.id)
  }
}
</script>

<style lang="scss">
@use '../styles/components/PropertiesPanel.scss';
</style> 