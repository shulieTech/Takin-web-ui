import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { DatePick } from 'racc';
import moment from 'moment';

const OperationLogSearch = (): FormDataType[] => {
  return [
    {
      key: 'userName',
      label: '',
      node: <Input placeholder="操作人" />
    },
    {
      key: 'time',
      label: '',
      node: (
        <DatePick
          type="range"
          rangePickerProps={{
            placeholder: ['操作开始时间', '操作结束时间'],
            // showTime: false,
            style: { width: '100%' },
            disabledDate: current => current > moment().endOf('day')
          }}
        />
      )
    }
  ];
};

export default OperationLogSearch;
