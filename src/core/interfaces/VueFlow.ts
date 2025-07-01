import type { Node, Edge } from '@vue-flow/core'
import { MetaDataType, ColumnType } from '../enums/VueFlow'

export interface NodePosition {
  x: number;
  y: number;
}

export interface DecisionNodeMetadata {
  index: number;
  label: string;
  desc: string;
  columnName: string;
  dataType: MetaDataType;
  mandatory: boolean;
  codeId: string;
  codeUid: string;
  resultValue: string;
}

export interface DecisionNodeData {
  columnType: ColumnType;
  metadataList: DecisionNodeMetadata[];
}

export interface DecisionNode extends Node<DecisionNodeData> {}

export interface EdgeMetadata {
  label: string;
  columnName: string;
  expressionType: string;
  entryText: string;
}

export interface VueFlowEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  type: string;
  style?: object, 
  label: string;
  metadata: EdgeMetadata;
}

export interface VueFlowData {
  nodes: DecisionNode[];
  edges: Edge[];
}
