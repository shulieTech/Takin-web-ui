import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect, DatePick } from 'racc';

const getFormData = (): FormDataType[] => {
  return [
    {
      key: '1',
      label: '',
      node: <Input placeholder="压测任务名称" />
    },
    {
      key: '2',
      label: '',
      node: <CommonSelect placeholder="压测任务类型" />
    },
    {
      key: 'time',
      label: '',
      node: (
        <DatePick
          type="range"
          rangePickerProps={{ placeholder: ['压测创建时间', '压测创建时间'] }}
        />
      )
    }
  ];
};

export default getFormData;
