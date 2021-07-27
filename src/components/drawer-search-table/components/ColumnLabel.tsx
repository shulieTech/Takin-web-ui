/**
 * @name
 * @author MingShined
 */
import React, { Fragment } from 'react';
export interface ColumnLabelProps {
  label?: string | React.ReactNode;
  value: any;
  render?: (value: any) => React.ReactNode;
  emptyNode?: React.ReactNode | string;
  style?: React.CSSProperties;
  className?: string;
  wrap?: boolean;
  colon?: boolean;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
}
const ColumnLabel: React.FC<ColumnLabelProps> = props => {
  return (
    <span className={props.className} style={props.style}>
      {props.label && (
        <span style={{ color: '#CACCE5', ...props.labelStyle }}>
          {props.label}
          {props.colon && ' : '}
        </span>
      )}
      <span
        className={`of-hd ${!props.wrap && 'mg-l1x'} ${props.wrap && 'block'}`}
        style={props.valueStyle}
      >
        {props.value
          ? props.render
            ? props.render(props.value)
            : props.value
          : props.emptyNode}
      </span>
    </span>
  );
};
export default ColumnLabel;

ColumnLabel.defaultProps = {
  emptyNode: '--',
  colon: true
};
