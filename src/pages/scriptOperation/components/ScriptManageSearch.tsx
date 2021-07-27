import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getScriptManageFormData = (state, setState): FormDataType[] => {
  return [
    {
      key: 'name',
      label: '',
      node: <Input placeholder="脚本名称" />
    },
    {
      key: 'scriptType',
      label: '',
      node: (
        <CommonSelect
          placeholder="类型"
          dataSource={state.tagList ? state.tagList : []}
          dropdownMatchSelectWidth={false}
        />
      )
    },
  ];
};

export default getScriptManageFormData;
