import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';

const getAppTrialManageFormData = (): FormDataType[] => {
  return [
    {
      key: 'name',
      label: '',
      node: <Input placeholder="应用名称" />
    }
  ];
};

export default getAppTrialManageFormData;
