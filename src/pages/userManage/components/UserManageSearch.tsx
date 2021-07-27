import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';

const getUserManageFormData = (): FormDataType[] => {
  return [
    {
      key: 'nick',
      label: '',
      node: <Input placeholder="客户名称" />
    }
  ];
};

export default getUserManageFormData;
