import { Button, Col, Modal, Statistic } from 'antd';
import { CommonTabs, useStateReducer } from 'racc';
import { connect } from 'dva';
import React, { Fragment, useEffect } from 'react';
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

const PressureTestLive: React.FC<Props> = props => {
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
    stopReasons: null
  });

  const { location } = props;

  const { query } = location;
  const { id } = query;
  const { detailData, chartsInfo } = state;

  useEffect(() => {
    queryLiveBusinessActivity(id);
  }, []);
  useEffect(() => {
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
      sceneId: id
    });
  }, [state.isReload]);

  /**
   * @name 5s刷新页面
   */
  const reFresh = () => {
    if (!state.flag) {
      setTimeout(() => {
        setState({
          isReload: !state.isReload
        });
      }, 5000);
    }
  };

  /**
   * @name 获取压测实况详情
   */
  const queryLiveDetail = async value => {
    const {
      data: { data, success }
    } = await PressureTestReportService.queryLiveDetail({
      sceneId: value
    });
    if (success) {
      setState({
        detailData: data,
        startTime: data.startTime,
        stopReasons: data.stopReasons
      });
      if (data.taskStatus !== 0) {
        setState({
          flag: true,
          visible: true
        });
      }
    }
  };

  /**
   * @name 获取实况业务活动列表
   */
  const queryLiveBusinessActivity = async value => {
    const {
      data: { data, success }
    } = await PressureTestReportService.queryLiveBusinessActivity({
      sceneId: value
    });
    if (success) {
      setState({
        tabList: state.tabList.concat(
          data &&
            data.map(item => {
              return {
                label: item.businessActivityName,
                value: item.businessActivityId
              };
            })
        )
      });
    }
  };

  /**
   * @name 获取压测实况趋势信息
   */
  const queryLiveChartsInfo = async (sceneId, businessActivityId) => {
    const {
      data: { data, success }
    } = await PressureTestReportService.queryLiveLinkChartsInfo({
      sceneId,
      businessActivityId
    });
    if (success) {
      setState({
        chartsInfo: data
      });
    }
  };

  /**
   * @name 获取压测实况请求流量列表
   */
  const queryRequestList = async value => {
    const {
      data: { success, data }
    } = await PressureTestReportService.queryRequestList({
      ...value,
      current: 0,
      pageSize: 50
    });
    if (success) {
      setState({
        requestList: data
      });
    }
  };
  const headList = [
    {
      label: '开始时间',
      value: detailData.startTime
    },
    {
      label: '压测模式',
      value: TestMode[detailData.pressureType]
    },
    {
      label: '最大并发',
      value: detailData.concurrent
    },
    {
      label: '执行人',
      value: detailData.operateName
    }
  ];

  const summaryList = [
    {
      label: '警告',
      value: detailData.totalWarn,
      precision: 0,
      color: '#FE7D61',
      suffix: '次'
    },
    {
      label: '实际并发数',
      value: detailData.avgConcurrent
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
      )
    },
    {
      label: '平均RT',
      value: detailData.avgRt,
      precision: 2,
      suffix: 'ms'
    },
    {
      label: '成功率',
      value: detailData.successRate,
      precision: 2,
      suffix: '%'
    },
    {
      label: 'SA',
      value: detailData.sa,
      precision: 2,
      suffix: '%'
    }
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
      data: { data, success }
    } = await PressureTestReportService.stopPressureTest({
      sceneId: id
    });
    if (success) {
      setState({
        flag: true,
        visible: true
      });
    }
  };

  const tabData = [
    {
      title: '链路概览',
      component: (
        <Fragment>
          <LinkOverview dataSource={detailData.businessActivity} />
          <LinkCharts
            tabList={state.tabList}
            chartsInfo={chartsInfo}
            setState={setState}
            state={state}
            isLive={true}
          />
        </Fragment>
      )
    },
    {
      title: '容量水位',
      component: <WaterLevelLive isReload={state.isReload} id={detailData.id} />
    },
    {
      title: '请求流量明细',
      component: (
        <RequestDetailList
          dataSource={state.requestList ? state.requestList : []}
          reportId={detailData.id}
        />
      )
    }
  ];

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
                  border: 'none'
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
        leftWrap={
          <Col span={3}>
            <p className={styles.leftTitle}>计时 / 压测时间</p>
            <p className={styles.timeWrap}>
              <span className={styles.time}>{detailData.testTime}</span>/
              {detailData.testTotalTime}
            </p>
          </Col>}
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
        title={
          <div>
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
                lineHeight: '26px'
              }}
            >
              压测已结束
            </span>
          </div>
        }
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
          </AuthorityBtn>
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
                    marginBottom: 4
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
