import React from 'react';
import { InputNumber, Input } from 'antd';
import { SchemaField, FormPath, Schema, IFieldMergeState } from '@formily/antd';

const NumberPicker = (props: IFieldMergeState) => {
  const { value, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { addonBefore, addonAfter, ...rest } = componentProps;
  return (
    <Input.Group compact style={{ display: 'inline-flex' }}>
      {addonBefore}
      <InputNumber
        value={value}
        onChange={mutators.change}
        {...rest}
      />
      {addonAfter}
    </Input.Group>
  );
};

NumberPicker.isFieldComponent = true;

export default NumberPicker;
