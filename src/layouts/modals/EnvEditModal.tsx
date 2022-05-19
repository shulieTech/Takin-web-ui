import React, { useMemo } from 'react';
import { Modal, message } from 'antd';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
} from '@formily/antd';
import { Input } from '@formily/antd-components';
import service from '../components/service';

interface Props {
  detail: any;
  okCallback: (data: any) => void;
  cancelCallback: () => void;
}

const EnvEditModal: React.FC<Props> = (props) => {
  const { detail = {}, okCallback, cancelCallback } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const isEdit = !!detail?.envCode;

  const handleOk = async () => {
    const { values } = await actions.submit();
    const {
      data: { data, success },
    } = await service[isEdit ? 'updateEnv' : 'addEnv']({
      ...values,
      ...detail,
    });
    if (success) {
      okCallback(data);
      return Promise.resolve();
    }
  };

  return (
    <Modal
      visible
      title={`${isEdit ? '编辑' : '新增'}环境`}
      onOk={handleOk}
      onCancel={cancelCallback}
    >
      <SchemaForm
        actions={actions}
        components={{
          Input,
        }}
        initialValues={detail}
        labelCol={6}
        wrapperCol={18}
      >
        <Field
          title="环境名称"
          name="envName"
          x-component="Input"
          x-component-props={{
            placeholder: '请输入',
            maxLength: 20,
          }}
          x-rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入环境名称',
            },
          ]}
          required
        />
        <Field
          title="环境英文名"
          name="envCode"
          x-component="Input"
          x-component-props={{
            placeholder: '请输入',
            maxLength: 20,
          }}
          x-rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入环境英文名',
            },
            {
              pattern: /^[a-zA-Z]+$/i,
              message: '只能输入英文字母',
            }
          ]}
          required
        />
      </SchemaForm>

    </Modal>
  );
};

export default EnvEditModal;
