import React, { useState, useEffect, useContext } from 'react';
import { Divider, Icon, Button, Dropdown } from 'antd';
import { PrepareContext } from '../indexPage';
import AppCheck from './AppCheck';
import DataIsloate from './DataIsloate';
import StatusDot from './StatusDot';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [step, setStep] = useState(0);
  const activeStepStyle = {
    color: '#fff',
    backgroundColor: 'var(--BrandPrimary-500, #11bbd5)',
  };

  const dropDownContent = <div>1111</div>;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #F7F8FA',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <span
            className="truncate"
            style={{
              color: 'var(--Netural-990, #25282A)',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            用户组-发送消息
          </span>
          <Divider type="vertical" style={{ height: 24, margin: '0 32px' }} />
          <span>
            <StatusDot style={{ marginRight: 8 }} />
            未开始
          </span>
          <a style={{ margin: '0 32px' }}>编辑链路</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              minWidth: 132,
              padding: '8px 22px',
              borderRadius: 100,
              cursor: 'pointer',
              ...(step === 0 ? activeStepStyle : {}),
            }}
            onClick={() => setStep(0)}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 200,
                color: step === 0 ? '#fff' : 'var(--Netural-900, #303336)',
                marginRight: 8,
                lineHeight: 1,
              }}
            >
              ①
            </span>
            <div>
              <span
                style={{
                  fontWeight: 600,
                  color: step === 0 ? '#fff' : 'var(--Netural-900, #303336)',
                }}
              >
                应用检查
              </span>
              <div style={{ fontSize: 12, marginTop: 4 }}>未开始</div>
            </div>
          </div>
          <Icon
            type="right"
            style={{ margin: '0 12px', color: 'var(--Netural-400, #BFC3C8)' }}
          />
          <div
            style={{
              display: 'flex',
              minWidth: 132,
              padding: '8px 22px',
              borderRadius: 100,
              cursor: 'pointer',
              ...(step === 1 ? activeStepStyle : {}),
            }}
            onClick={() => setStep(1)}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 200,
                color: step === 1 ? '#fff' : 'var(--Netural-900, #303336)',
                marginRight: 8,
                lineHeight: 1,
              }}
            >
              ②
            </span>
            <div>
              <span
                style={{
                  fontWeight: 600,
                  color: step === 1 ? '#fff' : 'var(--Netural-900, #303336)',
                }}
              >
                数据隔离
              </span>
              <div style={{ fontSize: 12, marginTop: 4 }}>未开始</div>
            </div>
          </div>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <Dropdown overlay={dropDownContent}>
            <Button style={{ width: 32, padding: 0 }}>
              <Icon type="more" />
            </Button>
          </Dropdown>
        </div>
      </div>
      {step === 0 && <AppCheck />}
      {step === 1 && <DataIsloate />}
    </div>
  );
};
