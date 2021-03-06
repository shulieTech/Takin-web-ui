import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Input } from 'antd';

const getUserFormData = (state, action, setState): FormDataType[] => {
  const { userDetail } = state;

  const basicFormData = [
    {
      key: 'nick',
      label: '客户名称',
      options: {
        initialValue:
          action !== 'add' ? userDetail && userDetail.nick : undefined,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入客户名称'
          }
        ]
      },
      node: <Input placeholder="请输入" />
    },
    {
      key: 'name',
      label: '账号',
      options: {
        initialValue:
          action !== 'add' ? userDetail && userDetail.name : undefined,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入账号'
          }
        ]
      },
      node: <Input placeholder="请输入" />
    },
    {
      key: 'password',
      label: '密码',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: action !== 'add' ? false : true,
            message: '请输入密码'
          }
        ]
      },
      node: <Input placeholder="请输入" />
    },
    {
      key: 'status',
      label: '状态',
      options: {
        initialValue:
          action !== 'add' ? userDetail && userDetail.status : undefined,
        rules: [
          {
            required: true,
            message: '请选择状态'
          }
        ]
      },
      node: (
        <CommonSelect
          dataSource={[
            { label: '正常', value: 0 },
            { label: '禁用', value: 1 }
          ]}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    },
    {
      key: 'model',
      label: '使用模式',
      options: {
        initialValue:
          action !== 'add' ? userDetail && userDetail.model : undefined,
        rules: [
          {
            required: true,
            message: '请选择使用模式'
          }
        ]
      },
      node: (
        <CommonSelect
          dataSource={[
            { label: '体验模式', value: 0 },
            { label: '正式模式', value: 1 }
          ]}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    }
  ];
  return basicFormData;
};
export default getUserFormData;
