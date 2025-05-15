import type { Node, Edge } from '@vue-flow/core'

interface UnderwritingNode {
  factor: string
  ans: string
  next: UnderwritingNode[] | string
  note?: string | null
  med_exam?: string | null
  med_record?: string | null
  exclusion?: string | null
  ref_disease?: string | null
}

interface UnderwritingData {
  審標中文: string
  審標代碼: string
  next: UnderwritingNode[]
}

let nodeId = 0
let edgeId = 0

function generateId() {
  return `node-${nodeId++}`
}

function generateEdgeId() {
  return `edge-${edgeId++}`
}

function createNode(data: UnderwritingNode, position: { x: number; y: number }): Node {
  const id = generateId()
  return {
    id,
    type: 'default',
    position,
    data: {
      label: `${data.factor}: ${data.ans}`,
      note: data.note,
      med_exam: data.med_exam,
      med_record: data.med_record,
      exclusion: data.exclusion,
      ref_disease: data.ref_disease
    }
  }
}

function calculateNodePosition(level: number, index: number): { x: number; y: number } {
  // 層級位置映射表
  const levelPositions: Record<number, { y: number; x: number }> = {
    0: { y: -196, x: -88 }, // 根節點
    1: { y: 150, x: -1003 + (index * 374) },
    2: { y: 282, x: index === 0 ? -1132 : index === 1 ? -932 : -629 },
    3: { y: 440, x: index === 0 ? -548 : index === 1 ? -754 : -335 },
    4: { y: 562, x: index === 0 ? -136 : index === 1 ? -386 : -218 },
    5: { y: 700, x: index === 0 ? 87 : index === 1 ? 325 : 639 }
  }

  return levelPositions[level] || { x: 0, y: 0 }
}

export function parseUnderwritingData(data: UnderwritingData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []
  nodeId = 0
  edgeId = 0

  const levelNodeCounts = new Map<number, number>()
  const nodeMap = new Map<string, Node>()

  // 創建根節點
  const rootNode: Node = {
    id: generateId(),
    type: 'default',
    position: calculateNodePosition(0, 0),
    data: {
      label: `${data.審標中文} (${data.審標代碼})`
    }
  }
  nodes.push(rootNode)
  levelNodeCounts.set(0, 1)

  function processNode(node: UnderwritingNode, parentId: string, level: number, index: number) {
    const currentLevelCount = levelNodeCounts.get(level) || 0
    levelNodeCounts.set(level, currentLevelCount + 1)

    const nodeKey = `${node.factor}-${node.ans}-${parentId}`
    const position = calculateNodePosition(level, index)

    let currentNode: Node
    if (nodeMap.has(nodeKey)) {
      const existingNode = nodeMap.get(nodeKey)!
      currentNode = {
        ...existingNode,
        id: generateId(),
        position
      }
    } else {
      currentNode = {
        id: generateId(),
        type: 'default',
        position,
        data: {
          label: node.factor
        }
      }
      nodeMap.set(nodeKey, currentNode)
    }

    nodes.push(currentNode)

    // 邊上加上 ans 作為 label
    edges.push({
      id: generateEdgeId(),
      source: parentId,
      target: currentNode.id,
      type: 'smoothstep',
      label: node.ans
    })

    if (Array.isArray(node.next)) {
      node.next.forEach((child, idx) => {
        processNode(child, currentNode.id, level + 1, idx)
      })
    } else {
      const endNodeKey = `end-${node.next}-${currentNode.id}`
      let endNode: Node

      const nextLevel = level + 1
      const nextLevelCount = levelNodeCounts.get(nextLevel) || 0
      levelNodeCounts.set(nextLevel, nextLevelCount + 1)

      const endPosition = calculateNodePosition(nextLevel, nextLevelCount)

      if (nodeMap.has(endNodeKey)) {
        const existingEndNode = nodeMap.get(endNodeKey)!
        endNode = {
          ...existingEndNode,
          id: generateId(),
          position: endPosition
        }
      } else {
        endNode = {
          id: generateId(),
          type: 'default',
          position: endPosition,
          data: {
            label: `結果: ${node.next}`
          }
        }
        nodeMap.set(endNodeKey, endNode)
      }

      nodes.push(endNode)
      edges.push({
        id: generateEdgeId(),
        source: currentNode.id,
        target: endNode.id,
        type: 'smoothstep',
        label: node.ans // ➤ 終點邊也加上 label
      })
    }
  }

  data.next.forEach((node, index) => {
    processNode(node, rootNode.id, 1, index)
  })

  return { nodes, edges }
}
