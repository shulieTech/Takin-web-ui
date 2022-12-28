import { Input } from 'antd';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';

const getOrderMachineFormData = (): FormDataType[] => {
  return [
    {
      key: 'nick',
      label: '',
      node: <Input placeholder="客户名称" />
    },
    {
      key: '2',
      label: '',
      node: <CommonSelect placeholder="机器状态" dataSource={[{ label: '运行中', value: '1' }, { label: '已释放', value: '2' }, { label: '释放中', value: '3' }, { label: '部署中', value: '4' }]}/>
    }
  ];
};

export default getOrderMachineFormData;