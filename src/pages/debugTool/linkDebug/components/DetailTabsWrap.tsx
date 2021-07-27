import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import { DetailState } from '../detailPage';
import styles from './../index.less';
import AppAndAgentLog from './AppAndAgentLog';
import CallStackTable from './CallStackTable';
import ConfigErrorList from './ConfigErrorList';
import DataValidationWrap from './DataValidationWrap';
interface Props {
  state?: DetailState;
  setState?: (value) => void;
  id?: string;
}
const DetailTabsWrap: React.FC<Props> = props => {
  const { state, id, setState } = props;
  const { debugStatus, debugResultDetail } = state;
  let tabsData = [];

  if (debugStatus === '失败') {
    tabsData = [
      {
        key: '0',
        title: (
          <span>
            配置异常
            <span
              style={{
                color: '#ED5F47',
                fontWeight: 600,
                fontSize: '14px',
                marginLeft: 8
              }}
            >
              {debugResultDetail && debugResultDetail.exceptionCount}
            </span>
          </span>
        ),
        tabNode: (
          <ConfigErrorList
            traceId={debugResultDetail && debugResultDetail.traceId}
            state={state}
          />
        )
      },
      {
        key: '1',
        title: (
          <span>
            调用栈
            <span
              style={{
                color: '#ED5F47',
                fontWeight: 600,
                fontSize: '14px',
                marginLeft: 8
              }}
            >
              {debugResultDetail && debugResultDetail.callStackExceptionCount}
            </span>
          </span>
        ),
        tabNode: (
          <CallStackTable
            id={id}
            state={state}
            traceId={debugResultDetail && debugResultDetail.traceId}
            callStackMessage={
              debugResultDetail && debugResultDetail.callStackMessage
            }
          />
        )
      },
      {
        key: '2',
        title: '应用/Agent日志',
        tabNode: (
          <AppAndAgentLog
            traceId={debugResultDetail && debugResultDetail.traceId}
          />
        )
      },
      {
        key: '3',
        title: (
          <span>
            数据验证
            <span
              style={{
                color: '#ED5F47',
                fontWeight: 600,
                fontSize: '14px',
                marginLeft: 8
              }}
            >
              {debugResultDetail && debugResultDetail.isLeakException && (
                <span className={styles.louIcon}>!</span>
              )}
            </span>
          </span>
        ),
        tabNode: (
          <DataValidationWrap
            missingData={state.missingDataList || []}
            type="detail"
          />
        )
      }
    ];
  } else {
    tabsData = [
      {
        key: '1',
        title: '调用栈',
        tabNode: (
          <CallStackTable
            id={id}
            state={state}
            traceId={debugResultDetail && debugResultDetail.traceId}
            callStackMessage={
              debugResultDetail && debugResultDetail.callStackMessage
            }
          />
        )
      },
      {
        key: '2',
        title: '应用/Agent日志',
        tabNode: (
          <AppAndAgentLog
            traceId={debugResultDetail && debugResultDetail.traceId}
          />
        )
      },
      {
        key: '3',
        title: '数据验证',
        tabNode: (
          <DataValidationWrap
            missingData={state.missingDataList || []}
            type="detail"
          />
        )
      }
    ];
  }

  return (
    <div id="tabsWrap" className={styles.tabsWrap}>
      <Tabs
        activeKey={state.tabKey}
        onChange={value =>
          setState({
            tabKey: value
          })
        }
      >
        {tabsData.map((item, index) => {
          return (
            <Tabs.TabPane tab={item.title} key={item.key} forceRender={false}>
              {item.tabNode}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};
export default DetailTabsWrap;
