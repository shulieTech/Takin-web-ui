import { Col, Divider, Row } from 'antd';
import { useStateReducer } from 'racc';
import React from 'react';
import styles from './../index.less';
import LinkCharts from './LinkCharts';
import ProblemAnalysis from './ProblemAnalysis';
import ReportLinkOverviewDetail from './ReportLinkOverviewDetail';
import RequestList from './RequestList';
import WarningDetailList from './WarningDetailList';
import WaterLevel from './WaterLevel';

interface Props {
  id?: string;
  detailData?: any;
  state?: any;
  setState?: (value) => void;
  reportCountData: any;
  failedCount: number;
}
interface State {
  tabKey: number;
}
const ModuleTabs: React.FC<Props> = (props) => {
  const { id, detailData, state, setState, reportCountData, failedCount } =
    props;
  const [tabState, setTabState] = useStateReducer<State>({
    tabKey: 0,
  });
  const data = [
    {
      title: '压测概览',
      firstLineTxt: '个业务活动',
      firstLineNum: {
        value: reportCountData && reportCountData.businessActivityCount,
        color: '#354153',
      },
      renderTabNode: (
        <LinkCharts
          tabList={state.tabList}
          chartsInfo={state.chartsInfo}
          setState={setState}
          state={state}
          graphConfig={{
            tooltip: (
              <div>
                TPS：包含所有业务活动中，在压测期间的平均值，单位次/秒；
                <br />
                RT：包含所有业务活动中，在压测期间的平均值，单位毫秒；
                <br />
                调用量：包含所有业务活动中，该上下游两个节点的调用量数据，在压测期间的累加值；
                <br />
                成功率：包含所有业务活动中，该上下游两个节点的调用成功率数据，取压测期间的平均值；
              </div>
            ),
          }}
          chartConfig={{
            tooltip: (
              <div>
                趋势图仅统计业务活动入口的数据，不代表链路图节点的数据。
              </div>
            ),
          }}
        />
      ),
    },
    {
      title: '问题分析',
      firstLineTxt: '个瓶颈接口',
      firstLineNum: {
        value: reportCountData && reportCountData.bottleneckInterfaceCount,
        color: '#FE7D61',
      },
      secondLineTxt: '台风险机器',
      secondLineNum: {
        value: reportCountData && reportCountData.riskMachineCount,
        color: '#FE7D61',
      },
      renderTabNode: (
        <ProblemAnalysis state={state} setState={setState} id={id} />
      ),
    },
    {
      title: '压测明细',
      firstLineTxt: '个业务活动',
      firstLineNum: {
        value: reportCountData && reportCountData.businessActivityCount,
        color: '#354153',
      },
      secondLineTxt: '个业务活动不达标',
      secondLineNum: {
        value: reportCountData && reportCountData.notpassBusinessActivityCount,
        color: '#FE7D61',
      },
      renderTabNode: (
        <ReportLinkOverviewDetail detailData={detailData} id={id} />
      ),
    },
    {
      title: '容量水位',
      firstLineTxt: '个应用',
      firstLineNum: {
        value: reportCountData && reportCountData.applicationCount,
        color: '#354153',
      },
      secondLineTxt: '台机器',
      secondLineNum: {
        value: reportCountData && reportCountData.machineCount,
        color: '#354153',
      },
      renderTabNode: <WaterLevel id={id} />,
    },
    {
      title: '告警明细',
      firstLineTxt: '次警告',
      firstLineNum: {
        value: reportCountData && reportCountData.warnCount,
        color: '#FE7D61',
      },
      renderTabNode: <WarningDetailList id={id} />,
    },
    {
      title: '请求流量明细',
      firstLineTxt: '次失败请求',
      firstLineNum: {
        value: failedCount,
        color: '#FE7D61',
      },
      renderTabNode: <RequestList id={id} detailData={state.detailData} tabList={state.tabList}/>,
    },
  ];

  const handleChangeTab = async (key) => {
    setTabState({
      tabKey: key,
    });
  };

  return (
    <div className={styles.tabsWrap}>
      <Row
        type="flex"
        style={{
          width: '100%',
          border: '1px solid rgba(239,239,239,1)',
          marginBottom: 16,
        }}
        id="pdf-3"
      >
        {data.map((item: any, key) => {
          return (
            <Col
              key={key}
              style={{ width: '16.6%', position: 'relative' }}
              onClick={() => handleChangeTab(key)}
            >
              <div
                className={`${styles.moduleTabsWrap} ${
                  tabState.tabKey === key && styles.moduleTabsWrapActive
                }`}
              >
                <p
                  className={`${styles.tabTitle} ${
                    tabState.tabKey === key && styles.tabTitleActive
                  }`}
                >
                  {item.title}
                </p>
                <p className={styles.firstLine}>
                  <span
                    className={`${styles.errorColor}`}
                    style={{ color: item.firstLineNum.color }}
                  >
                    {item.firstLineNum.value}
                  </span>
                  {item.firstLineTxt}
                </p>
                <p className={styles.secondLine}>
                  <span
                    className={styles.errorColor}
                    style={{
                      color: item.secondLineNum && item.secondLineNum.color,
                    }}
                  >
                    {item.secondLineNum && item.secondLineNum.value}
                  </span>
                  {item.secondLineTxt}
                </p>
              </div>
              {data.length - 1 !== key && (
                <Divider
                  type="vertical"
                  style={{
                    position: 'absolute',
                    height: 60,
                    right: -8,
                    top: 30,
                  }}
                />
              )}
            </Col>
          );
        })}
      </Row>
      <div id="pdf-4">{data[tabState.tabKey].renderTabNode}</div>
    </div>
  );
};
export default ModuleTabs;
