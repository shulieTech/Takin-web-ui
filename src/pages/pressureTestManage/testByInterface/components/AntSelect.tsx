import React from 'react';
import { Select } from 'antd';
import { IFieldMergeState } from '@formily/antd';

const { Option } = Select;

// 因为formily自带的Select 默认值显示可能出现问题，这里重新简单封装了一个，如果没有特殊情况，不要用这个组件

const AntSelect = (props: IFieldMergeState) => {
  const {
    value,
    schema,
    editable,
    path,
    mutators,
    props: { enum: enums },
  } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  return (
    <Select
      {...componentProps}
      value={value || undefined}
      onChange={(val) => {
        mutators.change(val);
        componentProps?.onChange(val);
      }}
    >
      {(enums || []).map((x) => (
        <Option key={x.value} value={x.value}>
          {x.label}
        </Option>
      ))}
    </Select>
  );
};

AntSelect.isFieldComponent = true;

export default AntSelect;
