import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import { Form, Input, message } from 'antd';
import { FormItemProps } from 'antd/lib/form';

interface Props {
  form: any;
}

const getInitState = () => ({
  data: [],
});

const RootDirectory: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const formItemProps: FormItemProps = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const handleOk = e => {
    props.form.validateFields(async (err, values) => {
      if (err) {
        message.info('请检查表单必填项');
        return;
      }
      console.log(values);
      props.form.resetFields();
    });
  };
  return (
    <CommonModal
      beforeOk={handleOk}
      modalProps={{
        width: 600,
        title: '探针根目录编辑'
      }}
      btnProps={{
        type: 'default'
      }}
      btnText="探针根目录管理"
    >
      <Form onSubmit={handleOk} {...formItemProps}>
        <Form.Item
          label="类型"
        >
          {props.form.getFieldDecorator('version', {
            initialValue: '',
            rules: [{ required: true, message: `请输入类型` }],
          })(
            <Input placeholder="请输入类型" />
          )}
        </Form.Item>
        <Form.Item
          label="地址"
        >
          {props.form.getFieldDecorator('version', {
            initialValue: '',
            rules: [{ required: true, message: `请输入地址` }],
          })(
            <Input placeholder="请输入地址" />
          )}
        </Form.Item>
        <Form.Item
          label="路径"
        >
          {props.form.getFieldDecorator('version', {
            initialValue: '',
            rules: [{ required: true, message: `请输入路径` }],
          })(
            <Input placeholder="请输入路径" />
          )}
        </Form.Item>
        <Form.Item
          label="用户名"
        >
          {props.form.getFieldDecorator('version', {
            initialValue: '',
          })(
            <Input placeholder="请输入用户名" />
          )}
        </Form.Item>
        <Form.Item
          label="密码"
        >
          {props.form.getFieldDecorator('version', {
            initialValue: '',
          })(
            <Input placeholder="请输入密码" />
          )}
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
export default Form.create()(RootDirectory);
