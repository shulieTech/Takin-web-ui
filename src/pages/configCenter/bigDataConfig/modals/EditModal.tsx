/**
 * @name
 * @author MingShined
 */
import { Form, InputNumber, message, Input, Radio } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { CommonModal, CommonSelect, useStateReducer } from 'racc';
import React from 'react';
import { BigDataBean } from '../enum';
import BigDataService from '../service';
interface Props {
  details?: any;
  id?: string;
  onSuccess: () => void;
  btnText: string;
  form?: any;
}
const EditModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    details: {} as any,
    disabled: false
  });

  const { details } = state;
  const handleSubmit = () => {
    return new Promise(async resolve => {
      props.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        const ajax =
          props.btnText === '新增'
            ? BigDataService.newConfig(values)
            : BigDataService.updateConfig(details);

        const {
          data: { data, success }
        } = await ajax;
        if (success) {
          message.success(`${props.btnText}成功`);
          resolve(true);
          props.onSuccess();
        }
        resolve(false);
      });
    });
  };

  const getDetails = () => {
    props.form.resetFields();
    if (props.btnText === '修改') {
      setState({ details: props.details, disabled: true });
    } else {
      setState({ details: {}, disabled: false });
    }
  };

  const onChange = () => {
    props.form.setFieldsValue({ value: '' });
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };

  return (
    <CommonModal
      onClick={getDetails}
      btnText={props.btnText}
      btnProps={{ type: props.btnText === '修改' ? 'link' : 'primary' }}
      beforeOk={handleSubmit}
      modalProps={{ title: props.btnText === '修改' ? '修改' : '新增' }}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Item label="key" required={true} {...formItemLayout}>
          {props.form.getFieldDecorator('zkPath', {
            initialValue: state.details.zkPath || '',
            rules: [{ required: true, message: '请输入key' },
            { pattern: /^\/.*/, message: 'key要以/开头' }],
          })(
            <Input disabled={state.disabled} />
          )}
        </Form.Item>
        <Form.Item label="说明" required={true} {...formItemLayout}>
          {props.form.getFieldDecorator('remark', {
            initialValue: state.details.remark || '',
            rules: [{ required: true, message: '请输入说明' }]
          })(<Input disabled={state.disabled} />)}
        </Form.Item>
        <Form.Item label="类型" required={true} {...formItemLayout}>
          {props.form.getFieldDecorator('type', {
            initialValue: state.details.type || 'Int',
            rules: [{ required: true, message: '请选择类型' }]
          })(
            <Radio.Group onChange={onChange} disabled={state.disabled}>
              <Radio.Button value="Int">Int</Radio.Button>
              <Radio.Button value="String">String</Radio.Button>
              <Radio.Button value="Boolean">Boolean</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="value" required={true} {...formItemLayout}>
          {props.form.getFieldDecorator('value', {
            initialValue: state.details.value || '',
            rules: [{ required: true, message: '请输入value' }]
          })(
            props.form.getFieldValue('type') === 'Int' ? (
              <InputNumber
                precision={0}
                min={1}
                value={details[BigDataBean.value]}
                max={1000}
                onChange={value => setState({ details: { ...details, value } })}
                placeholder="请填写"
              />
            ) : props.form.getFieldValue('type') === 'Boolean' ? (
              <CommonSelect
                placeholder="请选择"
                style={{ width: '100%' }}
                value={details[BigDataBean.value]}
                onChange={value => setState({ details: { ...details, value } })}
                dataSource={[
                  {
                    label: 'true',
                    value: true
                  },
                  {
                    label: 'false',
                    value: false
                  }
                ]}
              />
            ) : (
              <Input
                style={{ width: '100%' }}
                defaultValue={details[BigDataBean.value]}
                onChange={e => {
                  const value = e.target.value;
                  setState({ details: { ...details, value } });
                }}
              />
            )
          )}
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
export default Form.create()(EditModal);
