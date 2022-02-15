import React from 'react';
import { InputNumber, Input } from 'antd';
import { SchemaField, FormPath, Schema, IFieldMergeState } from '@formily/antd';

const NumberPicker = (props: IFieldMergeState) => {
  const { value, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { addonBefore, addonAfter, compact = true, ...rest } = componentProps;
  return (
    <Input.Group compact={compact} style={{ display: 'inline-flex', lineHeight: '32px' }}>
      {addonBefore}
      <InputNumber value={value} onChange={mutators.change} {...rest} />
      {addonAfter}
    </Input.Group>
  );
};

NumberPicker.isFieldComponent = true;

export default NumberPicker;
