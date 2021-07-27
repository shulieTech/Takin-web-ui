import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';

const getFormData = (): FormDataType[] => {
  return [
    {
      key: 'demo',
      label: '',
      node: <Input placeholder="demo" />
    }
  ];
};

export default getFormData;
