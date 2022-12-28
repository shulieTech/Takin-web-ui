import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Input, InputNumber, DatePicker } from 'antd';

const getUserPackageFormData = (state, action, setState): FormDataType[] => {
  const { MonthPicker } = DatePicker;

  const handleChange = (value) => {
    state.form.setFieldsValue({
      package: value
    });
    setState({
      package: value
    });
  };
  const basicFormData = [
    {
      key: 'nick',
      label: '租户',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择租户'
          }
        ]
      },
      node: <CommonSelect placeholder="请选择租户" dataSource={[]}/>
    },
    {
      key: 'package',
      label: '套餐',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择套餐'
          }
        ]
      },
      node: <CommonSelect onChange={handleChange} placeholder="请选择套餐" dataSource={[{ label: '按次', value: '1' }, { label: '按月', value: '2' }]}/>
    },
  ];

  const timeFormData = [
    {
      key: 'number',
      label: '次数',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请输入次数'
          }
        ]
      },
      node: <InputNumber placeholder="请输入次数：10-9999" />
    }
  ];

  const dateFormData = [
    {
      key: 'month',
      label: '月份',
      options: {
        initialValue: undefined,
        rules: [
          {
            required: true,
            message: '请选择月份'
          }
        ]
      },
      node: <MonthPicker  placeholder="请选择月份" />
    }
  ];
  
  if (state?.form?.getFieldValue('package') === '1') {
    return basicFormData.concat(timeFormData);
  }
  if (state?.form?.getFieldValue('package') === '2') {
    return basicFormData.concat(dateFormData);
  }
  return basicFormData;
};
export default getUserPackageFormData;
