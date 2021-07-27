import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect, DatePick } from 'racc';

const getReportListSearchFormData = (): FormDataType[] => {
  return [
    {
      key: 'time',
      label: '',
      node: (
        <DatePick
          type="range"
          rangePickerProps={{ placeholder: ['压测开始时间', '压测开始时间'] }}
        />
      )
    }
  ];
};

export default getReportListSearchFormData;
