import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getShellManageFormData = (state, setState): FormDataType[] => {
  return [
    {
      key: 'scriptName',
      label: '',
      node: <Input placeholder="脚本名称" />
    },
    {
      key: 'tags',
      label: '',
      node: (
        <CommonSelect
          placeholder="标签"
          mode="multiple"
          dataSource={state.tagList ? state.tagList : []}
          dropdownMatchSelectWidth={false}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    }
  ];
};

export default getShellManageFormData;
