import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getFormData = (): FormDataType[] => {
  return [
    {
      key: 'applicationName',
      label: '',
      node: <Input placeholder="应用名称" />
    },
    {
      key: 'accessStatus',
      label: '',
      node: (
        <CommonSelect
          placeholder="接入状态"
          dataSource={[
            { label: '正常', value: 0 },
            { label: '待配置', value: 1 },
            { label: '待检测', value: 2 },
            { label: '异常', value: 3 }
          ]}
        />
      )
    }
  ];
};

export default getFormData;
