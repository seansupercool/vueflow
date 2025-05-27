// composables/useGraph.ts
import { ref } from 'vue'
import type { GraphNode, GraphEdge, VueFlowData } from '@/core/interfaces/Graph'
import { initialGraph } from '@/assets/data/initialGraph'
import type { Node, Edge } from '@vue-flow/core'

const convertToVueFlowNode = (node: GraphNode): Node => ({
  id: node.id,
  type: 'custom',
  position: node.position,
  data: {
    label: node.metadataList[0].label,
    metadataList: node.metadataList
  }
})

const convertToVueFlowEdge = (edge: GraphEdge): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  animated: edge.animated,
  type: edge.type,
  style: edge.style,
  label: edge.metadata.entryText,
  data: {
    metadata: edge.metadata
  }
})

const graphData = ref<VueFlowData>({
  nodes: initialGraph.nodes.map(convertToVueFlowNode),
  edges: initialGraph.edges.map(convertToVueFlowEdge)
})

export function useGraph() {
  const addNode = (node: GraphNode) => {
    graphData.value.nodes.push(convertToVueFlowNode(node))
  }

  const addEdge = (edge: GraphEdge) => {
    graphData.value.edges.push(convertToVueFlowEdge(edge))
  }

  const deleteNode = (nodeId: string) => {
    graphData.value.nodes = graphData.value.nodes.filter(node => node.id !== nodeId)
    graphData.value.edges = graphData.value.edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    )
  }

  const deleteEdge = (edgeId: string) => {
    graphData.value.edges = graphData.value.edges.filter(edge => edge.id !== edgeId)
  }

  return {
    graphData,
    addNode,
    addEdge,
    deleteNode,
    deleteEdge
  }
}
