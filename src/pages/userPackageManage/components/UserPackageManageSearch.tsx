import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getUserPackageManageFormData = (state): FormDataType[] => {
  return [
    {
      key: 'customerName',
      label: '',
      node: <Input placeholder="用户名称"/>
    },
    {
      key: 'status',
      label: '',
      node: <CommonSelect placeholder="套餐状态" dataSource={[{ label: '开通中', value: '0' }, { label: '开通成功', value: '1' }, { label: '已失效', value: '2' }, { label: '开通失败', value: '3' }]}/>
    }
  ];
};

export default getUserPackageManageFormData;
