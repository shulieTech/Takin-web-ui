import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getAppWhiteListFormData = (): FormDataType[] => {
  return [
    {
      key: 'appName',
      label: '',
      node: <Input placeholder="应用名称" />
    },
    {
      key: 'interfaceName',
      label: '',
      node: <Input placeholder="接口名称" />
    }
  ];
};

export default getAppWhiteListFormData;
