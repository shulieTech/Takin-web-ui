import { DatePicker, Input, InputNumber, Radio } from 'antd';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment } from 'react';
import OrderMachineService from '../service';

const getOrderMachineFormData = (state, action, setState): FormDataType[] => {

  const handleChangePool = (value) => {
    queryRegionList(value);
  };

  /**
   * @name 获取可用区列表
   */
  const queryRegionList = async (value) => {
    const {
              data: { data, success }
            } = await OrderMachineService.queryRegion({ poolId: value });
    if (success) {
      setState({
        regionList: data
      });
    }
  };

  const basicFormData = [
    {
      key: 'tenantId',
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
      // tslint:disable-next-line:block-spacing
      node: <CommonSelect placeholder="请选择租户" dataSource={state?.tenantList?.map((item) => {return { label: item?.tenantName, value: item?.tenantId }; })}/>
    },
    {
      key: 'packageId',
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
      // tslint:disable-next-line:block-spacing
      node: <CommonSelect placeholder="请选择套餐" dataSource={state?.userPackageList?.map((item) => {return { label: item?.packageName, value: item?.packageId }; })}/>
    },
    {
      key: 'pool',
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
      // tslint:disable-next-line:block-spacing
      node: <CommonSelect  onChange={handleChangePool}  placeholder="请选择资源池" dataSource={state?.resourcePoolList?.map((item) => {return { label: item?.poolName, value: item?.poolId }; })}/>
    },
    {
      key: 'region',
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
      // tslint:disable-next-line:block-spacing
      node: <CommonSelect  placeholder="请选择可用区" dataSource={state?.regionList?.map((item) => {return { label: item?.name, value: item?.region }; })}/>
    },
    {
      key: 'machineId',
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
      key: 'machineName',
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
      key: 'ipPublic',
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
      key: 'ipPrivate',
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
      key: 'cpu',
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
      key: 'ram',
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
      key: 'bandwidth',
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
      key: 'startTime',
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
      node: <DatePicker showTime placeholder="请选择订购时间" />
    },
    {
      key: 'duration',
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
      node: <InputNumber  placeholder="请输入订购时长" min={1}/>
    },
    {
      key: 'endTime',
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
      node: <DatePicker showTime placeholder="请选择订购时间" />
    },
    {
      key: 'userName',
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
      key: 'password',
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
