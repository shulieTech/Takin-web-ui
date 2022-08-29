import React, { useState, useEffect, useContext } from 'react';
import { Alert, Divider, Icon, Button, Tooltip } from 'antd';
import { PrepareContext } from '../indexPage';
import DataIsolateGuide from './DataIsolateGuide';
import DataSourceMode from './DataSourceMode';
import AppMode from './AppMode';

export default (props) => {
  const [showGuide, setShowGuide] = useState(false);
  const [mode, setMode] = useState(0);

  if (showGuide) {
    return <DataIsolateGuide />;
  }

  const activeModeSwitchStyle = {
    backgroundColor: 'var(--Netural-100, #EEF0F2)',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 4,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 100,
              display: 'inline-block',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                lineHeight: '32px',
                padding: '0 16px',
                borderRadius: 100,
                color: 'var(--Netural/800, #5A5E62)',
                fontWeight: 500,
                cursor: 'pointer',
                ...(mode === 0 ? activeModeSwitchStyle : {}),
              }}
              onClick={() => setMode(0)}
            >
              数据源模式
            </div>
            <div
              style={{
                display: 'inline-block',
                lineHeight: '32px',
                padding: '0 16px',
                borderRadius: 100,
                color: 'var(--Netural/800, #5A5E62)',
                fontWeight: 500,
                cursor: 'pointer',
                ...(mode === 1 ? activeModeSwitchStyle : {}),
              }}
              onClick={() => setMode(1)}
            >
              应用模式
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            隔离方式：影子库
            <a style={{ marginLeft: 16 }}>设置</a>
          </div>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <Tooltip title="333">
            <Icon type="info-circle" style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Button style={{ marginLeft: 24 }}>新增数据源</Button>
          <Button style={{ marginLeft: 24 }}>导入隔离配置</Button>
          <Button type="primary" style={{ marginLeft: 24 }}>
            导出待配置项
          </Button>
        </div>
      </div>
      {mode === 0 && <DataSourceMode />}
      {mode === 1 && <AppMode />}
    </div>
  );
};
