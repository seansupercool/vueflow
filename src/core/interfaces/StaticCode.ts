export interface CustomProperty {
  system: string;
  platform: string;
  subsystem: string;
}

export interface StaticCode {
  id: string;
  codeId: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  isI18n: boolean;
  customProperty: CustomProperty;
  createdBy: string;
  createdTime: string;
  modifiedBy: string;
  modifiedTime: string;
}

export type StaticCodeList = StaticCode[];
