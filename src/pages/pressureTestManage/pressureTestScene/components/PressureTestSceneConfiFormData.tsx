import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';

const getPressureTestSceneConfiFormData = (
  state,
  setState,
  action
): FormDataType[] => {
  const { appDetail } = state;

  const handleChangeAppName = e => {
    setState({
      appName: e.target.value
    });
  };

  const basicFormData = [
    {
      key: 'applicationName',
      label: '压测场景名称',
      options: {
        initialValue:
          action !== 'add' ? appDetail && appDetail.applicationName : undefined,
        rules: [
          {
            required: true,
            message: '请输入应用名'
          }
        ]
      },
      node: (
        <Fragment>
          <Input placeholder="请输入" />
        </Fragment>
      )
    }
  ];
  return basicFormData;
};
export default getPressureTestSceneConfiFormData;
