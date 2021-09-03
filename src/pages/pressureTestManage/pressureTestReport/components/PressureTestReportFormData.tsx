import { Input } from 'antd';
import { DatePick } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';

const getPressureTestReportFormData = (): FormDataType[] => {
  return [
    {
      key: 'sceneName',
      label: '',
      node: <Input placeholder="压测场景名称" />
    },
    {
      key: 'userName',
      label: '',
      node: <Input placeholder="执行人" />
    },
    {
      key: 'time',
      label: '',
      node: (
        <DatePick
          type="range"
          rangePickerProps={{
            placeholder: ['压测开始时间', '压测结束时间'],
            showTime: true,
            style: { width: '100%' }
          }}
        />
      )
    }
  ];
};

export default getPressureTestReportFormData;
