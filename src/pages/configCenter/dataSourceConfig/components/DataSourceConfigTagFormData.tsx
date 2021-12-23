import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';

const getDataSourceConfigTagFormData = (state, setState): FormDataType[] => {
  const handleChange = (value, option) => {
    setState({
      tags:
        value &&
        value.filter(item => {
          if (item.trim() !== '') {
            return item.trim();
          }
        }),
      tagsValue: option
        .map((item, k) => {
          return item.props.children;
        })
        .filter(item1 => {
          if (item1.trim() !== '') {
            return item1.trim();
          }
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
        ],
        normalize: value => {
          const replaceSpace = [];

          value.forEach(item => {
            const temItem = item.replace(/(^\s+)|(\s+$)/g, '');
            if (temItem !== '') {
              replaceSpace.push(temItem);
            }
          });
          const filterValue = replaceSpace.filter(item => {
            if (!/^\s+|\s+$/g.test(item)) {
              return item;
            }
            return item.trim();
          });
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
