import React, { useState, useRef } from 'react';
import copy from 'copy-to-clipboard';
import { Tooltip, message } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';

const CopyableTooltip: React.FC<TooltipProps> = (props) => {
  const titleRef = useRef();
  const { title, children, ...rest } = props;
  const copyHandle = () => {
    if (titleRef?.current) {
      copy((titleRef?.current as HTMLElement)?.outerText);
      message.success('复制成功');
    }
  };
  return (
    <Tooltip
      title={
        <div>
          <div style={{ textAlign: 'right' }}>
            <span
              onClick={copyHandle}
              style={{ fontSize: 12, cursor: 'pointer' }}
            >
              复制
            </span>
          </div>
          <div ref={titleRef} style={{ flex: 1 }}>
            {title}
          </div>
        </div>
      }
      {...rest}
    >
      {children}
    </Tooltip>
  );
};

export default CopyableTooltip;
