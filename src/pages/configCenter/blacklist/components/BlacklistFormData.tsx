import React, { Fragment } from 'react';

import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';

const getBlacklistFormData = (state, action, setState): FormDataType[] => {
  const { blacklistDetail } = state;

  const basicFormData = [
    {
      key: 'redisKey',
      label: 'redis key',
      options: {
        initialValue:
          action !== 'add'
            ? blacklistDetail && blacklistDetail.redisKey
            : undefined,
        rules: [
          {
            required: true,
            message: '请输入应用名'
          }
        ]
      },
      node: <Input placeholder="请输入" />
    }
  ];
  return basicFormData;
};
export default getBlacklistFormData;
