import { Input } from 'antd';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';

const getFormData = (state, setState): FormDataType[] => {
  return [
    { key: 'activityName', label: '', node: <Input placeholder="业务活动名称" /> },
    // { key: 'entrance', label: '', node: <Input placeholder="入口" /> },
    // {
    //   key: 'middleWareArr',
    //   label: '',
    //   node: (
    //     <Cascader
    //       options={state.middlewareCascade ? state.middlewareCascade : []}
    //       changeOnSelect
    //       placeholder="中间件/中间件版本"
    //       showSearch={{ filter: filterCascaderOptions }}
    //     />
    //   )
    // }
  ];
};

export default getFormData;
