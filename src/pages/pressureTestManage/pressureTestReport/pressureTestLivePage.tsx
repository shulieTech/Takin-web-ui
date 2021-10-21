import { Button, Col, Modal, Statistic, Alert } from 'antd';
import { CommonTabs, useStateReducer } from 'racc';
import { connect } from 'dva';
import React, { Fragment, useEffect, useState } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import CustomSkeleton from 'src/common/custom-skeleton';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import { BasePageLayout } from 'src/components/page-layout';
import router from 'umi/router';
import { TestMode } from '../pressureTestScene/enum';
import Header from './components/Header';
import LinkCharts from './components/LinkCharts';
import LinkOverview from './components/LinkOverview';
import RequestDetailList from './components/RequestDetailList';
import Summary from './components/Summary';
import WaterLevelLive from './components/WaterLevelLive';
import styles from './index.less';
import PressureTestReportService from './service';
import { getTakinAuthority } from 'src/utils/utils';
import { GraphData } from '@antv/g6';

interface State {
  isReload?: boolean;
  detailData: any;
  visible: boolean;
  tabList: any;
  chartsInfo: any;
  tabKey: 0;
  flag: boolean;
  requestList: any;
  startTime: any;
  stopReasons: any;
  graphData?: GraphData;
}

interface Props {
  location?: { query?: any };
  dictionaryMap?: any;
}

const btnAuthority: any =
  localStorage.getItem('trowebBtnResource') &&
  JSON.parse(localStorage.getItem('trowebBtnResource'));
const menuAuthority: any =
  localStorage.getItem('trowebUserResource') &&
  JSON.parse(localStorage.getItem('trowebUserResource'));

