/* eslint-disable eqeqeq */
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
      key: 'tenantId',
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
      // tslint:disable-next-line:block-spacing
      node: <CommonSelect placeholder="请选择租户" dataSource={state?.tenantList?.map((item) => {return { label: item?.tenantName, value: item?.tenantId }; })}/>
    },
    {
      key: 'packageId',
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
      // tslint:disable-next-line:block-spacing
      node: <CommonSelect onChange={handleChange} placeholder="请选择套餐" dataSource={state?.userPackageList?.map((item) => {return { label: item?.packageName, value: item?.packageId }; })}/>
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
      node: <InputNumber placeholder="请输入次数：10-9999" min={10} max={9999} precision={0}/>
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
      node: <InputNumber placeholder="请输入月份：1-12" min={1} max={12} precision={0}/>
    }
  ];
  
  // tslint:disable-next-line:triple-equals
  if (state?.userPackageList?.filter(item => item?.packageId == state?.form?.getFieldValue('packageId'))?.[0]?.packageType === 1) {
    return basicFormData.concat(timeFormData);
  }
  // tslint:disable-next-line:triple-equals
  if (state?.userPackageList?.filter(item => item?.packageId == state?.form?.getFieldValue('packageId'))?.[0]?.packageType === 0) {
    return basicFormData.concat(dateFormData);
  }
  return basicFormData;
};
export default getUserPackageFormData;
