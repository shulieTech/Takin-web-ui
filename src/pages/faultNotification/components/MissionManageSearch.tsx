import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getMissionManageFormData = (state): FormDataType[] => {
  return [
    {
      key: 'businessName',
      label: '',
      node: (
        <Input placeholder="请输入任务名称" />
      )
    },
    {
      key: 'exceptionType',
      label: '',
      node: (
        <CommonSelect
          placeholder="请选择瓶颈类型"
          dataSource={state.PATROL_EXCEPTION_TYPE || []}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    },
  ];
};

export default getMissionManageFormData;
