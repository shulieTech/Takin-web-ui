import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import { Form, Input, message, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
const { Option } = Select;
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
      // console.log(values);
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
            initialValue: 'oss',
            rules: [{ required: true, message: `请输入类型` }],
          })(
            <Select placeholder="请选择类型">
              <Option value="oss">oss</Option>
              <Option value="ftp">ftp</Option>
            </Select>
          )}
        </Form.Item>
        {
          props.form.getFieldValue('version') === 'ftp' && (
            <div>
              <Form.Item
                label="ip"
              >
                {props.form.getFieldDecorator('ip', {
                  rules: [{ required: true, message: `请输入地址` }],
                })(
                  <Input placeholder="请输入ip" />
                )}
              </Form.Item>
              <Form.Item
                label="端口"
              >
                {props.form.getFieldDecorator('version', {
                  rules: [{ required: true, message: `请输入端口` }],
                })(
                  <Input placeholder="请输入端口" />
                )}
              </Form.Item>
              <Form.Item
                label="账号"
              >
                {props.form.getFieldDecorator('version')(
                  <Input placeholder="请输入账号" />
                )}
              </Form.Item>
              <Form.Item
                label="密码"
              >
                {props.form.getFieldDecorator('version')(
                  <Input placeholder="请输入密码" type="password" />
                )}
              </Form.Item>
            </div>
          )}{ props.form.getFieldValue('version') === 'oss' && (
            <div>
              <Form.Item
                label="endpoint"
              >
                {props.form.getFieldDecorator('endpoint', {
                  rules: [{ required: true, message: `请输入endpoint` }],
                })(
                  <Input placeholder="请输入endpoint" />
                )}
              </Form.Item>
              <Form.Item
                label="accessKeyId"
              >
                {props.form.getFieldDecorator('accessKeyId', {
                  rules: [{ required: true, message: `请输入accessKeyId` }],
                })(
                  <Input placeholder="请输入accessKeyId" type="password"/>
                )}
              </Form.Item>
              <Form.Item
                label="accessKeySecret"
              >
                {props.form.getFieldDecorator('accessKeySecret')(
                  <Input placeholder="请输入accessKeySecret" type="password"/>
                )}
              </Form.Item>
              <Form.Item
                label="bucketName"
              >
                {props.form.getFieldDecorator('bucketName')(
                  <Input placeholder="请输入bucketName" />
                )}
              </Form.Item>
            </div>
          )
        }

      </Form>
    </CommonModal>
  );
};
export default Form.create()(RootDirectory);
