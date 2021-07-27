import { CardProps } from 'antd/lib/card';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { RadioGroupProps } from 'antd/lib/radio';
import CommonFormProps from 'racc/dist/common-form/type';
import { CommonSelectProps } from 'racc/dist/common-select/type';
import { CommonTableProps } from 'racc/dist/common-table/CommonTable';

export interface SearchTableProps {
  title?: string | React.ReactNode;
  extra?: React.ReactNode;
  tableWarning?: React.ReactNode;
  tableAction?: React.ReactNode;
  footerAction?: React.ReactNode;
  commonFormProps?: Partial<CommonFormProps>;
  commonTableProps?: CommonTableProps;
  filterData?: FilterDataProps[] | any;
  ajaxProps: { method: 'GET' | 'POST'; url: string };
  datekeys?: { originKey: string; separateKey: string[] }[];
  cascaderKeys?: { originKey: string; separateKey: string[] }[];
  tabsData?: {
    label: string | React.ReactNode;
    value: any;
    num?: number;
  }[];
  tabKey?: string;
  onCheck?: (checkedKeys: any[], checkedRows?: any[]) => void;
  onSearch?: (searchParams: any, dataSource: any[]) => void;
  toggleRoload?: boolean;
  onTabSearch?: (searchParams?: any) => boolean;
  onTabReset?: (searchParams: any) => void;
  searchParams?: any;
  renderTable?: (dataSource: any[]) => React.ReactNode;
  dataKey?: string;
  theme?: 'dark' | 'light';
  tableCardProps?: CardProps;
}

export interface FilterDataProps {
  dataSource: { label: string; value: any }[];
  type?: 'checkbox' | 'radio' | 'select';
  key: string;
  label?: string | React.ReactNode;
  commonSelectProps?: CommonSelectProps;
  checkboxGroupProps?: CheckboxGroupProps;
  radioGroupProps?: RadioGroupProps;
  hideAllOption?: boolean;
}
