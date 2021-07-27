import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';

const getShellTagFormData = (state, setState): FormDataType[] => {
  const handleChange = (value, option) => {
    setState({
      tags: value,
      tagsValue: option.map((item, k) => {
        return item.props.children;
      })
    });
  };

  const basicFormData = [
    {
      key: 'tagNames',
      label: '脚本标签',
      options: {
        initialValue: state.tags,
        rules: [
          {
            required: false,
            message: '请输入脚本标签'
          }
        ]
      },
      node: (
        <CommonSelect
          style={{ width: 250 }}
          mode="tags"
          placeholder="请输入脚本标签"
          dataSource={state.tagList}
          onChange={(value, option) => handleChange(value, option)}
        />
      )
    }
  ];
  return basicFormData;
};
export default getShellTagFormData;
