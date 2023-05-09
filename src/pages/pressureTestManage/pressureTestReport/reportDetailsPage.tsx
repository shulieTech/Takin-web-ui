/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Button,
  Col,
  Descriptions,
  Dropdown,
  Icon,
  Menu,
  Popover,
  Row,
  Statistic,
} from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { Fragment, useEffect, useState } from 'react';
import CustomSkeleton from 'src/common/custom-skeleton';
import EmptyNode from 'src/common/empty-node';
import { BasePageLayout } from 'src/components/page-layout';
import { getTakinAuthority, checkMenuByPath } from 'src/utils/utils';
import { router } from 'umi';
import { TestMode } from '../pressureTestScene/enum';
import Header from './components/Header';
import ModuleTabs from './components/ModuleTabs';
import Summary from './components/Summary';
import styles from './index.less';
import MissingDataListModal from './modals/MissingDataListModal';
import PressureTestReportService from './service';
import { GraphData } from '@antv/g6';
import downloadFile from 'src/utils/downloadFile';
import PressTestMachines from './components/PressTestMachines';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CustomTable from 'src/components/custom-table';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import GraphNode from 'src/components/g6-graph/GraphNode';
import CompareNodeModal from './components/CompareNodeModal';
import BarChart from './components/BarCharts';
import LineChartWrap from './components/LineChartWrap';
import RequestDetailModal from './components/RequestDetailModal';
import TrendChart from './components/TrendCharts';

interface State {
  isReload?: boolean;
  detailData: any;
  tabList: any;
  chartsInfo: any;
  chartsThreadInfo: any;
  tabKey: number;
  riskAppKey: number;
  riskAppName: string;
  reportCountData: any;
  failedCount: number; 
  hasMissingData: number;
  graphData?: GraphData;
  tenantList: any;
  allProblemCheckData: any;
  
  bottleneckList: any;
  riskMachineList: any;
  messageCodeList: any;
  allMessageCodeList: any;
  allMessageDetailList: any;
  allCompareData: any;
  allTopologyData: any;
  performanceList: any;
  instancePerformanceList: any;
  trendData: any;
  statusCode: any;
  compareReportId: any;
}
interface Props {
  location?: { query?: any };
}

declare var window;

