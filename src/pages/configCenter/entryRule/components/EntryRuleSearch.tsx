import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';

const EntryRuleSearch = (state, dictionaryMap): FormDataType[] => {
  return [
    {
      key: 'applicationName',
      label: '',
      node: <Input placeholder="应用名称" />
    },
    {
      key: 'api',
      label: '',
      node: <Input placeholder="入口地址" />
    }
  ];
};

export default EntryRuleSearch;
