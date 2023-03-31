import { Form, Input, Button,  Switch } from 'antd';
import React, { useEffect } from 'react';

interface Props {
  title?: string | React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  form?: any;
  index?: any;
  action?: string;
  setState?: any;
  csv: any;
}
interface State {
  list: any[];
  disabled: boolean;
}

const CsvForm: React.FC<Props> = props => {
    
  const { form , index,  action, csv } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (action === 'edit') {
      removeCsvByIndex(props?.state?.details, index);
      props.setState({});
      return;
    } 
    props?.state?.csvs?.splice(index, 1);
    props.setState({});
  };

  function removeCsvByIndex(data, indexs) {
    if (!data || !data.dataSource || !data.dataSource.csvs) {
      return;
    }
  
    if (indexs < 0 || index >= data.dataSource.csvs.length) {
      return;
    } 
    data.dataSource.csvs.splice(indexs, 1);
  }

  return (
     <Form layout="inline" style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <Form.Item  label="文件名">
            {getFieldDecorator(`${index}_fileName`, {
              initialValue: action === 'edit' ? csv?.fileName : undefined,
              rules: [{ required: true, message: '请输入文件名!' }],
            })(<Input placeholder="请输入文件名" style={{ width: 250 }}/>)}
          </Form.Item>
          <Form.Item  label="变量名（西文逗号间隔）" >
            {getFieldDecorator(`${index}_params`, {
              initialValue: action === 'edit' ? csv?.params : undefined,
              rules: [{ required: true, message: '请输入变量名!' }],
            })(<Input placeholder="请输入文件名" style={{ width: 350 }}/>)}
          </Form.Item>
          <Form.Item  label="首行忽略">
            {getFieldDecorator(`${index}_ingoreFirstLine`, {
              initialValue: action === 'edit' ? csv?.ingoreFirstLine : false,
              valuePropName: 'checked',
              rules: [{ required: true, message: '请输入压测API名称!' }],
            })(<Switch/>)}
          </Form.Item>
    
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>

  );
};
export default CsvForm;
