import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getScriptManageFormData = (state, setState): FormDataType[] => {
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
    },
    {
      key: 'businessActivity',
      label: '',
      node: (
        <CommonSelect
          placeholder="业务活动"
          dataSource={
            state.businessActivityList ? state.businessActivityList : []
          }
          // dropdownMatchSelectWidth={false}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    },
    {
      key: 'businessFlow',
      label: '',
      node: (
        <CommonSelect
          placeholder="业务流程"
          dataSource={state.businessFlowList ? state.businessFlowList : []}
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

export default getScriptManageFormData;
