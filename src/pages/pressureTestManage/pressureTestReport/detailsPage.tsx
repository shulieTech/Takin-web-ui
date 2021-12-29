import { Alert, Button, Col, Icon, Row, Statistic } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import CustomSkeleton from 'src/common/custom-skeleton';
import EmptyNode from 'src/common/empty-node';
import { BasePageLayout } from 'src/components/page-layout';
import { getTakinAuthority } from 'src/utils/utils';
import { router } from 'umi';
import { TestMode } from '../pressureTestScene/enum';
import Header from './components/Header';
import ModuleTabs from './components/ModuleTabs';
import Summary from './components/Summary';
import styles from './index.less';
import MissingDataListModal from './modals/MissingDataListModal';
import PressureTestReportService from './service';
import { GraphData } from '@antv/g6';

interface State {
  isReload?: boolean;
  detailData: any;
  tabList: any;
  chartsInfo: any;
  tabKey: number;
  riskAppKey: number;
  riskAppName: string;
  reportCountData: any;
  failedCount: number;
  hasMissingData: number;
  graphData?: GraphData;
}
interface Props {
  location?: { query?: any };
}
const PressureTestReportDetail: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    detailData: {},
    tabList: [{ label: '全局趋势', value: 0 }],
    chartsInfo: {},
    tabKey: 0,
    /** 风险机器应用key */
    riskAppKey: 0,
    /** 风险机器应用明细 */
    riskAppName: null,
    reportCountData: null,
    failedCount: null,
    /** 是否漏数 */
    hasMissingData: null,
  });

  const { location } = props;
  const { query } = location;
  const { id } = query;
  const { detailData, reportCountData, hasMissingData } = state;

  useEffect(() => {
    queryReportBusinessActivity(id);
  }, []);

  useEffect(() => {
    queryReportDetail(id);
    // queryReportBusinessActivity(id);
    queryReportCount(id);
    queryRequestCount(id);
  }, [state.isReload]);

  useEffect(() => {
    queryReportChartsInfo(id, state.tabKey);
  }, [state.isReload, state.tabKey]);

  /**
   * @name 获取压测报告详情
   */
  const queryReportDetail = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryReportDetail({
      reportId: value,
    });
    if (success) {
      setState({
        detailData: data,
        hasMissingData:
          data && data.leakVerifyResult && data.leakVerifyResult.code,
      });
    }
  };

  /**
   * @name 获取压测报告汇总数据
   */
  const queryReportCount = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryReportCount({
      reportId: value,
    });
    if (success) {
      setState({
        reportCountData: data,
      });
    }
  };

  /**
   * @name 获取压测报告汇总流量数据
   */
  const queryRequestCount = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryRequestCount({
      reportId: value,
    });
    if (success) {
      setState({
        failedCount: data,
      });
    }
  };

  /**
   * @name 获取压测报告业务活动列表
   */
  const queryReportBusinessActivity = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryReportBusinessActivity({
      reportId: value,
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
   * @name 获取压测报告趋势信息
   */
  const queryReportChartsInfo = async (reportId, businessActivityId) => {
    const {
      data: {
        data: { activity, ...chartsInfo },
        success,
      },
    } = await PressureTestReportService.queryLinkChartsInfo({
      reportId,
      businessActivityId,
    });
    if (success) {
      setState({
        chartsInfo,
        graphData: activity?.topology || { nodes: [], edges: [] },
      });
    }
  };

  const headList = [
    { label: '报告ID', value: detailData.id },
    {
      label: '压测时长',
      value: detailData.testTotalTime,
    },
    {
      label: '压测模式',
      value: TestMode[detailData.pressureType],
    },
    {
      label: '开始时间',
      value: detailData.startTime,
    },
    {
      label: '消耗流量',
      value: (
        <span className={styles.flowValue}>
          <Statistic
            style={{
              display: 'inline-block',
              padding: 0,
            }}
            value={detailData.amount}
            suffix="vum"
          />
        </span>
      ),
      notShow: getTakinAuthority() === 'true' ? false : true // true：不展示，false或不配置：展示
    },
    {
      label: '执行人',
      value: detailData.operateName,
      notShow: getTakinAuthority() === 'true' ? false : true // true：不展示，false或不配置：展示
    },
  ];

  const summaryList = [
    {
      label: '请求总数',
      value: detailData.totalRequest,
      precision: 0,
    },
    {
      label: '最大并发',
      value: detailData.concurrent,
      precision: 0,
    },
    {
      label: '实际并发数',
      value: detailData.avgConcurrent,
      precision: 2,
    },
    {
      label: '实际/目标TPS',
      value: `${detailData.avgTps}/${detailData.tps}`,
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

  const extra = (
    <Button
      type="primary"
      onClick={() => window.open(`/#/analysisManage?type=report&reportId=${id}`)}
    >
      查看性能分析报告
    </Button>
  );

  return JSON.stringify(state.detailData) !== '{}' &&
    JSON.stringify(state.chartsInfo) !== '{}' &&
    state.detailData.taskStatus === 2 ? (
    <div id="page" style={{ overflow: 'scroll' }}>
      {hasMissingData === 1 && (
        <div style={{ padding: '16px 16px 0px', position: 'relative' }}>
          <Alert
            message={<p>本次压测存在数据泄露，请尽快确认 </p>}
            type="error"
            showIcon
          />
          <div style={{ position: 'absolute', top: 25, left: 250 }}>
            <MissingDataListModal
              reportId={id}
              hasMissingData={1}
              btnText="查看详情"
            />
          </div>
        </div>
      )}
      {(hasMissingData === 2 || hasMissingData === 3) && (
        <div style={{ padding: '16px 16px 0px', position: 'relative' }}>
          <Alert
            message={<p>数据验证存在执行异常，请尽快查看 </p>}
            type="warning"
            showIcon
          />
          <div style={{ position: 'absolute', top: 25, left: 250 }}>
            <MissingDataListModal
              reportId={id}
              hasMissingData={hasMissingData}
              btnText="查看详情"
            />
          </div>
        </div>
      )}

      <BasePageLayout
        style={{ padding: 8 }}
        extraPosition="top"
        extra={extra}
        title={<div style={{ position: 'relative' }}>
            <span style={{ fontSize: 20 }}>
              {detailData.sceneName ? detailData.sceneName : '-'}
            </span>
            {hasMissingData === 0 && (
              <span
                style={{
                  display: 'inline-block',
                  color: '#666666',
                  padding: '6px 8px',
                  background: '#F2F2F2',
                  borderRadius: '4px',
                  float: 'right',
                }}
              >
                <Icon type="exclamation-circle" />
                <span style={{ marginRight: 16, marginLeft: 8 }}>无漏数</span>
                <MissingDataListModal
                  reportId={id}
                  hasMissingData={0}
                  btnText="查看详情"
                />
              </span>
            )}
          </div>}
      >
        {/* <Button onClick={() => exportPdf()}>导出PDF</Button> */}
        <Header list={headList} isExtra={false} />
        <Summary
          id={id}
          detailData={detailData}
          list={summaryList}
          style={{
            marginTop: 24,
            marginBottom: 24,
            background: detailData.conclusion === 1 ? '#75D0DD' : '#F58D76',
          }}
          leftWrap={<Col span={4}>
              <Row type="flex" align="middle">
                <Col>
                  <img
                    style={{ width: 40 }}
                    src={require(`./../../../assets/${
                      detailData.conclusion === 1 ? 'success_icon' : 'fail_icon'
                    }.png`)}
                  />
                </Col>
                <Col style={{ marginLeft: 8 }}>
                  <p
                    style={{
                      fontSize: 20,
                      color: '#fff',
                    }}
                  >
                    {detailData.conclusion === 1 ? '压测通过' : '压测不通过'}
                  </p>
                  {detailData.conclusion === 0 && (
                    <p style={{ color: '#fff' }}>
                      {detailData.conclusionRemark}
                    </p>
                  )}
                </Col>
              </Row>
            </Col>}
        />
        <ModuleTabs
          id={id}
          failedCount={state.failedCount}
          detailData={detailData}
          reportCountData={reportCountData}
          state={state}
          setState={setState}
        />
      </BasePageLayout>
    </div>
  ) : JSON.stringify(state.detailData) !== '{}' &&
    JSON.stringify(state.chartsInfo) !== '{}' &&
    state.detailData.taskStatus === 1 ? (
    <div style={{ marginTop: 200 }}>
      <EmptyNode
        title="报告生成中..."
        extra={<div style={{ marginTop: 16 }}>
            <Button
              onClick={() => {
                setState({
                  isReload: !state.isReload,
                });
              }}
            >
              刷新
            </Button>
          </div>}
      />
    </div>
  ) : (
    <CustomSkeleton />
  );
};

export default PressureTestReportDetail;
