import { Input } from 'antd';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';

const getFailOrderFormData = (): FormDataType[] => {
  return [
    {
      key: 'nick',
      label: '',
      node: <Input placeholder="客户名称" />
    },
    {
      key: '2',
      label: '',
      node: <CommonSelect placeholder="当前状态" dataSource={[{ label: '已处理', value: '1' }, { label: '未处理', value: '2' }]}/>
    }
  ];
};

export default getFailOrderFormData;