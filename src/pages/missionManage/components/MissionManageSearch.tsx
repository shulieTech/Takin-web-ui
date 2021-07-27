import { FormDataType } from 'racc/dist/common-form/type';
import { Input } from 'antd';
import React from 'react';
import { CommonSelect } from 'racc';

const getMissionManageFormData = (state): FormDataType[] => {
  return [
    {
      key: 'patrolSceneId',
      label: '',
      node: (
        <CommonSelect
          placeholder="请选择巡检场景"
          dataSource={state.patrolSceneDataSource || []}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    },
    {
      key: 'patrolBoardId',
      label: '',
      node: (
        <CommonSelect
          placeholder="请选择巡检看板"
          dataSource={state.patrolDashbordDataSource || []}
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
