import React, { ReactNode } from 'react';
import { Icon, Tooltip } from 'antd';

export default (props: {
  tips: string | ReactNode;
  children: ReactNode
}) => {
  const { children, tips } = props;
  return (
    <span>
      {children}
      <Tooltip title={tips}>
        <Icon type="question-circle" style={{ cursor: 'pointer', marginLeft: 4 }}/>
      </Tooltip>
    </span>
  );
};
