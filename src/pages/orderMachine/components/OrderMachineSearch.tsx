import { Input } from 'antd';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';

const getOrderMachineFormData = (): FormDataType[] => {
  return [
    {
      key: 'customerName',
      label: '',
      node: <Input placeholder="客户名称" />
    },
    {
      key: 'status',
      label: '',
      node: <CommonSelect placeholder="机器状态" dataSource={[{ label: '订购成功', value: '0' }, { label: '部署中', value: '1' }, { label: '运行中', value: '2' }, { label: '已释放', value: '3' }]}/>
    }
  ];
};

export default getOrderMachineFormData;