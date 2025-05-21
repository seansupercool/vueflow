export const expressionTypeMapping = {
  EQUALS: "1", // 等於
  NOT_EQUALS: "2", // 不等於
  GREATER_THAN: "3", // 大於
  LESS_THAN: "4", // 小於
  CONTAINS: "5", // 包含
  NOT_CONTAINS: "6", // 不包含
} as const;

export type ExpressionType = typeof expressionTypeMapping[keyof typeof expressionTypeMapping];

// 用於下拉選單的選項
export const expressionTypeOptions = [
  { label: "等於", value: expressionTypeMapping.EQUALS },
  { label: "不等於", value: expressionTypeMapping.NOT_EQUALS },
  { label: "大於", value: expressionTypeMapping.GREATER_THAN },
  { label: "小於", value: expressionTypeMapping.LESS_THAN },
  { label: "包含", value: expressionTypeMapping.CONTAINS },
  { label: "不包含", value: expressionTypeMapping.NOT_CONTAINS },
] as const; 