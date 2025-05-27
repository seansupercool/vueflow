// data/initialGraph.ts
import type { GraphData } from '@/core/interfaces/Graph'
import initData from '@/assets/data/decisionDiagram/100A_Init.json'

export const initialGraph: GraphData = JSON.parse(
  JSON.stringify(initData)
)
