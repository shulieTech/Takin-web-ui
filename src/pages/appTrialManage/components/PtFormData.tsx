import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Radio, Input, Icon, Tooltip, message } from 'antd';

const getPtFormData = (state, setState, detailData): FormDataType[] => {
  const { ptTableDetail } = state;

  const basicFormData = [
    {
      key: 'applicationName',
      label: '应用',
      options: {
        initialValue: ptTableDetail && ptTableDetail.applicationName,
        rules: [
          {
            required: true,
            message: '请选择应用'
          }
        ]
      },
      node: <Input disabled={true} />
    },
    {
      key: 'url',
      label: '数据库URL',
      options: {
        initialValue: ptTableDetail && ptTableDetail.url,
        rules: [
          {
            required: true,
            message: '请输入数据库URL'
          }
        ]
      },
      node: <Input placeholder="请输入" disabled={true} />
    },
    {
      key: 'config',
      label: '表名称',
      options: {
        initialValue: ptTableDetail && ptTableDetail.config,
        rules: [
          {
            required: true,
            message: '请输入表名称'
          }
        ]
      },
      node: (
        <Input.TextArea
          placeholder="请输入表名称，以逗号隔开"
          style={{ height: 300 }}
        />
      )
    }
  ];

  return basicFormData;
};
export default getPtFormData;
