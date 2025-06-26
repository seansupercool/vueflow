// composables/useGraph.ts
import { ref } from 'vue'
import type { VueFlowNode, VueFlowEdge, VueFlowData } from '@/core/interfaces/VueFlow'
import { initialVueFlowData } from '@/assets/data/initialMock'
import type { Node, Edge } from '@vue-flow/core'
import { expressionTypeOptions } from '@/constants/expressionTypeMapping'

export const convertToVueFlowNode = (node: VueFlowNode): Node => ({
  id: node.id,
  type: 'custom',
  position: node.position,
  data: {
    label: node.metadataList[0].label,
    columnType: node.columnType,
    metadataList: node.metadataList
  }
})

export const convertToVueFlowEdge = (edge: VueFlowEdge): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  animated: edge.animated,
  type: edge.type,
  style: edge.style,
  label: `${parseExpressionType(edge.metadata.expressionType)} ${edge.metadata.entryText}`,
  data: {
    metadata: edge.metadata
  }
})

const graphData = ref<VueFlowData>({
  nodes: initialVueFlowData.nodes,
  edges: initialVueFlowData.edges
})

// const graphData = ref<VueFlowData>({
//   nodes: initialVueFlowData.nodes.map(convertToVueFlowNode),
//   edges: initialVueFlowData.edges.map(convertToVueFlowEdge)
// })

export function parseExpressionType(expressionType: string | number): string {
  const found = expressionTypeOptions.find(opt => opt.value === String(expressionType))
  return found ? found.symbol : ''
}

export function useGraph() {
  const addNode = (node: VueFlowNode) => {
    graphData.value.nodes.push(convertToVueFlowNode(node))
  }

  const addEdge = (edge: VueFlowEdge) => {
    graphData.value.edges.push(convertToVueFlowEdge(edge))
  }

  const deleteNode = (nodeId: string) => {
    graphData.value.nodes = graphData.value.nodes.filter((node: Node) => node.id !== nodeId)
    graphData.value.edges = graphData.value.edges.filter(
      (edge: Edge) => edge.source !== nodeId && edge.target !== nodeId
    )
  }

  const deleteEdge = (edgeId: string) => {
    graphData.value.edges = graphData.value.edges.filter((edge: Edge) => edge.id !== edgeId)
  }

  return {
    graphData,
    addNode,
    addEdge,
    deleteNode,
    deleteEdge
  }
}
