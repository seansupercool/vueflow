export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeMetadata {
  index: number;
  columnType: string;
  label: string;
  desc: string;
  columnName: string;
  dataType: string;
  mandatory: boolean;
  codeId: string;
  codeUid: string;
}

export interface GraphNode {
  id: string;
  position: NodePosition;
  type: string;
  metadata: NodeMetadata;
}

export interface EdgeMetadata {
  columnName: string;
  expressionType: string;
  entryText: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  style: object;
  type: string;
  metadata: EdgeMetadata;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