const PressureTestLive: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    detailData: {},
    visible: false,
    tabList: [{ label: '全局趋势', value: 0 }],
    chartsInfo: {},
    tabKey: 0,
    flag: false,
    requestList: null,
    startTime: null,
    stopReasons: null,
  });

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [ticker, setTicker] = useState(0);

  const { location } = props;

  const { query } = location;
  const { id } = query;
  const { detailData, chartsInfo } = state;

  useEffect(() => {
    queryLiveBusinessActivity(id);
  }, []);
  useEffect(() => {
    setTicker(ticker + 1);
    reFresh();
    queryLiveDetail(id);
    queryLiveChartsInfo(id, state.tabKey);
    queryRequestList({
      startTime:
        state.startTime &&
        Date.parse(
          new Date(state.startTime && state.startTime.replace(/-/g, '/'))
        ) !== 0 &&
        !isNaN(
          Date.parse(
            new Date(state.startTime && state.startTime.replace(/-/g, '/'))
          )
        )
          ? Date.parse(state.startTime && state.startTime.replace(/-/g, '/'))
          : null,
      sceneId: id,
    });
    if (ticker % 2 === 0) {
      // 10秒刷新一次链路图
      // queryReportGraphInfo(id, state.tabKey);
    }
  }, [state.isReload]);

  useEffect(() => {
    // 切换tab，立即刷新
    setState({ isReload: !state.isReload });
    setTicker(0);
  }, [state.tabKey]);

  /**
   * @name 5s刷新页面
   */
  const reFresh = () => {
    if (!state.flag) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setState({
            isReload: !state.isReload,
          });
        }, 5000)
      );
    }
  };

  /**
   * @name 获取压测实况详情
   */
  const queryLiveDetail = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryLiveDetail({
      sceneId: value,
    });
    if (success) {
      setState({
        detailData: data,
        startTime: data.startTime,
        stopReasons: data.stopReasons,
      });
      if (data.taskStatus !== 0) {
        setState({
          flag: true,
          visible: true,
        });
      }
    }
  };

  /**
   * @name 获取实况业务活动列表
   */
  const queryLiveBusinessActivity = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryLiveBusinessActivity({
      sceneId: value,
    });
    if (success) {
      setState({
        tabList: state.tabList.concat(
          data &&
            data.map((item) => {
              return {
                label: item.businessActivityName,
                value: item.businessActivityId,
              };
            })
        ),
      });
    }
  };

  /**
   * @name 获取压测实况趋势信息
   */
  const queryLiveChartsInfo = async (sceneId, businessActivityId) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryLiveLinkChartsInfo({
      sceneId,
      businessActivityId,
    });
    if (success) {
      setState({
        chartsInfo: data,
      });
    }
  };

  /**
   * @name 获取压测实况请求流量列表
   */
  const queryRequestList = async (value) => {
    const {
      data: { success, data },
    } = await PressureTestReportService.queryRequestList({
      ...value,
      current: 0,
      pageSize: 50,
    });
    if (success) {
      setState({
        requestList: data,
      });
    }
  };

  /**
   * @name 获取压测报告链路图信息
   */
  const queryReportGraphInfo = async (sceneId, businessActivityId) => {
    if (businessActivityId === 0) {
      return;
    }
    const {
      data: { data, success },
    } = await PressureTestReportService.getLiveGraphData({
      sceneId,
      businessActivityId,
    });
    if (success) {
      setState({
        graphData: data?.activity?.topology,
      });
    }
  };
  const headList = [
    {
      label: '开始时间',
      value: detailData.startTime,
    },
    {
      label: '压测模式',
      value: TestMode[detailData.pressureType],
    },
    {
      label: '最大并发',
      value: detailData.concurrent,
    },
    {
      label: '执行人',
      value: detailData.operateName,
      notShow: getTakinAuthority() === 'true' ? false : true // true：不展示，false或不配置：展示
    },
  ];

  const summaryList = [
    {
      label: '警告',
      value: detailData.totalWarn,
      precision: 0,
      color: '#FE7D61',
      suffix: '次',
    },
    {
      label: '实际并发数',
      value: detailData.avgConcurrent,
    },
    {
      label: '实际/目标TPS',
      precision: 2,
      render: () => (
        <Fragment>
          <Statistic
            style={{ display: 'inline-block' }}
            value={detailData.avgTps || 0}
            precision={0}
          />
          /
          <Statistic
            style={{ display: 'inline-block' }}
            value={detailData.tps || 0}
            precision={0}
          />
        </Fragment>
      ),
    },
    {
      label: '平均RT',
      value: detailData.avgRt,
      precision: 2,
      suffix: 'ms',
    },
    {
      label: '成功率',
      value: detailData.successRate,
      precision: 2,
      suffix: '%',
    },
    {
      label: 'SA',
      value: detailData.sa,
      precision: 2,
      suffix: '%',
    },
  ];

  /**
   * @name 跳转到报告详情
   */
  const handleOk = () => {
    router.push(
      `/pressureTestManage/pressureTestReport/details?id=${detailData.id}`
    );
  };

  /**
   * @name 跳转到压测场景列表
   */
  const handleCancel = () => {
    router.push(`/pressureTestManage/pressureTestScene`);
  };

  /**
   * @name 停止压测
   */
  const handleConfirm = async () => {
    const {
      data: { data, success },
    } = await PressureTestReportService.stopPressureTest({
      sceneId: id,
    });
    if (success) {
      setState({
        flag: true,
        visible: true,
      });
    }
  };

  const tabData = [
    {
      title: '链路概览',
      component: (
        <Fragment>
          <LinkOverview dataSource={detailData.businessActivity} />
          <Alert
            showIcon
            style={{ marginTop: 12 }}
            message="链路性能数据涉及大量数据计算与采集，链路数据显示可能存在一定延时（大概2分钟），您也可在后续压测报告中查看完整数据"
            closable
          />
          <LinkCharts
            isLive
            tabList={state.tabList}
            chartsInfo={chartsInfo}
            setState={setState}
            state={state}
            graphConfig={{
              freezedDrag: true,
              freezeExpand: true,
              freezeLabelSetting: true,
              tooltip: (
                <div>
                  TPS：包含所有业务活动中，在压测期间的平均值，每 10
                  秒刷新一次，单位次/秒；
                  <br />
                  RT：包含所有业务活动中，在压测期间的平均值，每 10
                  秒刷新一次，单位毫秒；
                  <br />
                  调用量：包含所有业务活动中，该上下游两个节点的调用量数据，取压测期间的累加值，每
                  10 秒刷新一次；
                  <br />
                  成功率：包含所有业务活动中，该上下游两个节点的调用成功率数据，取压测期间的平均值，每
                  10 秒刷新一次；
                </div>
              ),
            }}
            chartConfig={{
              tooltip: (
                <div>
                  TPS：包含所有业务活动中，在压测期间的平均值，每 5
                  秒刷新一次，单位次/秒；
                  <br />
                  RT：包含所有业务活动中，在压测期间的平均值，每 5
                  秒刷新一次，单位毫秒；
                  <br />
                  调用量：包含所有业务活动中，该上下游两个节点的调用量数据，取压测期间的累加值，每
                  5 秒刷新一次；
                  <br />
                  成功率：包含所有业务活动中，该上下游两个节点的调用成功率数据，取压测期间的平均值，每
                  5 秒刷新一次；
                  <br />
                  趋势图仅统计业务活动入口的数据，不代表链路图节点的数据。
                </div>
              ),
            }}
          />
        </Fragment>
      ),
    },
    {
      title: '容量水位',
      component: (
        <WaterLevelLive isReload={state.isReload} id={detailData.id} />
      ),
    },
    {
      title: '请求流量明细',
      component: (
        <RequestDetailList
          dataSource={state.requestList ? state.requestList : []}
          reportId={detailData.id}
        />
      ),
    },
  ];

  const modalTitle = (
    <div style={{ display: 'flex' }}>
      <CustomIcon
        color={state.stopReasons ? '#ED6047' : '#11BBD5'}
        imgName={state.stopReasons ? 'warning_icon' : 'info_icon'}
        imgWidth={15}
      />
      <span
        style={{
          fontSize: '16px',
          fontWeight: 600,
          marginLeft: 12,
          lineHeight: '26px',
        }}
      >
        压测已结束
      </span>
    </div>
  );

  const leftWrap = (
    <Col span={3}>
      <p className={styles.leftTitle}>计时 / 压测时间</p>
      <p className={styles.timeWrap}>
        <span className={styles.time}>{detailData.testTime}</span>/
        {detailData.testTotalTime}
      </p>
    </Col>
  );

  return JSON.stringify(state.detailData) !== '{}' ? (
    <BasePageLayout
      title={detailData.sceneName ? detailData.sceneName : '-'}
      extra={
        <Fragment>
          <AuthorityBtn
            isShow={
              btnAuthority &&
              btnAuthority.pressureTestManage_pressureTestScene_5_start_stop &&
              detailData &&
              detailData.canStartStop
            }
          >
            <CustomPopconfirm
              title="是否确认停止？"
              okColor="var(--FunctionalError-500)"
              okText="确认停止"
              onConfirm={() => handleConfirm()}
            >
              <Button
                type="danger"
                style={{
                  position: 'absolute',
                  top: -20,
                  right: 20,
                  background: '#FE7D61',
                  color: '#fff',
                  border: 'none',
                }}
              >
                停止压测
              </Button>
            </CustomPopconfirm>
          </AuthorityBtn>
        </Fragment>
      }
      extraPosition="top"
    >
      <Header list={headList} isExtra={true} />

      <Summary
        detailData={detailData}
        list={summaryList}
        style={{ marginTop: 24, marginBottom: 24 }}
        leftWrap={leftWrap}
      />
      <CommonTabs
        dataSource={tabData}
        tabsProps={{ destroyInactiveTabPane: true }}
        onRender={(item, index) => (
          <CommonTabs.TabPane key={index.toString()} tab={item.title}>
            {item.component}
          </CommonTabs.TabPane>
        )}
      />
      <Modal
        title={modalTitle}
        onCancel={handleCancel}
        visible={state.visible}
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="back" onClick={handleCancel}>
            稍后查看
          </Button>,
          <AuthorityBtn
            key="submit"
            isShow={
              menuAuthority &&
              menuAuthority.pressureTestManage_pressureTestReport
            }
          >
            <Button key="submit" type="primary" onClick={handleOk}>
              查看压测报告
            </Button>
          </AuthorityBtn>,
        ]}
      >
        <div>
          {state.stopReasons &&
            state.stopReasons.map((item, k) => {
              return (
                <p
                  key={k}
                  style={{
                    fontSize: '14px',
                    color: '#666666',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#666666' }}>
                    {item.type}
                  </span>
                  <span style={{ marginLeft: 4, marginRight: 4 }}>:</span>
                  <span style={{ fontSize: '14px', color: '#666666' }}>
                    {item.description}
                  </span>
                </p>
              );
            })}
          <p style={{ fontSize: '14px', color: '#666666' }}>
            报告生成中，请稍后···
          </p>
        </div>
      </Modal>
    </BasePageLayout>
  ) : (
    <CustomSkeleton />
  );
};
export default connect(({ common }) => ({ ...common }))(PressureTestLive);
