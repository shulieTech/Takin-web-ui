import React, { Fragment } from 'react';

import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import { CommonSelect } from 'racc';

const getEntryRuleFormData = (
  state,
  action,
  setState,
  dictionaryMap
): FormDataType[] => {
  const { EntryRuleDetail, allAppList } = state;

  const basicFormData = [
    {
      key: 'applicationName',
      label: '应用',
      options: {
        initialValue:
          action !== 'add'
            ? EntryRuleDetail && EntryRuleDetail.applicationName
            : undefined,
        rules: [
          {
            required: true,
            message: '请选择应用'
          }
        ]
      },
      node: (
        <CommonSelect
          showSearch
          placeholder="请选择"
          showSearch
          dataSource={allAppList ? allAppList : []}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    },
    {
      key: 'api',
      label: '入口地址',
      options: {
        initialValue:
          action !== 'add' ? EntryRuleDetail && EntryRuleDetail.api : undefined,
        rules: [
          {
            required: true,
            message: '请输入入口地址'
          }
        ]
      },
      node: <Input placeholder="请输入" />
    },
    {
      key: 'method',
      label: '请求类型',
      options: {
        initialValue:
          action !== 'add'
            ? EntryRuleDetail && EntryRuleDetail.requestMethod
            : undefined,
        rules: [
          {
            required: true,
            message: '请选择请求类型'
          }
        ]
      },
      node: (
        <CommonSelect
          dataSource={
            dictionaryMap && dictionaryMap.HTTP_METHOD_TYPE
              ? dictionaryMap.HTTP_METHOD_TYPE
              : []
          }
        />
      )
    }
  ];
  return basicFormData;
};
export default getEntryRuleFormData;
