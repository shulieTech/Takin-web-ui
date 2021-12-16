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
    pathType: 0
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
    basePath: ''
  }
});

const RootDirectory: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const formItemProps: FormItemProps = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const handleOk = () => {
    if (props.form.getFieldValue('pathType') === '1') {
      props.form.validateFields(['username', 'passwd', 'ftpPort',
        'ftpHost', 'basePath'], async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
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
            message.success('保存成功');
            props.form.resetFields();
            props.setState({
              visible: false
            });
          }
        } else {
          const {
              data: { data, success }
            } = await configService.pathCreate({
              context: JSON.stringify(values),
              pathType: props.form.getFieldValue('pathType')
            });
          if (success) {
            message.success('保存成功');
            props.form.resetFields();
            props.setState({
              visible: false
            });
          }
        }
      });
    } else {
      props.form.validateFields(['endpoint', 'accessKeyId',
        'accessKeySecret', 'bucketName'], async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
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
            message.success('保存成功');
            props.form.resetFields();
            props.setState({
              visible: false
            });
          }
        } else {
          const {
              data: { data, success }
            } = await configService.pathCreate({
              context: JSON.stringify(values),
              pathType: props.form.getFieldValue('pathType')
            });
          if (success) {
            message.success('保存成功');
            props.form.resetFields();
            props.setState({
              visible: false
            });
          }
        }
      });
    }
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
      context: props.state.context
    });
  };

  const handleCancel = () => {
    setState({
      buDisabled: true,
    });
    props.form.resetFields();
    props.setState({
      visible: false
    });
  };

  const validateZhKey = async (rule, values, callback) => {
    const patt1 = new RegExp(/\s+/g);
    if (patt1.test(values)) {
      callback('不能有空格');
    }
    if (!values) {
      callback('值不能空');
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
        <Form.Item
          label="类型"
        >
          {props.form.getFieldDecorator('pathType', {
            initialValue: state.datas.pathType ? `${state.datas?.pathType}` : '0',
            rules: [{ required: true, message: `请输入类型` }],
          })(
            <Select placeholder="请选择类型">
              <Option value="0">oss</Option>
              <Option value="1">ftp</Option>
            </Select>
          )}
        </Form.Item>
        {
          props.form.getFieldValue('pathType') === '1' ? (
            <div>
              <Form.Item
                label="ip"
                required
              >
                {props.form.getFieldDecorator('ftpHost', {
                  rules: [
                    { validator: validateZhKey }],
                  initialValue: state.context?.ftpHost || '',
                })(
                  <Input placeholder="请输入ip" />
                )}
              </Form.Item>
              <Form.Item
                label="端口"
                required
              >
                {props.form.getFieldDecorator('ftpPort', {
                  rules: [
                    { validator: validateZhKey }],
                  initialValue: state.context?.ftpPort || '',
                })(
                  <Input placeholder="请输入端口" />
                )}
              </Form.Item>
              <Form.Item
                label="basePath"
                required
              >
                {props.form.getFieldDecorator('basePath', {
                  rules: [
                    { validator: validateZhKey }],
                  initialValue: state.context?.basePath || '',
                })(
                  <Input placeholder="请输入basePath" />
                )}
              </Form.Item>
              <Form.Item
                label="账号"
                required
              >
                {props.form.getFieldDecorator('username', {
                  rules: [
                    { validator: validateZhKey }],
                  initialValue: state.context?.username || '',
                })(
                  <Input placeholder="请输入账号" />
                )}
              </Form.Item>
              <Form.Item
                label="密码"
                required
              >
                {props.form.getFieldDecorator('passwd', {
                  rules: [
                    { validator: validateZhKey }],
                  initialValue: state.context?.passwd || '',
                })(
                  <Input placeholder="请输入密码" type="password" />
                )}
              </Form.Item>
            </div>
          ) : (
            <div>
              <Form.Item
                label="endpoint"
                required
              >
                {props.form.getFieldDecorator('endpoint', {
                  initialValue: state.context?.endpoint || '',
                  rules: [
                    { validator: validateZhKey }],
                })(
                  <Input placeholder="请输入endpoint" />
                )}
              </Form.Item>
              <Form.Item
                label="accessKeyId"
                required
              >
                {props.form.getFieldDecorator('accessKeyId', {
                  initialValue: state.context?.accessKeyId || '',
                  rules: [
                    { validator: validateZhKey }],
                })(
                  <Input placeholder="请输入accessKeyId" type="password" />
                )}
              </Form.Item>
              <Form.Item
                label="accessKeySecret"
                required
              >
                {props.form.getFieldDecorator('accessKeySecret', {
                  initialValue: state.context?.accessKeySecret || '',
                  rules: [
                    { validator: validateZhKey }],
                })(
                  <Input placeholder="请输入accessKeySecret" type="password" />
                )}
              </Form.Item>
              <Form.Item
                label="bucketName"
                required
              >
                {props.form.getFieldDecorator('bucketName', {
                  initialValue: state.context?.bucketName || '',
                  rules: [
                    { validator: validateZhKey }],
                })(
                  <Input placeholder="请输入bucketName" />
                )}
              </Form.Item>
            </div>
          )}

      </Form>
    </Modal >
  );
};
export default Form.create()(RootDirectory);
