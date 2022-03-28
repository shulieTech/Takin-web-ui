import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
} from '@formily/antd';
import { Input, Select, FormBlock } from '@formily/antd-components';
import { message, Modal } from 'antd';
import configService from '../service';
import styles from '../index.less';

interface Props {
  visible: boolean;
  state: any;
  setState: any;
}

const RootDirectoryModal: React.FC<Props> = (props) => {
  const { state, setState } = props;
  const configs =
    typeof state.datas.context === 'string'
      ? {
        pathType: state.datas.pathType,
        ...JSON.parse(state.datas.context),
      }
      : {};
  const actions = useMemo(() => createAsyncFormActions(), []);

  const handleCancel = () => {
    setState({
      visible: false,
    });
  };

  const handleOk = () => {
    actions.submit(async ({ pathType, ...values }) => {
      const {
        data: { success },
      } = await configService?.[state.datas.id ? 'pathUpdate' : 'pathCreate']({
        pathType,
        id: state.datas.id,
        context: JSON.stringify(values),
      });
      if (success) {
        message.success('保存成功');
        handleCancel();
      }
    });
  };

  return (
    <Modal
      title="探针根目录编辑"
      visible={state.visible}
      onCancel={handleCancel}
      width={700}
      okText="确认编辑"
      onOk={handleOk}
      okButtonProps={{
        disabled: state.buDisabled,
      }}
    >
      <SchemaForm
        actions={actions}
        initialValues={configs}
        validateFirst
        labelCol={5}
        wrapperCol={15}
        components={{
          Input,
          Select,
          FormBlock,
        }}
      >
        <Field
          name="pathType"
          title="类型"
          x-component="Select"
          x-component-props={{
            placeholder: '请选择',
          }}
          enum={[
            { label: 'oss', value: '0' },
            { label: 'ftp', value: '1' },
            { label: 'swift', value: '2' },
          ]}
          default="0"
          required
          x-linkages={[
            {
              type: 'value:visible',
              target: '.ossCfg',
              condition: '{{ $self.value === "0" }}',
            },
            {
              type: 'value:visible',
              target: '.ftpCfg',
              condition: '{{ $self.value === "1" }}',
            },
            {
              type: 'value:visible',
              target: '.swiftCfg',
              condition: '{{ $self.value === "2" }}',
            },
          ]}
        />
        <Field
          x-component="Block"
          type="object"
          name="ossCfg"
          x-component-props={{
            className: styles['form-block'],
          }}
        >
          <Field
            name="endpoint"
            title="endpoint"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入endpoint' },
            ]}
          />
          <Field
            name="accessKeyId"
            title="accessKeyId"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入accessKeyId',
              },
            ]}
          />
          <Field
            name="accessKeySecret"
            title="accessKeySecret"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入accessKeySecret',
              },
            ]}
          />
          <Field
            name="bucketName"
            title="bucketName"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入bucketName' },
            ]}
          />
        </Field>
        <Field
          x-component="Block"
          type="object"
          name="ftpCfg"
          x-component-props={{
            className: styles['form-block'],
          }}
        >
          <Field
            name="ftpHost"
            title="ip"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入ip' },
            ]}
          />
          <Field
            name="ftpPort"
            title="端口"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入端口' },
            ]}
          />
          <Field
            name="basePath"
            title="basePath"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入basePath',
              },
            ]}
          />
          <Field
            name="username"
            title="账号"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入账号' },
            ]}
          />
          <Field
            name="passwd"
            title="密码"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入密码' },
            ]}
          />
        </Field>
        <Field
          x-component="Block"
          type="object"
          name="swiftCfg"
          x-component-props={{
            className: styles['form-block'],
          }}
        >
          <Field
            name="swiftType"
            title="连接方式"
            x-component="Select"
            x-component-props={{
              placeholder: '请选择',
            }}
            x-rules={[{ required: true, message: '请选择连接方式' }]}
            enum={[
              { label: '用户名', value: 1 },
              { label: 'ak', value: 2 },
            ]}
            default={1}
            x-linkages={[
              {
                type: 'value:visible',
                target: '.swiftCfg.username',
                condition: '{{ $self.value === 1 }}',
              },
              {
                type: 'value:visible',
                target: '.swiftCfg.userKey',
                condition: '{{ $self.value === 1 }}',
              },
              {
                type: 'value:visible',
                target: '.swiftCfg.ak',
                condition: '{{ $self.value === 2 }}',
              },
            ]}
          />
          <Field
            name="username"
            title="username"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入username' },
            ]}
          />
          <Field
            name="userKey"
            title="userKey"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入userKey',
              },
            ]}
          />
          <Field
            name="account"
            title="account"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入account' },
            ]}
          />
          <Field
            name="ak"
            title="ak"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入ak' },
            ]}
          />
          <Field
            name="url"
            title="url"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入url' },
            ]}
          />
          <Field
            name="container"
            title="container"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入',
            }}
            x-rules={[
              { required: true, whitespace: true, message: '请输入container' },
            ]}
          />
        </Field>
      </SchemaForm>
    </Modal>
  );
};

export default RootDirectoryModal;
