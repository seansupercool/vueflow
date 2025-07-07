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
  
  /**
   * 將目前的 decisionNodes 和 decisionEdges 轉成 decisionDiagram json 格式
   * 只保留 100A_Init.json 需要的欄位
   */
  const toDecisionDiagramJson = () => {
    const nodes = decisionNodes.value.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        label: node.data?.metadataList?.[0]?.label ?? '',
        columnType: node.data?.columnType ?? '',
        metadataList: node.data?.metadataList ?? []
      }
    }))
    const edges = decisionEdges.value.map(edge => ({
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      data: {
        columnLabel: edge.data?.columnLabel ?? '',
        columnName: edge.data?.columnName ?? '',
        expressionType: edge.data?.expressionType ?? '',
        entryText: edge.data?.entryText ?? ''
      }
    }))
    return { nodes, edges }
  }

  return {
    decisionNodes,
    decisionEdges,
    addNode,
    deleteNode,
    addEdge,
    deleteEdge,
    clearSelectionEdge,
    toDecisionDiagramJson
  }
}
