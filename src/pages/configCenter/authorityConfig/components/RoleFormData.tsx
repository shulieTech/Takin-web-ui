import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';

const getRoleFormData = (state, setState): FormDataType[] => {
  const handleChange = value => {
    setState({
      tags: value
    });
  };

  const basicFormData = [
    {
      key: 'roleIds',
      label: '账号角色',
      options: {
        initialValue: state.roles,
        rules: [
          {
            required: false,
            message: '请选择账号角色'
          }
        ]
      },
      node: (
        <CommonSelect
          mode="multiple"
          showSearch={true}
          style={{ width: 250 }}
          placeholder="请选择角色，最多10个"
          dataSource={state.roleList}
          onChange={handleChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    }
  ];
  return basicFormData;
};
export default getRoleFormData;
