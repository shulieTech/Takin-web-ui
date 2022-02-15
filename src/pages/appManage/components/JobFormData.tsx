import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';

const getJobFormData = (state, action, setState): FormDataType[] => {
  const { appDetail } = state;

  const handleChangeAppName = e => {
    setState({
      appName: e.target.value
    });
  };

  const basicFormData = [
    {
      key: 'applicationName',
      label: '应用名',
      options: {
        initialValue:
          action !== 'add' ? appDetail && appDetail.applicationName : undefined,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入应用名'
          }
        ]
      },
      node: (
        <Input
          placeholder="请输入"
          onChange={value => handleChangeAppName(value)}
        />
      )
    },
    {
      key: 'applicationDesc',
      label: '应用说明',
      options: {
        initialValue:
          action !== 'add' ? appDetail && appDetail.applicationDesc : undefined,
        rules: [
          {
            required: false,
            message: '请输入应用说明'
          }
        ]
      },
      node: <Input placeholder="请输入" />
    }
  ];
  return basicFormData;
};
export default getJobFormData;
