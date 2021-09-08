/**
 * @name 模板类型
 */

export interface TempleteType {
  key?: string;
  label?: string;
  title?: string;
  nodeType?: number;
  nodeInfo?: NodeInfoType;
  extra?: string;
}

interface NodeInfoType {
  text?: string;
  dataSource?: DataSourceProps[];
  subDataSource?: DataSourceProps[];
  keys: string;
  isEdit?: boolean;
  formItemProps?: any;
}

export interface DataSourceProps {
  label: string;
  value: number | string;
}
