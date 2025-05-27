/**
 * 元數據中的數據類型枚舉
 * 用於描述決策圖中節點的 metadataList 中的 dataType 欄位
 */
export enum MetaDataType {
  /** 字串類型 */
  STRING = '1',
  /** 數值類型（小數） */
  BIG_DECIMAL = '2',
  /** 布林類型 */
  BOOLEAN = '3',
  /** 日期類型 */
  DATE = '4',
  /** 時間戳類型 */
  TIMESTAMP = '5',
  /** 整數類型 */
  INTEGER = '6',
  /** 映射類型 */
  MAP = '7',
  /** 映射列表類型 */
  LIST_MAP = '8',
  /** 字串列表類型 */
  LIST_STRING = '9'
}

/**
 * 數據類型的中文描述
 */
export const MetaDataTypeLabel: Record<MetaDataType, string> = {
  [MetaDataType.STRING]: '字串',
  [MetaDataType.BIG_DECIMAL]: '數值',
  [MetaDataType.BOOLEAN]: '布林',
  [MetaDataType.DATE]: '日期',
  [MetaDataType.TIMESTAMP]: '時間戳',
  [MetaDataType.INTEGER]: '整數',
  [MetaDataType.MAP]: '映射',
  [MetaDataType.LIST_MAP]: '映射列表',
  [MetaDataType.LIST_STRING]: '字串列表'
}

/**
 * 節點類型枚舉
 * 用於描述決策圖中節點的類型
 */
export enum ColumnType {
  /** 條件節點 */
  CONDITION = 'C',
  /** 結果節點 */
  RESULT = 'R'
}

/**
 * 節點類型的中文描述
 */
export const ColumnTypeLabel: Record<ColumnType, string> = {
  [ColumnType.CONDITION]: '條件',
  [ColumnType.RESULT]: '結果'
} 