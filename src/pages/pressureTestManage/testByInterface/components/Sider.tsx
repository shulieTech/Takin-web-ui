import React from 'react';
import { Tooltip, Icon } from 'antd';

const Sider = () => {
  return (
    <div
      style={{
        width: 50,
        textAlign: 'center',
        borderLeft: '1px solid #EEF0F2',
      }}
    >
      <Tooltip title="参数编辑" placement="left">
        <div style={{ lineHeight: '50px', cursor: 'pointer' }}>
          <Icon type="code" />
        </div>
      </Tooltip>
      <Tooltip title="基本信息设置" placement="left">
        <div style={{ lineHeight: '50px', cursor: 'pointer' }}>
          <Icon type="control" />
        </div>
      </Tooltip>
      <Tooltip title="压测报告" placement="left">
        <div style={{ lineHeight: '50px', cursor: 'pointer' }}>
          <Icon type="history" />
        </div>
      </Tooltip>
    </div>
  );
};

export default Sider;
