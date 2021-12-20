import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getDataSourceConfigFormData = (state, dictionaryMap): FormDataType[] => {
  const { VERIFY_DATASOURCE_TYPE } = dictionaryMap;
  // console.log(dictionaryMap);
  return [
    {
      key: 'datasourceName',
      label: '',
      node: <Input placeholder="数据源名称" />
    },
    {
      key: 'jdbcUrl',
      label: '',
      node: <Input placeholder="数据源地址" />
    },
    {
      key: 'type',
      label: '',
      node: (
        <CommonSelect
          placeholder="数据库类型"
          dataSource={
            (dictionaryMap && dictionaryMap.VERIFY_DATASOURCE_TYPE) || []
          }
        />
      )
    },
    {
      key: 'tagsIdList',
      label: '',
      node: (
        <CommonSelect
          placeholder="标签：全部"
          dataSource={state.tagList || []}
          mode="multiple"
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    }
  ];
};

export default getDataSourceConfigFormData;
