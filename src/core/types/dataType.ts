import { DataType } from '../enums/DataType'

export const DataTypeLabels: Record<DataType, string> = {
  [DataType.STRING]: 'string',
  [DataType.BIG_DECIMAL]: 'bigdecimal',
  [DataType.BOOLEAN]: 'boolean',
  [DataType.DATE]: 'date',
  [DataType.TIMESTAMP]: 'timestamp',
  [DataType.INTEGER]: 'integer',
  [DataType.MAP]: 'map',
  [DataType.LIST_MAP]: 'list<map>',
  [DataType.LIST_STRING]: 'list<string>'
} 