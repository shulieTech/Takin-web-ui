import { Input } from 'antd';
import { DatePick } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import { getTakinAuthority } from 'src/utils/utils';

const getPressureTestReportFormData = (): FormDataType[] => {
  if (getTakinAuthority() === 'true') {
    return [
      {
        key: 'sceneName',
        label: '',
        node: <Input placeholder="压测场景名称" />
      },
      {
        key: 'managerName',
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
  }
  return [
    {
      key: 'reportId',
      label: '',
      node: <Input placeholder="报告ID" />
    },
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
