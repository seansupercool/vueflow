// data/initialGraph.ts
import type { VueFlowData } from '@/core/interfaces/VueFlow'
import type { StaticCodeList } from '@/core/interfaces/StaticCode'
import initData from '@/assets/data/decisionDiagram/100A_Init.json'
import codes from '@/assets/data/decisionDiagram/codes.json'

export const initialGraph: VueFlowData = JSON.parse(
  JSON.stringify(initData)
)

export const initialStaticCode: StaticCodeList = JSON.parse(
  JSON.stringify(codes)
)