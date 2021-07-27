/**
 * @name
 * @author MingShined
 */
import { Form, InputNumber, message, Input } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { CommonModal, CommonSelect, useStateReducer } from 'racc';
import React from 'react';
import { BigDataBean } from '../enum';
import BigDataService from '../service';
interface Props {
  details: any;
  id: string;
  onSuccess: () => void;
}
const EditModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    details: {} as any
  });
  const { details } = state;
  const handleSubmit = () => {
    return new Promise(async resolve => {
      if (!details[BigDataBean.value]) {
        message.info('请检查表单必填项');
        resolve(false);
        return;
      }
      const {
        data: { data, success }
      } = await BigDataService.updateConfig(details);
      if (success) {
        message.success('修改成功');
        resolve(true);
        props.onSuccess();
      }
      resolve(false);
    });
  };
  const formItemProps: FormItemProps = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15 },
    style: { marginBottom: 8 }
  };

  return (
    <CommonModal
      onClick={() => setState({ details: props.details })}
      btnText="修改"
      btnProps={{ type: 'link' }}
      beforeOk={handleSubmit}
      modalProps={{ title: '修改' }}
    >
      <Form.Item label="key" {...formItemProps}>
        {details[BigDataBean.key]}
      </Form.Item>
      <Form.Item label="说明" {...formItemProps}>
        {details[BigDataBean.说明]}
      </Form.Item>
      <Form.Item label="value" required={true} {...formItemProps}>
        {details.type === 'Int' ? (
          <InputNumber
            precision={0}
            min={1}
            value={details[BigDataBean.value]}
            max={1000}
            onChange={value =>
              setState({ details: { ...details, value } })
            }
            placeholder="请填写"
          />
        ) : details.type === 'Boolean' ? (
          <CommonSelect
            placeholder="请选择"
            style={{ width: '100%' }}
            value={details[BigDataBean.value]}
            onChange={value =>
              setState({ details: { ...details, value } })
            }
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
        )}
      </Form.Item>
    </CommonModal>
  );
};
export default EditModal;
