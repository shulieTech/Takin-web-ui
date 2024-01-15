import { Input } from 'antd';
import { CommonSelect, DatePick } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import BusinessSelect from 'src/components/business-select';

const getPressureTestSceneFormData = (state): FormDataType[] => {
  return [
    {
      key: 'sceneId',
      label: '',
      node: <Input placeholder="压测场景ID" />,
      options: {
        getValueFromEvent: e => {
          const val = parseInt(e.target.value, 10);
          return isNaN(val) ? undefined : val;
        }
      }
    },
    {
      key: 'sceneName',
      label: '',
      node: <Input placeholder="压测场景名称" />
    },
    {
      key: 'status',
      label: '',
      node: (
        <CommonSelect
          placeholder="状态"
          dataSource={[
            { label: '待启动', value: 0 },
            { label: '启动中', value: 1 },
            { label: '压测中', value: 2 },
          ]}
        />
      )
    },
    {
      key: 'tagId',
      label: '',
      node: (
        <BusinessSelect
          reloadKey={state.tagReloadKey}
          showSearch
          optionFilterProp="children"
          url="/scenemanage/tag"
          labelKey="tagName"
          valueKey="id"
          placeholder="标签"
        />
      )
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

export default getPressureTestSceneFormData;
