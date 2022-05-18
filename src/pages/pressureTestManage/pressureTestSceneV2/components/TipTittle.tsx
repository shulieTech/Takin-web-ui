import React, { ReactNode } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default (props: {
  tips: string | ReactNode;
  children: ReactNode
}) => {
  const { children, tips } = props;
  return (
    <span>
      {children}
      <Tooltip title={tips}>
        <QuestionCircleOutlined style={{ cursor: 'pointer', marginLeft: 4 }} />
      </Tooltip>
    </span>
  );
};
