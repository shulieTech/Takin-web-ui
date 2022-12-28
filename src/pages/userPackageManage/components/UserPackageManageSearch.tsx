import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getUserPackageManageFormData = (): FormDataType[] => {
  return [
    {
      key: 'nick',
      label: '',
      node: <Input placeholder="客户名称" />
    },
    {
      key: '2',
      label: '',
      node: <CommonSelect placeholder="套餐状态" dataSource={[{ label: '开通成功', value: '1' }, { label: '开通中', value: '2' }, { label: '已过期', value: '3' }, { label: '开通失败', value: '4' }]}/>
    }
  ];
};

export default getUserPackageManageFormData;
