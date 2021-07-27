import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';

const getRoleManageFormData = (state, setState, action): FormDataType[] => {
  const basicFormData = [
    {
      key: 'roleName',
      label: '名称',
      options: {
        initialValue:
          action === 'edit'
            ? state.roleDetail && state.roleDetail.roleName
            : undefined,
        rules: [
          {
            required: true,
            message: '请输入正确角色名称',
            max: 20
          }
        ]
      },
      node: <Input placeholder="请输入角色名称，不超过20字" />
    },
    {
      key: 'roleDesc',
      label: '角色描述',
      options: {
        initialValue:
          action === 'edit'
            ? state.roleDetail && state.roleDetail.roleDesc
            : undefined,
        rules: [
          {
            required: true,
            message: '请输入正确的角色描述',
            max: 200
          }
        ]
      },
      node: <Input.TextArea placeholder="请输入角色描述，不超过200字" />
    }
  ];
  return basicFormData;
};
export default getRoleManageFormData;
