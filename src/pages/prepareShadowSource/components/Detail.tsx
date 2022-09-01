import React, { useState, useEffect, useContext } from 'react';
import { Divider, Icon, Button, Dropdown, Alert } from 'antd';
import { PrepareContext } from '../indexPage';
import AppCheck from './AppCheck';
import DataIsloate from './DataIsloate';
import StatusDot from './StatusDot';
import Help from './Help';
import styles from '../index.less';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [step, setStep] = useState(0);
  const commonStepStyle = {
    display: 'flex',
    minWidth: 132,
    padding: 8,
    borderRadius: 100,
    cursor: 'pointer',
    // border: '1px solid var(--BrandPrimary-500, #11bbd5)',
    // backgroundColor: '#F2FDFF',
  };
  const activeStepStyle = {
    color: '#fff',
    backgroundColor: 'var(--BrandPrimary-500, #11bbd5)',
    boxShadow:
      '0px 8px 24px rgba(136, 136, 136, 0.1), 0px 6px 14px rgba(136, 136, 136, 0.3)',
  };

  const dropDownContent = <div>1111</div>;
  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      className={styles['detail-box']}
    >
      <div
        style={{
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #F7F8FA',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              ...commonStepStyle,
              ...(step === 0 ? activeStepStyle : {}),
            }}
            onClick={() => setStep(0)}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: step === 0 ? '#fff' : 'var(--Netural-850, #414548)',
                marginRight: 8,
                width: 40,
                height: 40,
                border: `1px solid ${
                  step === 0 ? '#fff' : 'var(--Netural-300, #DBDFE3)'
                }`,
                borderRadius: '100%',
                lineHeight: '38px',
                textAlign: 'center',
              }}
            >
              1
            </span>
            <div>
              <span
                style={{
                  fontWeight: 600,
                  color: step === 0 ? '#fff' : 'var(--Netural-850, #414548)',
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
              ...commonStepStyle,
              ...(step === 1 ? activeStepStyle : {}),
            }}
            onClick={() => setStep(1)}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: step === 1 ? '#fff' : 'var(--Netural-850, #414548)',
                marginRight: 8,
                width: 40,
                height: 40,
                border: `1px solid ${
                  step === 1 ? '#fff' : 'var(--Netural-300, #DBDFE3)'
                }`,
                borderRadius: '100%',
                lineHeight: '38px',
                textAlign: 'center',
              }}
            >
              2
            </span>
            <div>
              <span
                style={{
                  fontWeight: 600,
                  color: step === 1 ? '#fff' : 'var(--Netural-850, #414548)',
                }}
              >
                数据隔离
              </span>
              <div style={{ fontSize: 12, marginTop: 4 }}>未开始</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a
            style={{ margin: '0 32px' }}
            onClick={() => {
              setPrepareState({
                editLink: prepareState.currentLink,
              });
            }}
          >
            编辑链路
          </a>
          <Dropdown overlay={dropDownContent}>
            <Button style={{ width: 32, padding: 0 }}>
              <Icon type="more" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Alert
          style={{
            backgroundColor: 'var(--Netural-75, #F7F8FA)',
            color: 'var(--Netural-800, #5A5E62)',
            border: '1px solid var(--Netural-200, #E5E8EC)',
            margin: '16px 32px',
          }}
          closable
          message={
            <span>
              <Icon
                type="check-square"
                theme="filled"
                style={{
                  color: 'var(--Brandprimary-500, #11bbd5)',
                  marginRight: 8,
                }}
              />
              Takin已为该链路梳理出13个应用，请尽快检查各应用节点总数是否正确
            </span>
          }
        />
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            paddingBottom: 16,
            position: 'relative',
          }}
        >
          {step === 0 && <AppCheck />}
          {step === 1 && <DataIsloate />}
        </div>
      </div>

      <Help />
    </div>
  );
};
