import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Icon, Alert } from 'antd';
import { PrepareContext } from '../indexPage';
import AppCheck from './AppCheck';
import DataIsloate from './DataIsloate';
import RemoteImport from './RemoteImport';
import Help from './Help';
import styles from '../index.less';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [step, setStep] = useState(0);
  const commonStepStyle = {
    display: 'flex',
    minWidth: 132,
    padding: 8,
    paddingRight: 16,
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

  const stepList = [
    {
      title: '应用检查',
      subTitle: '未开始',
    },
    {
      title: '影子隔离',
      subTitle: '未开始',
    },
    {
      title: '远程调用',
      subTitle: '未开始',
    },
    {
      title: '数据隔离',
      subTitle: '未开始',
    },
  ];

  useEffect(() => {
    setStep(0);
  }, [prepareState.currentLink?.id]);

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
          {
            stepList.map((x, i, arr) => {
              return <Fragment key={x.title}>
                <div
                  style={{
                    ...commonStepStyle,
                    ...(step === i ? activeStepStyle : {}),
                  }}
                  onClick={() => setStep(i)}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: step === i ? '#fff' : 'var(--Netural-850, #414548)',
                      marginRight: 8,
                      width: 40,
                      height: 40,
                      border: `1px solid ${step === i ? '#fff' : 'var(--Netural-300, #DBDFE3)'
                        }`,
                      borderRadius: '100%',
                      lineHeight: '38px',
                      textAlign: 'center',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span
                      style={{
                        fontWeight: 600,
                        color: step === i ? '#fff' : 'var(--Netural-850, #414548)',
                      }}
                    >
                      {x.title}
                    </span>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{x.subTitle}</div>
                  </div>
                </div>
                {i < arr.length - 1 && <Icon
                  type="right"
                  style={{ margin: '0 12px', color: 'var(--Netural-400, #BFC3C8)' }}
                />}
              </Fragment>;
            })
          }

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
          {step === 2 && <RemoteImport />}
        </div>
      </div>

      <Help />
    </div>
  );
};
