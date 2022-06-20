import React from 'react';
import { Radio } from 'antd';
import { IFieldMergeState } from '@formily/antd';

const RadioCard = (props: IFieldMergeState) => {
  const { value, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { renderOption = (item, isChecked) => item.label, ...rest } =
    componentProps;
  return (
    <div {...rest}>
      {(schema.enum || []).map((x: any) => {
        return (
          <div
            key={x.value}
            style={{
              display: 'inline-block',
              marginRight: 8,
              opacity: x.disabled ? 0.6 : 1,
              cursor: x.disabled ? 'not-allowed' : 'pointer',
              lineHeight: 1.5,
            }}
            onClick={() => {
              if (x.disabled || !editable) { return; }
              mutators.change(x.value);
            }}
          >
            {renderOption(x, value === x.value)}
          </div>
        );
      })}
    </div>
  );
};

RadioCard.isFieldComponent = true;
export default RadioCard;
