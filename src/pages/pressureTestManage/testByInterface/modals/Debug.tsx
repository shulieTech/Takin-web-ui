import React, { useMemo } from 'react';
import { Modal, message } from 'antd';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
} from '@formily/antd';
import { Select } from '@formily/antd-components';
import service from '../service';

interface Props {
  details: any;
  okCallback: (data: any) => void;
  cancelCallback: () => void;
}

const DebugModal: React.FC<Props> = (props) => {
  const { details, okCallback, cancelCallback } = props;

  const actions = useMemo(() => createAsyncFormActions(), []);
  const startDebug = async () => {
    const { values } = await actions.submit();
    const {
      data: { data, success },
    } = await service.debugSence({
      ...values,
      ...details,
    });
    if (success) {
      okCallback(data);
      return Promise.resolve();
    }
  };

  return (
    <Modal
      visible
      title="脚本调试"
      onOk={startDebug}
      onCancel={cancelCallback}
      okText="开始调试"
      width={640}
    >
      <div
        style={{
          padding: 12,
          backgroundColor: 'var(--BrandPrimary-50, #F5FFFE)',
          border: '1px solid var(--BrandPrimary-100, #E4FBF9)',
          borderRadius: 4,
          color: 'var(--Netural-12, #666)',
        }}
      >
        <span
          className="iconfont icon-jinggao-3"
          style={{
            color: '#00D0C5',
            fontSize: 20,
            marginRight: 12,
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        />
        调试阶段建议选择小并发数，确保并发数在系统可承受范围内
      </div>
      <SchemaForm
        actions={actions}
        components={{
          Select,
        }}
      >
        <Field
          title="请求条数"
          name="requestNum"
          x-component="Select"
          x-component-props={{
            placeholder: '请选择请求条数',
            style: {
              width: 240,
            },
          }}
          x-rules={[
            {
              required: true,
              message: '请选择请求条数',
            },
          ]}
          enum={[1, 10, 100, 1000, 10000]}
          required
          default={1}
        />
        <Field
          title="并发数"
          name="concurrencyNum"
          x-component="Select"
          x-component-props={{
            placeholder: '请选择并发数',
            style: {
              width: 240,
            },
          }}
          x-rules={[
            {
              required: true,
              message: '请选择并发数',
            },
          ]}
          enum={[1, 5, 10, 20, 50, 100]}
          required
          default={1}
        />
      </SchemaForm>
    </Modal>
  );
};

export default DebugModal;
