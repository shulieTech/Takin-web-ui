import React, { useMemo } from 'react';
import { Modal, message } from 'antd';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
} from '@formily/antd';
import { Input } from '@formily/antd-components';
import service from '../components/service';

type IEnv = {
  envName?: string;
  envCode?: string;
  isDefault?: boolean;
  desc?: string;
  securityCenterDomain?: string;
};

interface Props {
  envList: IEnv[];
  detail: IEnv;
  okCallback: (data: any) => void;
  cancelCallback: () => void;
}

const EnvEditModal: React.FC<Props> = (props) => {
  const { envList = [], detail = {}, okCallback, cancelCallback } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const isEdit = !!detail?.envCode;

  const handleOk = async () => {
    const { values } = await actions.submit();
    const {
      data: { data, success },
    } = await service.addEnv({
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
            {
              validator: (val) => {
                if (isEdit) {
                  // 编辑时，不能和其他环境重名
                  if (
                    envList
                      .filter((x) => x.envCode !== detail.envCode)
                      .some((x) => x.envName === val)
                  ) {
                    return '环境名称已存在';
                  }
                  return true;
                } 
                // 新增时，不能和所有环境重名
                if (envList.some((x) => x.envName === val)) {
                  return '环境名称已存在';
                }
                return true;
                
              },
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
            disabled: isEdit,
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
            },
            {
              validator: (val) => {
                if (isEdit) {
                  // 编辑时，不能和其他环境重名
                  if (
                    envList
                      .filter((x) => x.envCode !== detail.envCode)
                      .some((x) => x.envCode === val)
                  ) {
                    return '环境code已存在';
                  }
                  return true;
                } 
                // 新增时，不能和所有环境重名
                if (envList.some((x) => x.envCode === val)) {
                  return '环境code已存在';
                }
                return true;
                
              },
            },
          ]}
          required
        />
      </SchemaForm>
    </Modal>
  );
};

export default EnvEditModal;
