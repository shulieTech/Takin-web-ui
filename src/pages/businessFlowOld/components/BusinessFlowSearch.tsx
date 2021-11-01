import { FormDataType } from 'racc/dist/common-form/type';
import { Input, Cascader } from 'antd';
import React from 'react';
import { filterCascaderOptions } from 'src/utils/utils';

const getFormData = (state): FormDataType[] => {
  return [
    {
      key: 'sceneName',
      label: '',
      node: <Input placeholder="业务流程名称" />
    },
    {
      key: 'businessName',
      label: '',
      node: <Input placeholder="业务活动名称" />
    },
    {
      key: 'entrance',
      label: '',
      node: <Input placeholder="入口" />
    },
    {
      key: 'middleWareArr',
      label: '',
      node: (
        <Cascader
          options={state.middlewareCascade ? state.middlewareCascade : []}
          changeOnSelect
          placeholder="中间件/中间件版本"
          showSearch={{ filter: filterCascaderOptions }}
        />
      )
    }
  ];
};

export default getFormData;
