import CommonFormProps, { FormDataType } from 'racc/dist/common-form/type';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export interface FormCardMultipleProps {
  dataSource: FormCardMultipleDataSourceBean[];
  commonFormProps?: CommonFormProps;
  form?: WrappedFormUtils;
  getForm?: (form: WrappedFormUtils) => void;
}

export interface FormCardMultipleDataSourceBean {
  title?: React.ReactNode | string; // 标题
  titleSub?: React.ReactNode | string; // 副标题
  titleStyle?: React.CSSProperties; // 标题样式【暂未启用】
  extra?: React.ReactNode | string; //
  formData: FormDataType[]; //
  span?: number; //
  rowNum?: number;
  hide?: boolean; // 当前是否显示
}
