import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import { Button, Form, Input, message, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import configService from '../service';
const { Option } = Select;
interface Props {
  form: any;
}

const getInitState = () => ({
  data: [],
  buDisabled: true,
  datas: {
    pathType: 0
  },
  context: {
    endpoint: '',
    bucketName: '',
    accessKeySecret: '',
    accessKeyId: ''
  }
});

const RootDirectory: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const formItemProps: FormItemProps = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const handleOk = () => {
    return new Promise(resolve => {
      props.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        delete values.pathType;
        if (state.datas?.id) {
          const {
            data: { data, success }
          } = await configService.pathUpdate({
            context: JSON.stringify(values),
            id: state.datas?.id,
            pathType: props.form.getFieldValue('pathType')
          });
          if (success) {
            resolve(true);
            message.success('保存成功');
            props.form.resetFields();

          }
          resolve(false);
        } else {
          const {
            data: { data, success }
          } = await configService.pathCreate({
            context: JSON.stringify(values),
            pathType: props.form.getFieldValue('pathType')
          });
          if (success) {
            resolve(true);
            message.success('保存成功');
            props.form.resetFields();

          }
          resolve(false);
        }
      });
    });
  };

  const onClick = async () => {
    const {
      data: { data, success }
    } = await configService.pathConfig({});
    if (success) {
      if (data?.editable === 1) {
        setState({
          buDisabled: true,
        });
      } else {
        setState({
          buDisabled: false,
        });
      }
      setState({
        datas: data,
        context: data && JSON.parse(data?.context)
      });
    }
  };

  const handleCancel = () => {
    setState({
      buDisabled: true,
    });
    props.form.resetFields();
  };

  return (
    <CommonModal
      onClick={onClick}
      afterCancel={handleCancel}
      modalProps={{
        width: 700,
        title: '探针根目录编辑',
        footer: [
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            disabled={state.buDisabled}
          >
            确认编辑
          </Button>,
        ]
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
          {props.form.getFieldDecorator('pathType', {
            initialValue: state.datas ? `${state.datas?.pathType}` : '0',
            rules: [{ required: true, message: `请输入类型` }],
          })(
            <Select placeholder="请选择类型">
              <Option value="0">oss</Option>
              <Option value="1">ftp</Option>
            </Select>
          )}
        </Form.Item>
        {
          props.form.getFieldValue('pathType') === '1' && (
            <div>
              <Form.Item
                label="ip"
              >
                {props.form.getFieldDecorator('ftpHost', {
                  rules: [{ required: true, message: `请输入地址` }],
                })(
                  <Input placeholder="请输入ip" />
                )}
              </Form.Item>
              <Form.Item
                label="端口"
              >
                {props.form.getFieldDecorator('ftpPort', {
                  rules: [{ required: true, message: `请输入端口` }],
                })(
                  <Input placeholder="请输入端口" />
                )}
              </Form.Item>
              <Form.Item
                label="账号"
              >
                {props.form.getFieldDecorator('username')(
                  <Input placeholder="请输入账号" />
                )}
              </Form.Item>
              <Form.Item
                label="密码"
              >
                {props.form.getFieldDecorator('passwd')(
                  <Input placeholder="请输入密码" type="password" />
                )}
              </Form.Item>
            </div>
          )}{props.form.getFieldValue('pathType') === '0' && (
            <div>
              <Form.Item
                label="endpoint"
              >
                {props.form.getFieldDecorator('endpoint', {
                  initialValue: state.context?.endpoint,
                  rules: [{ required: true, message: `请输入endpoint` }],
                })(
                  <Input placeholder="请输入endpoint" />
                )}
              </Form.Item>
              <Form.Item
                label="accessKeyId"
              >
                {props.form.getFieldDecorator('accessKeyId', {
                  initialValue: state.context?.accessKeyId,
                  rules: [{ required: true, message: `请输入accessKeyId` }],
                })(
                  <Input placeholder="请输入accessKeyId" type="password" />
                )}
              </Form.Item>
              <Form.Item
                label="accessKeySecret"
              >
                {props.form.getFieldDecorator('accessKeySecret', {
                  initialValue: state.context?.accessKeySecret,
                  rules: [{ required: true, message: `请输入accessKeySecret` }],
                })(
                  <Input placeholder="请输入accessKeySecret" type="password" />
                )}
              </Form.Item>
              <Form.Item
                label="bucketName"
              >
                {props.form.getFieldDecorator('bucketName', {
                  initialValue: state.context?.bucketName,
                  rules: [{ required: true, message: `请输入bucketName` }],
                })(
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
