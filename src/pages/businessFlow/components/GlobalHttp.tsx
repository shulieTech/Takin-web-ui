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
}
interface State {
  list: any[];
  disabled: boolean;
}

const GlobalHttp: React.FC<Props> = props => {
  const { form , index,  action } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  const globalHttp = props?.value;

  return (
     <Form layout="inline" style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <Form.Item  label="协议">
            {getFieldDecorator(`protocol`, {
              initialValue: action === 'edit' ? globalHttp?.protocol : undefined,
              rules: [{ required: false, message: '请输入协议!' }],
            })(<Input placeholder="请输入协议" style={{ width: 200 }}/>)}
          </Form.Item>
          <Form.Item  label="服务器名称或IP" >
            {getFieldDecorator(`domain`, {
              initialValue: action === 'edit' ? globalHttp?.domain : undefined,
              rules: [{ required: false, message: '请输入服务器名称或IP!' }],
            })(<Input placeholder="请输入服务器名称或IP" style={{ width: 350 }}/>)}
          </Form.Item>
          <Form.Item  label="端口号" >
            {getFieldDecorator(`port`, {
              initialValue: action === 'edit' ? globalHttp?.port : undefined,
              rules: [{ required: false, message: '请输入端口号!' }],
            })(<Input placeholder="请输入端口号" style={{ width: 100 }}/>)}
          </Form.Item>
          <Form.Item  label="路径" >
            {getFieldDecorator(`path`, {
              initialValue: action === 'edit' ? globalHttp?.path : undefined,
              rules: [{ required: false, message: '请输入路径!' }],
            })(<Input placeholder="请输入路径" style={{ width: 500 }}/>)}
          </Form.Item>
          <Form.Item  label="内容编码" >
            {getFieldDecorator(`contentEncoding`, {
              initialValue: action === 'edit' ? globalHttp?.contentEncoding : undefined,
              rules: [{ required: false, message: '请输入内容编码!' }],
            })(<Input placeholder="请输入内容编码" style={{ width: 150 }}/>)}
          </Form.Item>
        </Form>

  );
};
export default GlobalHttp;
