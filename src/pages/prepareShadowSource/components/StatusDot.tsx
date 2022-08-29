import React, { CSSProperties } from 'react';

interface Props {
  style?: CSSProperties;
  color?: string;
}
export default (props: Props) => {
  const { style = {}, color, ...rest } = props;
  return (
    <div
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: 12,
        height: 12,
        borderRadius: '100%',
        backgroundColor: color || 'var(--Netural-400, #BFC3C8)',
        ...style,
      }}
      {...rest}
    />
  );
};
