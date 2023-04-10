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
  counter: any;
}
interface State {
  list: any[];
  disabled: boolean;
}

const CountForm: React.FC<Props> = props => {
    
  const { form , index,  action, counter } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (action === 'edit') {
      removeCounterByIndex(props?.state?.details, index);
      props.setState({});
      return;
    } 
    props?.state?.counters?.splice(index, 1);
    props.setState({});
  };

  function removeCounterByIndex(data, indexs) {
    if (!data || !data.counters) {
      return;
    }
  
    if (indexs < 0 || index >= data.counters.length) {
      return;
    } 
    data.counters.splice(indexs, 1);
  }

  return (
     <Form layout="inline" style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <Form.Item  label="初始值">
            {getFieldDecorator(`${index}_start`, {
              initialValue: action === 'edit' ? counter?.start : undefined,
              rules: [{ required: false, message: '请输入初始值!' }],
            })(<Input placeholder="请输入初始值" style={{ width: 200 }}/>)}
          </Form.Item>
          <Form.Item  label="递增" >
            {getFieldDecorator(`${index}_incr`, {
              initialValue: action === 'edit' ? counter?.incr : undefined,
              rules: [{ required: false, message: '请输入递增!' }],
            })(<Input placeholder="请输入文件名" style={{ width: 200 }}/>)}
          </Form.Item>
          <Form.Item  label="最大值">
            {getFieldDecorator(`${index}_end`, {
              initialValue: action === 'edit' ? counter?.end : false,
              rules: [{ required: false, message: '请输入最大值!' }],
            })(<Input placeholder="请输入最大值" style={{ width: 200 }}/>)}
          </Form.Item>
          <Form.Item  label="数字格式">
            {getFieldDecorator(`${index}_format`, {
              initialValue: action === 'edit' ? counter?.format : false,
              rules: [{ required: false, message: '请输入数字格式!' }],
            })(<Input placeholder="请输入数字格式" style={{ width: 200 }}/>)}
          </Form.Item>
          <Form.Item  label="引用名称">
            {getFieldDecorator(`${index}_name`, {
              initialValue: action === 'edit' ? counter?.name : false,
              rules: [{ required: false, message: '请输入引用名称!' }],
            })(<Input placeholder="请输入引用名称" style={{ width: 200 }}/>)}
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>

  );
};
export default CountForm;
