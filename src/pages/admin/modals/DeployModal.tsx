import React, { Fragment, useEffect } from 'react';
import { ImportFile, useStateReducer } from 'racc';
import {
  Modal, Card, Form, message, Icon,
  Tooltip, Input, Button, Radio, Select
} from 'antd';
import _ from 'lodash';
import { FormItemProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from '../index.less';
import agentService from '../service';

const { Option } = Select;
const { TextArea } = Input;
interface Props {
  state: any;
  setState: any;
  form: any;
}

interface State {
  uploadFiles: any;
}
const AgentVersin: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    uploadFiles: null,
  });
  const { value } = props.state;

  const handleOk = e => {
    props.form.validateFields(async (err, values) => {
      if (err) {
        message.info('请检查表单必填项');
        return;
      }
      const dataList = _.cloneDeep(props.state.deployList);
      values.key = props.state.keys;
      if (value.key) {
        const dataLists = dataList.filter(item => item.key !== value.key);
        dataLists.push(values);
        props.setState({
          deployList: dataLists,
          deployVisible: false,
          keys: props.state.keys + 1,
        });
      } else {
        dataList.push(values);
        props.setState({
          deployList: dataList,
          deployVisible: false,
          keys: props.state.keys + 1,
        });
      }

      props.form.resetFields();
    });
  };

  const handleCancel = e => {
    props.setState({
      deployVisible: false,
    });
    props.form.resetFields();
  };

  const formItemProps: FormItemProps = {
    labelCol: { span: 3 },
    wrapperCol: { span: 9 },
  };

  const validateZhKey = async (rule, values, callback) => {
    const {
      data: { data, success }
    } = await agentService.checkZhKey({
      zhKey: values
    });
    if (success) {
      if (data) {
        callback('中文名重复');
      } else {
        callback();
      }
    }
  };

  const validateEnKey = async (rule, values, callback) => {
    const {
      data: { data, success }
    } = await agentService.checkEnKey({
      enKey: values
    });
    if (success) {
      if (data) {
        callback('英文名重复');
      } else {
        callback();
      }
    }
  };

  return (
    <Modal
      title="新增探针版本"
      visible={props.state.deployVisible}
      bodyStyle={{ background: '#F5F7F9' }}
      width={1000}
      onOk={handleOk}
      style={{ top: 40 }}
      okText="确认发布"
      onCancel={handleCancel}
      destroyOnClose
    >
      <div style={{ height: '550px', overflow: 'scroll' }}>
        <Form onSubmit={handleOk} {...formItemProps}>
          <Card title="基础信息">
            <Form.Item
              label={
                <span>
                  配置项中文&nbsp;
                <Tooltip title="请输入配置项中文名">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {props.form.getFieldDecorator('zhKey', {
                initialValue: value.zhKey || '',
                rules: [
                  { required: true, message: `请输入配置项中文名` },
                  { validator: validateZhKey }],
              })(
                <Input placeholder="配置项中文名" />
              )}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  配置项英文&nbsp;
                <Tooltip title="请输入配置项英文名，与探针代码保持一致">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {props.form.getFieldDecorator('enKey', {
                initialValue: value.enKey || '',
                rules: [{ required: true, message: `请输入配置项英文名` },
                { validator: validateEnKey }],
              })(
                <Input placeholder="配置项英文名" />
              )}
            </Form.Item>
            <Form.Item
              label="配置项描述"
            >
              {props.form.getFieldDecorator('desc', {
                initialValue: value.desc || '',
                rules: [{ required: true, message: `请输入配置项描述，200字以内` }],
              })(
                <TextArea rows={4} placeholder="请输入配置项描述，200字以内" maxLength={200} />
              )}
            </Form.Item>
          </Card>
          <div style={{ marginTop: 20 }} />
          <Card title="配置详情">
            <Form.Item
              label="最低生效版本"
            >
              {props.form.getFieldDecorator('version', {
                initialValue: value.version || props.state.version,
                rules: [{ required: true, message: `请输入最低生效版本` }],
              })(
                <Input placeholder="最低生效版本" disabled />
              )}
            </Form.Item>
            <Form.Item
              label="配置类型"
            >
              {props.form.getFieldDecorator('effectType', {
                initialValue: value.effectType || '0',
                rules: [{ required: true, message: `请选择配置类型` }],
              })(
                <Radio.Group>
                  <Radio value="0">探针配置</Radio>
                  <Radio value="1">Agent配置</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item
              label="生效触发机制"
            >
              {props.form.getFieldDecorator('effectMechanism', {
                initialValue: value.effectMechanism || '0',
                rules: [{ required: true, message: `请选择生效触发机制` }],
              })(
                <Radio.Group>
                  <Radio value="0">重启生效</Radio>
                  <Radio value="1">即时生效</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item
              label="值类型"
            >
              {props.form.getFieldDecorator('valueType', {
                initialValue: value.valueType || '0',
                rules: [{ required: true, message: `请选择值类型` }],
              })(
                <Select placeholder="请选择值类型">
                  <Option value="1">单选</Option>
                  <Option value="0">文本</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
              label="可选值"
              style={{
                display: props.form.getFieldValue('valueType') === '1' ? 'block' : 'none'
              }}
            >
              {props.form.getFieldDecorator('valueOptionList', {
                initialValue: value.valueOptionList || [],
                rules: [{ required: false, message: `请选择可选值` }],
              })(
                <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
              )}
            </Form.Item>
            <Form.Item
              label="默认值"
            >
              {props.form.getFieldDecorator('defaultValue', {
                initialValue: value.defaultValue || '',
                rules: [{ required: true, message: `请输入默认值` }],
              })(
                <Input placeholder="默认值" />
              )}
            </Form.Item>
            <Form.Item
              label="是否可编辑"
            >
              {props.form.getFieldDecorator('editable', {
                initialValue: value.editable || '0',
                rules: [{ required: true, message: `请选择是否可编辑` }],
              })(
                <Radio.Group>
                  <Radio value="0">是</Radio>
                  <Radio value="1">否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Card>
        </Form>
      </div>
    </Modal>
  );
};
export default Form.create()(AgentVersin);
