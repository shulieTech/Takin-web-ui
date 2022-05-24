import React from 'react';
import {
  createControllerBox,
  useVirtualField,
  IFieldMergeState,
} from '@formily/antd';

const LayoutBox = createControllerBox(
  'LayoutBox',
  (props: IFieldMergeState) => {
    const { value, schema, editable, path, mutators } = props;
    const { 'x-component-props': componentProps } =
      schema.getExtendsComponentProps() || {};
    useVirtualField({ name: 'random' });
    return <div {...componentProps}>{props.children}</div>;
  }
);

export default LayoutBox;
