import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';

const getDataSourceConfigTagFormData = (state, setState): FormDataType[] => {
  const handleChange = (value, option) => {
    // console.log('value, option', value, option);
    setState({
      tags: value.filter(item => {
        if (item.trim() !== '') {
          return item;
        }
      }),
      tagsValue: option.map((item, k) => {
        // if (item.props.children.trim() !== '') {
        return item.props.children;
        // }
      })
    });
  };
  // console.log('state.tags', state.tags);
  // console.log('state.tagsValue', state.tagsValue);
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
        ],
        normalize: value => {
          const replaceSpace = [];

          value.forEach(item => {
            const temItem = item.replace(/(^\s+)|(\s+$)/g, '');
            if (temItem !== '') {
              // console.log('temItem', temItem);
              replaceSpace.push(temItem);
            }
            // temItem !== '' && replaceSpace.push(temItem);
          });
          const filterValue = replaceSpace.filter(
            item => !/^\s+|\s+$/g.test(item)
          );

          return filterValue;
        }
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
export default getDataSourceConfigTagFormData;
