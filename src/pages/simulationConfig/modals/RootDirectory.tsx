import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import configService from '../service';
const { Option } = Select;
interface Props {
  form: any;
  state: any;
  setState: any;
}

const getInitState = () => ({
  buDisabled: true,
  datas: {
    pathType: 0,
    id: undefined,
  },
  context: {
    endpoint: '',
    bucketName: '',
    accessKeySecret: '',
    accessKeyId: '',
    ftpHost: '',
    ftpPort: '',
    username: '',
    passwd: '',
    basePath: '',
  },
});

const RootDirectory: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer(getInitState());
  const formItemProps: FormItemProps = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const handleOk = () => {
    props.form.validateFields(async (err, values) => {
      if (err) {
        message.info('请检查表单必填项');
        return;
      }
      const { datas } = state;
      const {
        data: { data, success },
      } = await configService.[datas.id ? 'pathUpdate' : 'pathCreate']({
        id: datas?.id,
        context: JSON.stringify(values),
      }).then((res) => {
        if (success) {
          message.success('保存成功');
          props.setState({
            visible: false,
          });
          props.form.resetFields();
        }
      });
    });
  };

  useEffect(() => {
    if (props.state.visible) {
      onClick();
    }
  }, []);

  const onClick = async () => {
    setState({
      buDisabled: props.state.buDisabled,
      datas: props.state.datas,
      context: props.state.context,
    });
  };

  const handleCancel = () => {
    setState({
      buDisabled: true,
    });
    props.form.resetFields();
    props.setState({
      visible: false,
    });
  };

  const validateZhKey = async (rule, values, callback) => {
    const patt1 = new RegExp(/\s+/g);
    if (patt1.test(values)) {
      callback('不能有空格');
    }
    if (!values) {
      callback('值不能为空');
    }
  };

  const getFormContent = () => {
    switch (props.form.getFieldValue('pathType')) {
      // ftp类型
      case '1':
        return (
          <div>
            <Form.Item label="ip" required>
              {props.form.getFieldDecorator('ftpHost', {
                rules: [{ validator: validateZhKey }],
                initialValue: state.context?.ftpHost || '',
              })(<Input placeholder="请输入ip" />)}
            </Form.Item>
            <Form.Item label="端口" required>
              {props.form.getFieldDecorator('ftpPort', {
                rules: [{ validator: validateZhKey }],
                initialValue: state.context?.ftpPort || '',
              })(<Input placeholder="请输入端口" />)}
            </Form.Item>
            <Form.Item label="basePath" required>
              {props.form.getFieldDecorator('basePath', {
                rules: [{ validator: validateZhKey }],
                initialValue: state.context?.basePath || '',
              })(<Input placeholder="请输入basePath" />)}
            </Form.Item>
            <Form.Item label="账号" required>
              {props.form.getFieldDecorator('username', {
                rules: [{ validator: validateZhKey }],
                initialValue: state.context?.username || '',
              })(<Input placeholder="请输入账号" />)}
            </Form.Item>
            <Form.Item label="密码" required>
              {props.form.getFieldDecorator('passwd', {
                rules: [{ validator: validateZhKey }],
                initialValue: state.context?.passwd || '',
              })(<Input placeholder="请输入密码" type="password" />)}
            </Form.Item>
          </div>
        );
      // swift类型
      case '2':
        return (
          <div>
            <Form.Item label="连接方式" required>
              {props.form.getFieldDecorator('swiftType', {
                initialValue: '1',
                rules: [{ validator: validateZhKey }],
              })(
                <Select placeholder="请选择">
                  <Select.Option value="1">用户名</Select.Option>
                  <Select.Option value="2">ak</Select.Option>
                </Select>
              )}
            </Form.Item>

            {props.form.getFieldValue('swiftType') === '1' && (
              <>
                <Form.Item label="username" required>
                  {props.form.getFieldDecorator('username', {
                    initialValue: state.context?.username || '',
                    rules: [{ validator: validateZhKey }],
                  })(<Input placeholder="请输入username" />)}
                </Form.Item>
                <Form.Item label="userKey" required>
                  {props.form.getFieldDecorator('userKey', {
                    initialValue: state.context?.userKey || '',
                    rules: [{ validator: validateZhKey }],
                  })(<Input placeholder="请输入userKey" />)}
                </Form.Item>
              </>
            )}
            <Form.Item label="account" required>
              {props.form.getFieldDecorator('account', {
                initialValue: state.context?.account || '',
                rules: [{ validator: validateZhKey }],
              })(<Input placeholder="请输入account" />)}
            </Form.Item>
            {props.form.getFieldValue('swiftType') === '2' && (
              <Form.Item label="ak" required>
                {props.form.getFieldDecorator('ak', {
                  initialValue: state.context?.ak || '',
                  rules: [{ validator: validateZhKey }],
                })(<Input placeholder="请输入ak" />)}
              </Form.Item>
            )}
            <Form.Item label="url" required>
              {props.form.getFieldDecorator('url', {
                initialValue: state.context?.url || '',
                rules: [{ validator: validateZhKey }],
              })(<Input placeholder="请输入url" />)}
            </Form.Item>
            <Form.Item label="container" required>
              {props.form.getFieldDecorator('container', {
                initialValue: state.context?.container || '',
                rules: [{ validator: validateZhKey }],
              })(<Input placeholder="请输入container" />)}
            </Form.Item>
          </div>
        );
      // oss类型
      default:
        return (
          <div>
            <Form.Item label="endpoint" required>
              {props.form.getFieldDecorator('endpoint', {
                initialValue: state.context?.endpoint || '',
                rules: [{ validator: validateZhKey }],
              })(<Input placeholder="请输入endpoint" />)}
            </Form.Item>
            <Form.Item label="accessKeyId" required>
              {props.form.getFieldDecorator('accessKeyId', {
                initialValue: state.context?.accessKeyId || '',
                rules: [{ validator: validateZhKey }],
              })(
                <Input
                  placeholder="请输入accessKeyId"
                  type="password"
                  maxLength={30}
                />
              )}
            </Form.Item>
            <Form.Item label="accessKeySecret" required>
              {props.form.getFieldDecorator('accessKeySecret', {
                initialValue: state.context?.accessKeySecret || '',
                rules: [{ validator: validateZhKey }],
              })(
                <Input
                  placeholder="请输入accessKeySecret"
                  type="password"
                  maxLength={30}
                />
              )}
            </Form.Item>
            <Form.Item label="bucketName" required>
              {props.form.getFieldDecorator('bucketName', {
                initialValue: state.context?.bucketName || '',
                rules: [{ validator: validateZhKey }],
              })(<Input placeholder="请输入bucketName" />)}
            </Form.Item>
          </div>
        );
    }
  };

  return (
    <Modal
      title="探针根目录编辑"
      visible={props.state.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          disabled={state.buDisabled}
        >
          确认编辑
        </Button>,
      ]}
    >
      <Form onSubmit={handleOk} {...formItemProps}>
        <Form.Item label="类型">
          {props.form.getFieldDecorator('pathType', {
            initialValue: state.datas.pathType
              ? `${state.datas?.pathType}`
              : '0',
            rules: [{ required: true, message: `请输入类型` }],
          })(
            <Select placeholder="请选择类型">
              <Option value="0">oss</Option>
              <Option value="1">ftp</Option>
              <Option value="2">swift</Option>
            </Select>
          )}
        </Form.Item>
        {getFormContent()}
      </Form>
    </Modal>
  );
};
export default Form.create()(RootDirectory);
