import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';
import { ConfigErrorListState } from './ConfigErrorList';

const getConfigErrorListFormData = (
  state: ConfigErrorListState
): FormDataType[] => {
  const { selectData } = state;
  return [
    {
      key: 'appName',
      label: '',
      node: (
        <CommonSelect
          placeholder="应用：全部"
          dataSource={
            (selectData &&
              selectData.apps &&
              selectData.apps.map((item, k) => {
                return { label: item, value: item };
              })) ||
            []
          }
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
      key: 'type',
      label: '',
      node: (
        <CommonSelect
          placeholder="异常类型：全部"
          dataSource={
            (selectData &&
              selectData.types &&
              selectData.types.map((item, k) => {
                return { label: item, value: item };
              })) ||
            []
          }
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
      key: 'code',
      label: '',
      node: (
        <CommonSelect
          placeholder="异常编码：全部"
          dataSource={
            (selectData &&
              selectData.codes &&
              selectData.codes.map((item, k) => {
                return { label: item, value: item };
              })) ||
            []
          }
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

export default getConfigErrorListFormData;
