import type { Node, Edge } from '@vue-flow/core'
import { MetaDataType, ColumnType } from '../enums/VueFlow'

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

export interface DecisionNode extends Node<DecisionNodeData> {
  id: string;
  position: { x: number; y: number };
}

export interface DecisionEdgeData {
  columnLabel: string;
  columnName: string;
  expressionType: string;
  entryText: string;
  selected?: boolean;
}

export type DecisionEdge = Edge<DecisionEdgeData>
