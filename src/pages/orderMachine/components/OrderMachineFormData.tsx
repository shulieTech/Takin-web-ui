import { DatePicker, Input, InputNumber, Radio } from 'antd';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment } from 'react';

const getOrderMachineFormData = (state, action, setState): FormDataType[] => {
  const { MonthPicker } = DatePicker;

  const basicFormData = [
    {
      key: 'nick',
      label: '租户名称',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择租户'
          }
        ]
      },
      node: <CommonSelect placeholder="请选择租户" dataSource={[]}/>
    },
    {
      key: 'package',
      label: '套餐名称',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择套餐'
          }
        ]
      },
      node: <CommonSelect  placeholder="请选择套餐" dataSource={[{ label: '按次', value: '1' }, { label: '按月', value: '2' }]}/>
    },
    {
      key: '2',
      label: '资源池',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择资源池'
          }
        ]
      },
      node: <CommonSelect  placeholder="请选择资源池" dataSource={[]}/>
    },
    {
      key: '2',
      label: '可用区',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择可用区'
          }
        ]
      },
      node: <CommonSelect  placeholder="请选择可用区" dataSource={[]}/>
    },
    {
      key: '2',
      label: '机器id',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入机器id'
          }
        ]
      },
      node: <Input  placeholder="请输入机器id" />
    },
    {
      key: '2',
      label: '机器名称',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入机器名称'
          }
        ]
      },
      node: <Input  placeholder="请输入机器名称" />
    },
    {
      key: '2',
      label: '公网IP',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入公网IP'
          }
        ]
      },
      node: <Input  placeholder="请输入公网IP" />
    },
    {
      key: '2',
      label: '内网IP',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入内网IP'
          }
        ]
      },
      node: <Input  placeholder="请输入内网IP" />
    },
    {
      key: '2',
      label: 'CPU',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入CPU'
          }
        ]
      },
      node: <Input  placeholder="请输入CPU" />
    },
    {
      key: '2',
      label: '内存',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入内存'
          }
        ]
      },
      node: <Input  placeholder="请输入内存" />
    },
    {
      key: '2',
      label: '宽带',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入宽带'
          }
        ]
      },
      node: <Input  placeholder="请输入宽带" />
    },
    {
      key: '2',
      label: '订购时间',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择订购时间'
          }
        ]
      },
      node: <Input  placeholder="请选择订购时间" />
    },
    {
      key: '2',
      label: '订购时长/月',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入订购时长'
          }
        ]
      },
      node: <InputNumber  placeholder="请输入订购时长" />
    },
    {
      key: '2',
      label: '到期时间',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择到期时间'
          }
        ]
      },
      node: <Input  placeholder="请选择到期时间" />
    },
    {
      key: '2',
      label: '登录账户',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入登录账户'
          }
        ]
      },
      node: <Input  placeholder="请输入登录账户" />
    }, 
    {
      key: '2',
      label: '登录密码',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入登录密码'
          }
        ]
      },
      node: <Input  placeholder="请输入登录密码" />
    },
  ];

  return basicFormData;
};
export default getOrderMachineFormData;
