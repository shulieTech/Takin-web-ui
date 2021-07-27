import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';

const BlacklistSearch = (state, dictionaryMap): FormDataType[] => {
  return [
    {
      key: 'redisKey',
      label: '',
      node: <Input placeholder="redis key" />
    }
  ];
};

export default BlacklistSearch;
