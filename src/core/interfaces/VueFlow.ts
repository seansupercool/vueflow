import type { Node, Edge } from '@vue-flow/core'
import { MetaDataType, ColumnType } from '../enums/Node'

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeMetadata {
  index: number;
  columnType: ColumnType;
  label: string;
  desc: string;
  columnName: string;
  dataType: MetaDataType;
  mandatory: boolean;
  codeId: string;
  codeUid: string;
}

export interface VueFlowNode {
  id: string;
  position: NodePosition;
  type: string;
  metadataList: NodeMetadata[];
}

export interface EdgeMetadata {
  columnName: string;
  expressionType: string;
  entryText: string;
}

export interface VueFlowEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  style: Record<string, any>;
  type: string;
  metadata: EdgeMetadata;
}

export interface VueFlowData {
  nodes: Node[];
  edges: Edge[];
}
