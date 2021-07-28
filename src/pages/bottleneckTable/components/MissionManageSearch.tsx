import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getMissionManageFormData = (state): FormDataType[] => {
  return [
    {
      key: 'id',
      label: '',
      node: (
        <Input placeholder="请输入瓶颈ID" />
      )
    },
    {
      key: 'businessName',
      label: '',
      node: (
        <Input placeholder="请输入巡检任务" />
      )
    },
    {
      key: 'type',
      label: '',
      node: (
        <CommonSelect
          placeholder="请选择瓶颈类型"
          dataSource={[{ value: '1', label: '卡慢', num: 1, disable: false },
          { value: '2', label: '接口异常', num: 2, disable: false },
          { value: '3', label: '巡检异常', num: 3, disable: false }]}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    },
    {
      key: 'level',
      label: '',
      node: (
        <CommonSelect
          placeholder="请选择瓶颈程度"
          dataSource={state.PATROL_EXCEPTION_LEVEL || []}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    }
  ];
};

export default getMissionManageFormData;
