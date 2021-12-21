import React, { Fragment, useEffect } from 'react';
import { ImportFile, useStateReducer } from 'racc';
import {
  Modal, Card, Form, Input, Select, message
} from 'antd';
import styles from '../index.less';
import configService from '../service';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  state: any;
  setState: any;
  form: any;
}

interface State {
  uploadFiles: any;
  allKeyList: any;
}
const AgentVersin: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    uploadFiles: null,
    allKeyList: []
  });

  useEffect(() => {
    allKey();
    props.form.resetFields();
  }, [props.state.versinVisible]);

  const allKey = async () => {
    if (props.state.row.id) {
      const {
        data: { data, success }
      } = await configService.allKey({
        id: props.state.row.id
      });
      if (success) {
        setState({
          allKeyList: data,
        });
      }
    }
  };

  const onSubmit = () => {
    props.form.validateFields(async (err, values) => {
      if (err) {
        message.info('请检查表单必填项');
        return;
      }
      let result = {};
      if (props.state.row.type !== 0) {
        result = {
          id: props.state.row.id,
          defaultValue: values.defaultValue.toString()
        };
      } else {
        result = {
          id: props.state.row.id,
          defaultValue: values.defaultValue.toString(),
          projectName: props.state.projectName
        };
      }
      const {
        data: { data, success }
      } = await configService.update({ ...result });
      if (success) {
        props.setState({
          versinVisible: false,
          row: {}
        });
      }
    });
  };

  const handleCancel = e => {
    props.setState({
      versinVisible: false,
      row: {}
    });
  };

  const { row } = props.state;

  return (
    <Modal
      title="编辑配置"
      visible={props.state.versinVisible}
      style={{ top: 40 }}
      width={600}
      onOk={onSubmit}
      okText="确认编辑"
      onCancel={handleCancel}
    >
      <div>
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item
            label="配置项中文名"
          >
            {props.form.getFieldDecorator('zhKey', {
              initialValue: row.zhKey || '',
              rules: [{ required: true, whitespace: true, message: `请输入配置项中文名` }],
            })(
              <Input placeholder="配置项中文名" disabled />
            )}
          </Form.Item>
          <Form.Item
            label="值类型"
          >
            {props.form.getFieldDecorator('valueType', {
              initialValue: row.valueType === 0 ? '文本' : '单选',
              rules: [{ required: true, whitespace: true, message: `请输入值类型` }],
            })(
              <Input placeholder="值类型" disabled />
            )}
          </Form.Item>
          <Form.Item
            label="配置值"
          >
            {
              row.valueType === 0 ? (
                props.form.getFieldDecorator('defaultValue', {
                  initialValue: row.defaultValue || '',
                  rules: [{ required: true, whitespace: true, message: `请输入配置值` }],
                })(
                  <Input placeholder="配置值" />
                )
              ) : (
                props.form.getFieldDecorator('defaultValue', {
                  initialValue: row.defaultValue || [],
                  rules: [{ required: true, message: `请输入配置值` }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="配置值"
                  >
                    {
                      state.allKeyList && state.allKeyList.map(ite => {
                        return (
                          <option value={ite} key={ite}>{ite}</option>
                        );
                      })
                    }
                  </Select>
                )
              )
            }
          </Form.Item>
          <Form.Item
            label="配置描述"
          >
            {props.form.getFieldDecorator('name', {
              initialValue: row.desc || '',
              rules: [{ required: true, whitespace: true, message: `请输入配置描述` }],
            })(
              <TextArea placeholder="配置描述" rows={4} disabled />
            )}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
export default Form.create()(AgentVersin);
