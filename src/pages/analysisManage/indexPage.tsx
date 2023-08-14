/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @name
 * @author MingShined
 */
import { CommonTabs, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { MainPageLayout } from 'src/components/page-layout';
import { Basic } from 'src/types';
import AnalysisDetails from './components/AnalysisDetails';
import AnalysisExtra from './components/AnalysisExtra';
import EmptyNode from './components/EmptyNode';
import MemeryAnalysing from './components/memeryAnalysing';
import MethodTrack from './components/methodTrack';
import ThreadAnalysis from './components/threadAnalysis';
import { AnalysisState, initState, ThreadContext } from './context';
import { AnalysisTab, AnalysisType } from './enum';

interface Props extends Basic.BaseProps {}
const AnalysisManage: React.FC<Props> = props => {
  const {
    location: { query }
  } = props;
  const isReport = query.type === AnalysisType.分析报告;
  const [state, setState] = useStateReducer<AnalysisState>(initState);
  useEffect(() => {
    const { appName, processName } = query;
    if (appName && processName) {
      setState({ appName, processName });
    }
    // localStorage.setItem('token', query.token);
  }, []);
  const tabDataSource = [
    {
      tab: '线程分析',
      key: AnalysisTab.线程分析,
      component: <ThreadAnalysis query={query} />
    },
    {
      tab: '内存分析',
      key: AnalysisTab.内存分析,
      component: <MemeryAnalysing query={query} />
    },
    {
      tab: '方法追踪',
      key: AnalysisTab.方法追踪,
      component: <MethodTrack query={query} />
    }
  ];
  return (
    <ThreadContext.Provider value={{ state, setState }}>
      <div style={{ paddingBottom: 24 }}>
        <MainPageLayout
          title={isReport ? '分析报告详情' : '分析实况详情'}
          extra={isReport && <AnalysisExtra query={query} />}
        >
          <AnalysisDetails query={query} />
          {isReport && !state.processName ? (
            <EmptyNode />
          ) : (
            <CommonTabs
              dataSource={tabDataSource}
              tabsProps={{
                destroyInactiveTabPane: true,
                defaultActiveKey: query.tab || AnalysisTab.线程分析
              }}
              onRender={item => (
                <CommonTabs.TabPane key={item.key} tab={item.tab}>
                  {item.component}
                </CommonTabs.TabPane>
              )}
            />
          )}
        </MainPageLayout>
      </div>
    </ThreadContext.Provider>
  );
};
export default AnalysisManage;
