import React, { CSSProperties } from 'react';
import { Tooltip } from 'antd';

interface Props {
  style?: CSSProperties;
  color?: string;
  title?: React.ReactNode;
}
export default (props: Props) => {
  const { style = {}, title, color, ...rest } = props;
  return (
    <Tooltip title={title}>
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
    </Tooltip>
  );
};
