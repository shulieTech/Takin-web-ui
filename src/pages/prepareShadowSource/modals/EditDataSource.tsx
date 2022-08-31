import React, { useState, useEffect, useMemo } from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import {
  Form,
  FormItem,
  FormButtonGroup,
  createFormActions,
  FormEffectHooks,
  Submit,
  Reset,
  createAsyncFormActions,
} from '@formily/antd';
import { Input, Select, Password } from '@formily/antd-components';
import useListService from 'src/utils/useListService';
import service from '../service';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

export default (props: Props) => {
  const { detail, okCallback, cancelCallback, ...rest } = props;
  const actions = useMemo(createAsyncFormActions, []);

  const { list: middlewareList, loading: middlewareListLoading } =
    useListService({
      service: service.middlewareList,
      defaultQuery: {
        middlewareType: '连接池',
      },
    });

  const handleSubmit = async () => {
    const { values } = await actions.submit();
    const newValue = {
      ...detail,
      ...values,
    };
    // TODO 提交数据
  };

  return (
    <Modal
      title="数据源配置"
      width={700}
      visible={!!detail}
      onOk={handleSubmit}
      okText="好的"
      onCancel={cancelCallback}
      maskClosable={false}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
      }}
      destroyOnClose
      {...rest}
    >
      <Form
        actions={actions}
        initialValues={detail}
        labelCol={6}
        wrapperCol={18}
      >
        <FormItem
          name="connectionPool"
          title="中间件名称"
          component={Select}
          dataSource={middlewareList}
          props={{
            placeholder: '请选择',
            loading: middlewareListLoading,
          }}
          rules={[{ required: true, message: '请选择中间件' }]}
        />
        <FormItem
          name="url"
          title={
            <span>
              业务数据源
              <Tooltip title="示例：jdbc:mysql://192.168.1.102:3306/easydemo_db">
                <Icon
                  type="info-circle"
                  style={{ marginLeft: 4, cursor: 'pointer' }}
                />
              </Tooltip>
            </span>
          }
          component={Input}
          rules={[
            { required: true, whitespace: true, message: '请输入业务源' },
          ]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />
        <FormItem
          name="username"
          title="用户名"
          component={Input}
          rules={[
            { required: true, whitespace: true, message: '请输入用户名' },
          ]}
          props={{ maxLength: 25, placeholder: '请输入' }}
        />
        <FormItem
          name="shadowUrl"
          title="影子数据源"
          component={Input}
          rules={[
            { required: true, whitespace: true, message: '请输入影子数据源' },
          ]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />
        <FormItem
          name="shadowUserName"
          title="影子数据源用户名"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入影子数据源用户名',
            },
          ]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />
        <FormItem
          name="shadowPwd"
          title="影子数据源密码"
          component={Password}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入影子数据源密码',
            },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入',
            autoComplete: 'new-password',
          }}
        />
        <FormItem
          name="driverClassName"
          title="驱动"
          component={Input}
          rules={[{ required: true, whitespace: true, message: '请输入驱动' }]}
          props={{ maxLength: 200, placeholder: '请输入' }}
        />
        <FormItem
          name="apps"
          title="关联应用"
          component={Select}
          rules={[{ required: true, message: '请选择关联应用' }]}
          props={{ placeholder: '请选择' }}
        />
        <FormItem
          name="maxActive"
          title="maxActive"
          component={Select}
          rules={[{ required: true, message: '请选择maxActive' }]}
          props={{ placeholder: '请选择' }}
        />
        <FormItem
          name="initialSize"
          title="initialSize"
          component={Select}
          rules={[{ required: true, message: '请选择initialSize' }]}
          props={{ placeholder: '请选择' }}
        />
        <FormItem
          name="scheme"
          title="scheme"
          component={Select}
          rules={[{ required: true, message: '请选择scheme' }]}
          props={{ placeholder: '请选择' }}
        />
      </Form>
    </Modal>
  );
};
