import { ref } from 'vue'
import type { DecisionNode, DecisionEdge } from '@/core/interfaces/DecisionTree'
import { initialVueFlowData } from '@/assets/data/initialMock'
import type { Node, Edge } from '@vue-flow/core'
import { expressionTypeOptions } from '@/constants/expressionTypeMapping'

const decisionNodes = ref<DecisionNode[]>(initialVueFlowData.nodes)
const decisionEdges = ref<DecisionEdge[]>(initialVueFlowData.edges)

export function parseExpressionType(expressionType: string | number): string {
  const found = expressionTypeOptions.find(opt => opt.value === String(expressionType))
  return found ? found.symbol : ''
}

export function useDecisionTree() {
  const addNode = (decisionNode: DecisionNode) => {
    decisionNodes.value.push(decisionNode)
    // graphData.value.nodes.push(convertToVueFlowNode(node))
  }

  const deleteNode = (nodeId: string) => {
    decisionNodes.value = decisionNodes.value.filter((node: Node) => node.id !== nodeId)
    decisionEdges.value = decisionEdges.value.filter(
      (edge: Edge) => edge.source !== nodeId && edge.target !== nodeId
    )
  }

  const addEdge = (decisionEdge: DecisionEdge) => {
    decisionEdges.value.push(decisionEdge)
  }

  const deleteEdge = (edgeId: string) => {
    decisionEdges.value = decisionEdges.value.filter((edge: Edge) => edge.id !== edgeId)
  }

  const clearSelectionEdge = () => {
    decisionEdges.value = decisionEdges.value.map(edge => ({
      ...edge,
      style: {}, // ✅ 清空 style
      selected: false // ✅ 如果你自定有 selected 屬性
    }))
  }
  

  return {
    decisionNodes,
    decisionEdges,
    addNode,
    deleteNode,
    addEdge,
    deleteEdge,
    clearSelectionEdge
  }
}
