import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';

const getScriptTagFormData = (state, setState): FormDataType[] => {
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
      label: '场景标签',
      options: {
        initialValue: state.tags,
        rules: [
          {
            required: false,
            message: '请输入场景标签'
          }
        ]
      },
      node: (
        <CommonSelect
          style={{ width: 250 }}
          mode="tags"
          placeholder="请输入场景标签"
          dataSource={state.tagList}
          onChange={(value, option) => handleChange(value, option)}
        />
      )
    }
  ];
  return basicFormData;
};
export default getScriptTagFormData;