const ReportDetails: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>(
    {
      isReload: false,
      detailData: {},
      tabList: [],
      chartsInfo: {},
      chartsThreadInfo: {},
      tabKey: null,
      /** 风险机器应用key */
      riskAppKey: 0,
      /** 风险机器应用明细 */
      riskAppName: null,
      reportCountData: null,
      failedCount: null,
      /** 是否漏数 */
      hasMissingData: null,
      tenantList: [],
      allProblemCheckData: [],

      bottleneckList: [],
      riskMachineList: [],
      messageCodeList: [],
      allMessageCodeList: [],
      allMessageDetailList: [],
      allCompareData: [],
      allTopologyData: [],
      performanceList: [],
      instancePerformanceList: [],
      trendData: [],
      compareReportId: undefined,
      statusCode: undefined
    });

  const { location } = props;
  const { query } = location;
  const { id } = query;
  const { detailData } = state;

  useEffect(() => {
    queryVltReportDetail(id);
    queryVltBottleneck(id);
    queryVlRiskMachine(id);
    queryVltPerformanceList(id);
    queryVltInstancePerformanceList(id);
    queryTrendData(id);
  }, []);

  // useEffect(() => {
  //   queryReportDetail(id);
  //   // queryReportBusinessActivity(id);
  //   queryReportCount(id);
  //   queryRequestCount(id);
  // }, [state.isReload]);

  // useEffect(() => {
  //   // 数据校准中时5s刷新一次
  //   if (detailData?.calibration === 1) {
  //     const ticker = setInterval(() => {
  //       queryReportDetail(id);
  //     }, 5000);
  //     return () => clearInterval(ticker);
  //   }
  // }, [detailData?.calibration]);

  const tenantList = async (s) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.monitor({
      sceneId: s,
    });
    if (success) {
      setState({
        tenantList: data,
      });
    }
  };
  // useEffect(() => {
  //   if (state.tabKey) {
  //     queryReportChartsInfo(id, state.tabKey);
  //     queryTrendByThreadChartsInfo(id, state.tabKey);
  //   }
  // }, [state.isReload, state.tabKey]);

  /**
   * @name 获取压测报告详情
   */
  const queryVltReportDetail = async (value) => {
    const {
    data: { data, success },
  } = await PressureTestReportService.queryVltReportDetail({
    reportId: value,
  });
    if (success) {
    // 判断是否有国寿竞赛这个菜单再调该接口
      if (checkMenuByPath('/competition')) {
        tenantList(data.sceneId);
      }
      setState({
        detailData: data
      });
      queryAllMessageCode(data);
      queryAllCompareData(data, [data?.reportId]);
      queryAllTopologyData(data);
      queryAllProblemCheckData(data);
    }
  };

  /**
   * @name 获取瓶颈接口列表
   */
  const queryVltBottleneck = async (value) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryVltBottleneck({
        reportId: value,
        current: 0,
        pageSize: 1000
      });
    if (success) {
      setState({
        bottleneckList: data,
      });
    }
  };

  /**
   * @name 获取风险容器列表
   */
  const queryVlRiskMachine = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryVlRiskMachine({
      reportId: value,
      current: 0,
      pageSize: 1000
    });
    if (success) {
      setState({
        riskMachineList: data,
      });
    }
  };

  /**
   * @name 获取应用性能列表
   */
  const queryVltPerformanceList = async (value) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryVltPerformanceList({
        reportId: value,
        // current:0,
        // pageSize:1000
      });
    if (success) {
      setState({
        performanceList: data
      });
    }
  };

  /**
   * @name 获取应用实例性能列表
   */
  const queryVltInstancePerformanceList = async (value) => {
    const {
          data: { data, success },
        } = await PressureTestReportService.queryVltInstancePerformanceList({
          reportId: value,
          // current:0,
          // pageSize:1000
        });
    if (success) {
      setState({
        instancePerformanceList: data
      });
    }
  };

  /**
   * @name 获取状态码列表
   */
  const queryVlMessageCode = async (serviceName, startTime, endTime, jobId) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryVlMessageCode({
        serviceName,
        startTime,
        endTime,
        jobId
      });
    if (success) {
      return data;
    }
  };

  /**
   * @name 获取报文请求明细
   */
  const queryVlMessageDetail = async (serviceName, startTime, endTime, statusCode, jobId) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryVlMessageDetail({
        serviceName,
        startTime,
        endTime,
        statusCode,
        jobId
      });
    if (success) {
      return data;
    }
  };

  /**
   * @name 获取业务活动拓扑图
   */
  const queryVlTopologyData = async (activityId) => {
    const {
          data: { data, success },
        } = await PressureTestReportService.queryVlTopologyData({
          activityId
          // sceneId,
          // startTime,
          // endTime,
          // reportId,
          // xpathMd5
        });
    if (success) {
      return data;
    }
  };

  /**
   * @name 获取对比报告
   */
  const queryVlCompare = async (reportIds, businessActivityId) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryVlCompare({
        reportIds,
        businessActivityId
      });
    if (success) {
      return data;
    }
  };

  /**
   * @name 获取问题诊断
   */
  const queryVlProblemCheck = async (serviceName, startTime, endTime) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryProblemCheck({
        serviceName,
        startTime,
        endTime
      });
    if (success) {
      return data;
    }
  };

  /**
   * @name 获取应用趋势图
   */
  const queryTrendData = async (value) => {
    const {
        data: { data, success },
      } = await PressureTestReportService.queryTrendData({
        reportId: value,
      });
    if (success) {
      setState({
        trendData: data
      });
    }
  };

  const queryAllMessageCode = async (detailDataValue) => {
    await Promise.all(
        detailDataValue?.businessActivities?.map((item) =>
          queryVlMessageCode(item?.serviceName, detailDataValue?.startTime, detailDataValue?.endTime, detailDataValue?.jobId)
        )
      ).then((res) => {
        const codeArr = [];
        res?.map((item, k) => {
          codeArr.push(item?.[0]?.statusCode);
        });
      
        setState({
          allMessageCodeList: res,
          statusCode: codeArr  
        });
    
        // 使用第一次请求的结果 res 作为第二次请求的参数
        Promise.all(
          detailDataValue?.businessActivities?.map((item, k) =>
            queryVlMessageDetail(
              item?.serviceName,
              detailDataValue?.startTime,
              detailDataValue?.endTime,
              res?.[k]?.[0]?.statusCode,
              detailDataValue?.jobId,
            )
          )
        ).then((res1) => {
          setState({
            allMessageDetailList: res1,
          });
        });
      });
  };

    /**
     * 
     * @name 获取压测报告比对
     */
  const queryAllCompareData = async (detailDataValue, reportIds) => {
    await Promise.all(
        detailDataValue?.businessActivities?.map((item) =>
        queryVlCompare(reportIds, item?.businessActivityId)
        )
      ).then((res) => {
        setState({
          allCompareData: res,
        });
      });
  };

    /**
     * 
     * @name 获取全部问题诊断
     */
  const queryAllProblemCheckData = async (detailDataValue) => {
    await Promise.all(
            detailDataValue?.businessActivities?.map((item) =>
            queryVlProblemCheck(item?.serviceName, detailDataValue?.startTime, detailDataValue?.endTime)
            )
          ).then((res) => {
            setState({
              allProblemCheckData: res,
            });
          });
  };

    /**
     * 
     * @name 获取业务活动拓扑图
     */
  const queryAllTopologyData = async (detailDataValue) => {
    await Promise.all(
        detailDataValue?.businessActivities?.map((item) =>
        queryVlTopologyData(item?.businessActivityId)
        )
      ).then((res) => {
        setState({
          allTopologyData: res
        });
      });
  };

  const handleChangeReportId = (value) => {
    setState({
      compareReportId: value
    });
    queryAllCompareData(state?.detailData, value ? [state?.detailData?.reportId, value] : [state?.detailData?.reportId]);
  };

  /**
   * @name 获取压测报告业务活动列表
   */
  const queryReportBusinessActivity = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryBusinessActivityTree({
      reportId: value,
    });
    if (success) {
      setState({
        tabList: data,
        tabKey: data && data[0].xpathMd5,
      });
    }
  };

  const contentRef = React.createRef();
  const exportToPDF = async () => {
    const contentCanvas = await html2canvas(contentRef.current, {
      backgroundColor: 'white', // 通过 html2canvas 配置选项设置背景颜色为白色
    });
    const contentWidth = contentCanvas.width;
    const contentHeight = contentCanvas.height;

    const a4WidthInPixels = 595.28;
    const scaleFactor = a4WidthInPixels / contentWidth;
    const pdfHeight = contentHeight * scaleFactor;
    const pdf = new jsPDF('p', 'pt', [a4WidthInPixels, pdfHeight]);
    pdf.addImage(contentCanvas.toDataURL('image/png'), 'PNG', 0, 0, a4WidthInPixels, pdfHeight);
    pdf.save('exported-file.pdf');
  };

  const handleChangeCode = async (serviceName, startTime, endTime, statusCode, jobId, key) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryVlMessageDetail({
      serviceName,
      startTime,
      endTime,
      statusCode,
      jobId
    });
    if (success) {
      setState({
        allMessageDetailList: state?.allMessageDetailList?.map((item, k) => {
          if (key === k) {
            return data;
          }
          return item;
        }),
        statusCode: state?.statusCode?.map((item, k2) => {
          if (k2 === key) {
            return statusCode;
          }
          return item;
        })
      });
    }
  };

  const summaryList = [
    {
      label: '请求总数',
      value: detailData.totalRequest,
      precision: 0,
    },
    {
      label: '最大并发',
      value: detailData.maxConcurrent,
      precision: 2,
    },
    {
      label: '平均并发数',
      value: detailData.avgConcurrent,
      precision: 2,
    },
    {
      label: '实际/目标TPS',
      value: `${detailData.realTps}/${detailData.targetTps}`,
      precision: 2,
      render: () => (
        <Fragment>
          <Statistic
            style={{ display: 'inline-block' }}
            value={detailData.realTps || 0}
            precision={0}
          />
          /
          <Statistic
            style={{ display: 'inline-block' }}
            value={detailData.targetTps || 0}
            precision={0}
          />
        </Fragment>
      ),
    },
    {
      label: '最大TPS',
      value: detailData.maxTps,
      precision: 0,
    },
    {
      label: '平均RT',
      value: detailData.avgRt,
      precision: 2,
      suffix: 'ms',
    },
    {
      label: '最大RT',
      value: detailData.maxRt,
      precision: 0,
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

  // 数据校准中不显示统计数据
  if (detailData?.calibration === 1) {
    const checkTxt = (
      <span
        style={{
          fontSize: 12,
          color: '#999',
          fontWeight: 'normal',
          lineHeight: '40px',
        }}
      >
        校准中
      </span>
    );
    // summaryList = summaryList.map((x) => ({
    //   ...x,
    //   value: 0,
    //   render: () =>
    //     x.label === '实际/目标TPS' ? (
    //       <>
    //         {checkTxt}/{detailData.tps || 0}
    //       </>
    //     ) : (
    //       checkTxt
    //     ),
    //   precision: 0,
    //   suffix: undefined,
    // }));
  }

  const extra = (
    <>
      <Button onClick={exportToPDF}>导出为PDF</Button>   
    </>
  );

  return JSON.stringify(state.detailData) !== '{}'  ? (
    <div id="page" style={{ overflow: 'auto' }}> 
    <div id="content-to-export">
      <BasePageLayout
        style={{ padding: 8 }}
        extraPosition="top"
        extra={extra}
        title={
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: 20 }}>
              {detailData.sceneName ? detailData.sceneName : '-'}
            </span>   
          </div>}
      >
         <div 
           ref={contentRef} 
           id="content-to-export"  
           style={{
             padding: '20px'
           }}>
        <Summary
          id={id}
          detailData={detailData}
          list={summaryList}
          style={{
            marginTop: 24,
            marginBottom: 24,
            background: detailData.conclusion === 1 ? '#75D0DD' : '#F58D76',
          }}
          leftWrap={
            <Col span={4}>
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
        <div className={styles.detailCardTitle}>
          问题诊断
          {detailData?.businessActivities?.map((item, k) => {
            return  <div key={k}>
              <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex" justify="space-between">
                <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }}/>{item?.businessActivityName}</Col>
              </Row>
              <CustomTable style={{ marginTop: 8 }} columns={getproblemCheckColumns()} dataSource={state?.allProblemCheckData?.[k] || []}/> 
            </div>; 
          })}
         
        </div>
         {/* <div className={styles.detailCardWarp}>
            <div className={styles.detailCardListTitle}>瓶颈接口</div>
            <CustomTable style={{ marginTop: 8 }} columns={getBottleneckColumns()} dataSource={state?.bottleneckList || []}/>
        </div> */}
        <div className={styles.detailCardWarp} >
            <div className={styles.detailCardListTitle}>风险容器</div>
            <CustomTable style={{ marginTop: 8 }} columns={getRiskColumns()} dataSource={state?.riskMachineList || []}/>
        </div>
        <div>
            <div className={styles.detailCardTitle}>
                业务活动对比
                <div style={{ float: 'right' }}>
                    <span style={{ padding: '5px 12px', border: '1px solid #eef0f2', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>{`压测报告${detailData?.reportId}`}（当前）</span>
                    <span style={{ margin: '0 8px' }}>🆚</span>
                    <CommonSelect 
                      onChange={handleChangeReportId} 
                      placeholder="请选择要对比的压测报告" 
                      style={{ width: 400 }} 
                      dataSource={detailData?.reports?.filter((item) => { if (item?.reportId !== detailData?.reportId) {return item; } })?.map((item2) => {
                        return { label: `压测报告${item2?.reportId}（并发数）${item2?.maxConcurrent},${item2?.startTime}`, value: item2?.reportId };
                      })}/>
                </div>
            </div>
            {detailData?.businessActivities?.map((item, k) => {
              return  <div key={k}>
              <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex" justify="space-between">
                <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }}/>{item?.businessActivityName}</Col>
                <Col>
                <CompareNodeModal activityId={item?.businessActivityId} activityName={item?.businessActivityName} btnText="查看节点对比" reportIds={state?.compareReportId ? [state?.detailData?.reportId, state?.compareReportId] : [state?.detailData?.reportId]}/>
                
                </Col>
              </Row>
              <div style={{  height: 500 }} >
              <GraphNode
                graphKey={state?.allTopologyData?.[k]?.activityId}
                graphData={state?.allTopologyData?.[k]?.topology}
                tooltip={
                  <div>
                    调用量：包含所有业务活动的调用量数据，取最近 5分钟的累加值；
                    <br />
                    成功率：包含所有业务活动的成功率数据，取最近
                    5分钟的平均成功率；
                    <br />
                    TPS：包含所有业务活动的TPS数据，取最近 5分钟的平均TPS,
                    单位次/秒；
                    <br />
                    RT：包含所有业务活动的RT数据，取最近 5分钟的平均RT,
                    单位毫秒；
                    <br />
                    延迟：链路性能数据涉及大量数据计算与采集，数据存在一定延迟，大概2分钟左右。
                  </div>
                }
              />
        
          </div>
              <div className={styles.detailCardWarp}>
                <div className={styles.detailCardListTitle}>性能指标明细</div>
                  <CustomTable style={{ marginTop: 8 }} columns={getIndexColumns()} dataSource={state?.allCompareData?.[k]?.targetData || []}/>
              </div>
              <div className={styles.detailCardWarp}>
                <div className={styles.detailCardListTitle}>RT分位明细</div>
                  <CustomTable style={{ marginTop: 8 }} columns={getRtColumns()} dataSource={state?.allCompareData?.[k]?.rtData || []}/>
                </div>
                <BarChart data={state?.allCompareData?.[k]?.columnarData || []}/>
                <LineChartWrap data={state?.allCompareData?.[k]?.trendData || []}/> 
            </div>; 
            })}
        </div>

        <div className={styles.detailCardTitle}>
          应用性能
          <div className={styles.detailCardWarp}>
            <CustomTable style={{ marginTop: 8 }} columns={getAppPerformanceColumns()} dataSource={state?.performanceList || []}/>
            <CustomTable style={{ marginTop: 8 }} columns={getAppInstancePerformanceColumns()} dataSource={state?.instancePerformanceList || []}/>
          </div>   
        </div>
        <div className={styles.detailCardTitle}>
          请求报文
          {detailData?.businessActivities?.map((item, k) => {
            return <div key={k}>
              <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex" justify="space-between">
              <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }}/>{item?.businessActivityName || '-'}</Col>
              <Col>
                <CommonSelect 
                onChange={(value) => handleChangeCode(item?.serviceName,
              detailData?.startTime,
              detailData?.endTime,
              value,
              detailData?.jobId, k)} 
              allowClear={false} value={state?.statusCode?.[k]} style={{ width: 200 }} dataSource={state?.allMessageCodeList?.[k]?.map((item) => {return { label: item?.statusName, value: item?.statusCode }; })}/></Col>
          </Row>
          <Descriptions bordered size="small">
            <Descriptions.Item label="服务入口">{item?.serviceName}</Descriptions.Item>
            <Descriptions.Item label="请求方式">{item?.requestMethod}</Descriptions.Item>
            <Descriptions.Item label="Trace ID">（{state?.allMessageDetailList?.[k]?.cost}ms）
                <RequestDetailModal
                  btnText={state?.allMessageDetailList?.[k]?.traceId}
                  traceId={state?.allMessageDetailList?.[k]?.traceId}
              /></Descriptions.Item>
            <Descriptions.Item label="请求头"  span={3}>{state?.allMessageDetailList?.[k]?.requestHeader || '-'}</Descriptions.Item>
            <Descriptions.Item label="请求体" span={3}>
            {state?.allMessageDetailList?.[k]?.request}
             </Descriptions.Item>  
             <Descriptions.Item label="响应头"  span={3}>{state?.allMessageDetailList?.[k]?.responseHeader || '-'}</Descriptions.Item>
            <Descriptions.Item label="响应体" span={3}>
            {state?.allMessageDetailList?.[k]?.response}
             </Descriptions.Item>  
          </Descriptions>
              </div>;
          })}
          
        </div>
        <div className={styles.detailCardTitle}>
          趋势图
          {state?.trendData?.map((item, k) => {
            return <div key={k}>
              <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex">
              <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }}/>{`${item?.applicationName}|${item?.agentId}`}</Col>
             </Row>
             <TrendChart data={item?.tpsTarget}/>
              </div>;
          })}
        </div>
        </div>
       
      </BasePageLayout>
  </div>
    </div>
  ) : JSON.stringify(state.detailData) !== '{}' &&
    JSON.stringify(state.chartsInfo) !== '{}' &&
    state.detailData.taskStatus === 1 ? (
    <div style={{ marginTop: 200 }}>
      <EmptyNode
        title="报告生成中..."
        extra={
          <div style={{ marginTop: 16 }}>
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

export default ReportDetails;

const getBottleneckColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '排名',
      dataIndex: 'rank'
    },
    {
      ...customColumnProps,
      title: '应用',
      dataIndex: 'applicationName'
    }, {
      ...customColumnProps,
      title: '接口',
      dataIndex: 'interfaceName'
    },
    {
      ...customColumnProps,
      title: '平均TPS',
      dataIndex: 'avgTps'
    },
    {
      ...customColumnProps,
      title: '最小TPS',
      dataIndex: 'minTps'
    }, 
    {
      ...customColumnProps,
      title: '最大TPS',
      dataIndex: 'maxTps'
    },
    {
      ...customColumnProps,
      title: '平均RT',
      dataIndex: 'avgRt'
    },
    {
      ...customColumnProps,
      title: '最小RT',
      dataIndex: 'minRt'
    }, {
      ...customColumnProps,
      title: '最大RT',
      dataIndex: 'maxRt'
    },
    {
      ...customColumnProps,
      title: '成功率',
      dataIndex: 'successRate'
    }
  ];
};

const getRiskColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '应用',
      dataIndex: 'appName'
    },
    {
      ...customColumnProps,
      title: '实例ID',
      dataIndex: 'agentId'
    }, {
      ...customColumnProps,
      title: '风险描述',
      dataIndex: 'riskContent'
    }, 
  ];
};

const getIndexColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '报告ID',
      dataIndex: 'reportId'
    },
    {
      ...customColumnProps,
      title: '压测时长',
      dataIndex: 'pressureTestTime'
    }, 
    {
      ...customColumnProps,
      title: '请求数',
      dataIndex: 'totalRequest'
    },
    {
      ...customColumnProps,
      title: '并发数',
      dataIndex: 'concurrent'
    },
    {
      ...customColumnProps,
      title: '平均TPS',
      dataIndex: 'avgTps'
    }, 
    {
      ...customColumnProps,
      title: '最大TPS',
      dataIndex: 'maxTps'
    },
    {
      ...customColumnProps,
      title: '最小TPS',
      dataIndex: 'minTps'
    },
    {
      ...customColumnProps,
      title: 'SA',
      dataIndex: 'sa',
      render: (text) => {
        return <span>{text}%</span>;
      }
    },
    {
      ...customColumnProps,
      title: '成功率',
      dataIndex: 'successRate',
      render: (text) => {
        return <span>{text}%</span>;
      }
    },
    {
      ...customColumnProps,
      title: '压测时间',
      dataIndex: 'startTime'
    }
  ];
};

const getRtColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '报告ID',
      dataIndex: 'reportId'
    },
    {
      ...customColumnProps,
      title: '压测时长',
      dataIndex: 'pressureTestTime'
    },
    {
      ...customColumnProps,
      title: '平均RT（ms）',
      dataIndex: 'avgRt'
    },
    {
      ...customColumnProps,
      title: '最大RT（ms）',
      dataIndex: 'maxRt'
    }, 
    {
      ...customColumnProps,
      title: '最小RT（ms）',
      dataIndex: 'minRt'
    },
    {
      ...customColumnProps,
      title: '50分位',
      dataIndex: 'rt50'
    }, 
    {
      ...customColumnProps,
      title: '75分位',
      dataIndex: 'rt75'
    },
    {
      ...customColumnProps,
      title: '90分位',
      dataIndex: 'rt90'
    },
    {
      ...customColumnProps,
      title: '95分位',
      dataIndex: 'rt95'
    }, 
    {
      ...customColumnProps,
      title: '99分位',
      dataIndex: 'rt99'
    }
  ];
};
  
const getAppPerformanceColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '应用名称',
      dataIndex: 'appName',
      width: 200
    },
    {
      ...customColumnProps,
      title: '请求数',
      dataIndex: 'totalRequest'
    }, {
      ...customColumnProps,
      title: '平均TPS',
      dataIndex: 'avgTps'
    },
    {
      ...customColumnProps,
      title: '平均RT（ms)',
      dataIndex: 'avgRt'
    },
    {
      ...customColumnProps,
      title: '最大RT（ms）',
      dataIndex: 'maxRt'
    }, 
    {
      ...customColumnProps,
      title: '最小RT（ms）',
      dataIndex: 'minRt'
    },
    {
      ...customColumnProps,
      title: '成功率',
      dataIndex: 'successRate',
      render: (text) => {
        return <span>{text}%</span>;
      }
    },
    {
      ...customColumnProps,
      title: 'SA',
      dataIndex: 'sa',
      render: (text) => {
        return <span>{text}%</span>;
      }
    }, 
    {
      ...customColumnProps,
      title: '压测时间',
      dataIndex: 'startTime'
    }
  ];
}; 

const getAppInstancePerformanceColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '应用名称',
      dataIndex: 'appName'
    },
    {
      ...customColumnProps,
      title: '实例ID',
      dataIndex: 'instanceName'
    }, {
      ...customColumnProps,
      title: 'CPU平均利用率',
      dataIndex: 'avgCpuUsageRate',
      render: (text) => {
        return <span>{text}%</span>;
      }

    },
    {
      ...customColumnProps,
      title: '内存平均利用率',
      dataIndex: 'avgMemUsageRate',
      render: (text) => {
        return <span>{text}%</span>;
      }
    },
    {
      ...customColumnProps,
      title: '磁盘I/O等待率',
      dataIndex: 'avgDiskIoWaitRate'
    }, 
    {
      ...customColumnProps,
      title: '网络宽带利用率',
      dataIndex: 'avgNetUsageRate'
    },
    {
      ...customColumnProps,
      title: 'GC次数',
      dataIndex: 'gcCount'
    },
    {
      ...customColumnProps,
      title: 'GC平均耗时（ms）',
      dataIndex: 'gcCost'
    }, 
    {
      ...customColumnProps,
      title: '平均TPS',
      dataIndex: 'avgTps'
    }
  ];
};

const getproblemCheckColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '风险序号',
      dataIndex: 'seqNo'
    },
    {
      ...customColumnProps,
      title: '节点ID',
      dataIndex: 'nodeId'
    }, {
      ...customColumnProps,
      title: '节点名称',
      dataIndex: 'nodeName'
    },
    {
      ...customColumnProps,
      title: '技术风险名称',
      dataIndex: 'techRiskName'
    },
    {
      ...customColumnProps,
      title: '诊断结果',
      dataIndex: 'checkResult'
    }, 
    {
      ...customColumnProps,
      title: '当前值',
      dataIndex: 'currentValue'
    },
    {
      ...customColumnProps,
      title: '应用名称',
      dataIndex: 'appName'
    }
  ];
};
