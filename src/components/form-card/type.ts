import CommonFormProps, { FormDataType } from 'racc/dist/common-form/type';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export interface FormCardProps {
  dataSource: FormCardDataSourceBean[];
  commonFormProps?: CommonFormProps;
  form?: WrappedFormUtils;
  getForm?: (form: WrappedFormUtils) => void;
}

export interface FormCardDataSourceBean {
  title?: React.ReactNode | string;
  titleStyle?: React.CSSProperties;
  extra?: React.ReactNode | string;
  formData: FormDataType[];
  span?: number;
}
