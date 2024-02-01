/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Descriptions,
  Row,
  Statistic,
  Typography,
  message,
} from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { Fragment, useEffect, useState } from 'react';
import CustomSkeleton from 'src/common/custom-skeleton';
import EmptyNode from 'src/common/empty-node';
import { BasePageLayout } from 'src/components/page-layout';
import { checkMenuByPath } from 'src/utils/utils';
import Summary from './components/Summary';
import styles from './index.less';
import PressureTestReportService from './service';
import { Graph, GraphData } from '@antv/g6';
import { NodeBean } from 'src/pages/businessActivity/enum';
import TrendChart from './components/TrendCharts';
import CustomTable from 'src/components/custom-table';
import BarChart from './components/BarCharts';
import LineChartWrap from './components/LineChartWrap';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CompareNodeModal from './components/CompareNodeModal';
import GraphNode from 'src/components/g6-graph-report/GraphNode';
import { Link } from 'umi';
import moment from 'moment';
import AppTrendData from './components/AppTrendData';
import RequestDetailModal from './components/RequestDetailModal';

interface State {
  isReload?: boolean;
  detailData: any;
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
  appTrendData: any;
  statusCode: any;
  compareReportId: any;

  tabList: any;
  chartsInfo: any;
  tabKey: number;
  riskAppKey: number;
  riskAppName: string;
  reportCountData: any;
  failedCount: number;
  hasMissingData: number;
  graphData?: GraphData;
  tenantList: any;

  baseInfoVisible: boolean;
  infoBarVisible: boolean;
  nodeVisible: boolean;
  nodeInfo: any;
  details: any;
  node: any;
  detailLoading: boolean;
}
interface Props {
  location?: { query?: any };
}

declare var window;
const { Paragraph } = Typography;
const PressureTestReportDetail: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    detailData: {},
    bottleneckList: [], // 瓶颈列表
    riskMachineList: [], // 风险容器列表
    messageCodeList: [], // 状态码列表
    allMessageCodeList: [], // 所有状态码列表
    allMessageDetailList: [],
    allCompareData: [],
    allTopologyData: [],
    performanceList: [],
    instancePerformanceList: [],
    trendData: [],
    appTrendData: [],
    compareReportId: undefined,

    tabList: [],
    chartsInfo: {},
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
    baseInfoVisible: false,
    infoBarVisible: true,
    nodeVisible: false,
    nodeInfo: null as NodeBean,
    details: null,
    node: null as HTMLElement,
    reload: 0,
    graph: Graph,
    labelSetting: [] as string[],
    refreshTime: 0, // 自动刷新间隔，0为不刷新
    detailLoading: false,
    queryParams: {
      // startTime: '',
      // endTime: '',
      flowTypeEnum: 'BLEND',
      tempActivity: false, // 是否是临时业务活动
    },
    watchListVisible: false,
    watchListQuery: {
      nodeId: undefined,
      serviceName: undefined,
      bottleneckStatus: -1,
      bottleneckType: -1,
    },
  });

  const { location } = props;
  const { query } = location;
  const { id, sceneId } = query;
  const { detailData } = state;

  useEffect(() => {
    queryVltReportDetail(id);
    queryVltBottleneck(id);
    queryVlRiskMachine(id);
    queryVltPerformanceList(id);
    queryVltInstancePerformanceList(id);
    queryTrendData(id);
    queryAppTrendData(id);
  }, []);

  // useEffect(() => {
  //   queryReportBusinessActivity(id);
  // }, []);

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
    console.log('serviceName,startTime,endTime,code', serviceName, startTime, endTime, statusCode,);
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
  const queryVlTopologyData = async (sceneId, startTime, endTime, reportId, xpathMd5) => {
    console.log('serviceName,startTime,endTime,code', sceneId, startTime, endTime, reportId, xpathMd5);
    const {
      data: { data, success },
    } = await PressureTestReportService.queryVlTopologyData({
      sceneId,
      startTime,
      endTime,
      reportId,
      xpathMd5
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
   * @name 获取应用实例趋势图
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

  /**
   * @name 获取应用趋势图
   */
  const queryAppTrendData = async (value) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.queryAppTrendData({
      reportId: value,
    });
    if (success) {
      setState({
        appTrendData: data
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
        console.log('item9999999', item);
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
  * @name 获取业务活动拓扑图
  */
  const queryAllTopologyData = async (detailDataValue) => {
    await Promise.all(
      detailDataValue?.businessActivities?.map((item) =>
        queryVlTopologyData(detailDataValue?.sceneId,
          detailDataValue?.startTime,
          detailDataValue?.endTime,
          detailDataValue?.reportId,
          item?.xpathMd5)
      )
    ).then((res) => {
      setState({
        allTopologyData: res
      });
    });
  };

  const handleChangeReportId = (value) => {
    console.log("----",value);
    if (value.length > 3) {
      // 如果选择超过3个，不做任何操作（或显示警告消息）
      message.info("最多选择3个对比");
      return;
    }
    setState({
      compareReportId: value
    });
    queryAllCompareData(state?.detailData, value ? [state?.detailData?.reportId, value] : [state?.detailData?.reportId]);
  };

  console.log('allMessageCodeList', state?.allMessageCodeList);
  console.log('allMessageDetailList', state?.allMessageDetailList);
  console.log('allCompareData', state?.allCompareData);

  console.log('state?.allTopologyData?.[0]', state?.allTopologyData?.[0]);
  console.log('trendData', state?.trendData);
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

  /**
   * @name 获取压测报告趋势信息
   */
  const queryReportChartsInfo = async (reportId, xpathMd5) => {
    const {
      data: {
        data: { activity, ...chartsInfo },
        success,
      },
    } = await PressureTestReportService.queryLinkChartsInfo({
      reportId,
      xpathMd5,
    });
    if (success) {
      setState({
        chartsInfo,
        graphData: activity?.topology || { nodes: [], edges: [] },
      });
    }
  };

  const handleChangeRemark = async (reportId, remarks) => {
    const {
      data: { data, success },
    } = await PressureTestReportService.editReportRemark({
      reportId,
      remarks,
    });
    if (success) {
      setState({
        isReload: !state?.isReload
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

  }

  const exportPDF = () => {
    const input = document.getElementById('content-to-export'); // 获取需要导出的内容的DOM节点

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 创建一个新的PDF文档，设置纸张大小为A4

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // 将图片添加到PDF文档中
        pdf.save('download.pdf'); // 保存并下载PDF文档
      })
      .catch((err) => {
        console.error('Error exporting PDF:', err);
      });
  };

  // const contentRef = React.createRef();
  // const exportToPDF = async () => {

  //   const contentCanvas = await html2canvas(contentRef.current, {
  //     backgroundColor: 'white', // 通过 html2canvas 配置选项设置背景颜色为白色
  //     scale: 0.8 // 降低缩放比例以减小图像大小
  //   });
  //   const contentWidth = contentCanvas.width;
  //   const contentHeight = contentCanvas.height;

  //   const a4WidthInPixels = 595.28;
  //   const scaleFactor = a4WidthInPixels / contentWidth;
  //   const pdfHeight = contentHeight * scaleFactor;
  //   const pdf = new jsPDF('p', 'pt', [a4WidthInPixels, pdfHeight]);
  //   pdf.addImage(contentCanvas.toDataURL('image/jepg', 0.7), 'JEPG', 0, 0, a4WidthInPixels, pdfHeight);
  //   pdf.save(`${detailData?.sceneName}-${detailData?.reportId}`);
  // };

  function splitContentIntoParts(contentElement) {
    // 假设每个需要单独渲染的部分都有一个特定的类名，比如 'export-section'
    const sections = contentElement.querySelectorAll('.export-section');
    return Array.from(sections);
  }

  const contentRef = React.createRef();
  const exportToPDF = async () => {
    const contentElement = contentRef.current;
    const a4WidthInPixels = 595.28;
    const a4HeightInPixels = 841.89;
    const padding = 20; // 设置 padding 为 20pt
    const pdf = new jsPDF('p', 'pt', [a4WidthInPixels, a4HeightInPixels]);
  
    // 分批处理内容
    const parts = splitContentIntoParts(contentElement); // 将内容分成多个部分
    let isFirstPart = true; // 标记是否是第一部分
  
    for (const part of parts) {
      const contentCanvas = await html2canvas(part, {
        backgroundColor: 'white',
        scale: 0.8, // 进一步降低缩放比例
        useCORS: true
      });
  
      const scaledWidth = a4WidthInPixels - 2 * padding; // 考虑 padding 的宽度
      const scaledHeight = (contentCanvas.height * scaledWidth) / contentCanvas.width; // 调整高度
  
      if (!isFirstPart) {
        pdf.addPage(); // 从第二部分开始添加新页面
      }
  
      // 添加图片时考虑 padding
      pdf.addImage(
        contentCanvas.toDataURL('image/jpeg', 0.8), // 降低 JPEG 质量
        'JPEG',
        padding, // X 坐标
        padding, // Y 坐标
        scaledWidth,
        scaledHeight
      );
  
      isFirstPart = false; // 更新标记，表示后续部分不是第一部分
    }
  
    pdf.save(`${detailData?.sceneName}-${detailData?.reportId}`);
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

  const extra = (
    <>
      <Link
        to={`/pressureTestManage/pressureTestReport/details?id=${id}&sceneId=${sceneId}`}
      >
        <Button
          type="primary"
          ghost
          style={{ marginRight: 8 }}
        >
          返回
        </Button>
      </Link>
      <Button type="primary" onClick={exportToPDF}>导出为PDF</Button>
    </>
  );

  return JSON.stringify(state.detailData) !== '{}' ? (
    <div id="page" style={{ overflow: 'auto' }}>
      <BasePageLayout
        style={{ padding: 8 }}
        extraPosition="top"
        extra={extra}
        title={
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: 20 }}>
              {detailData.sceneName ? detailData.sceneName : '-'}
            </span>
            {/* <div style={{ fontSize: 12, fontWeight: 400 }}>
            备注名称：<Paragraph  style={{ display: 'inline-block', marginLeft: 8 }} editable={{ onChange: (value) => {handleChangeRemark(id, value);} }}>{detailData?.reportRemarks || '-'}</Paragraph>
           </div> */}
          </div>}
      >

        <div  
          ref={contentRef} 
          id="content-to-export" 
          style={{
            padding: '20px',
          //  boxSizing: 'border-box',
          }}
          className="export-section"
          
          >
          <div className="export-section">
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
                        src={require(`./../../../assets/${detailData.conclusion === 1 ? 'success_icon' : 'fail_icon'
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
               <div className={`${styles.detailCardWarp}`} >
            <div className={styles.detailCardListTitle}>风险容器</div>
            <CustomTable style={{ marginTop: 8 }} columns={getRiskColumns()} dataSource={state?.riskMachineList || []} />
          </div>
          </div>
       
          <div className="export-section">
            <div className={`${styles.detailCardTitle}`}>
              业务活动对比
              <div style={{ float: 'right' }}>
                <span style={{ padding: '5px 12px', border: '1px solid #eef0f2', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>{`压测报告${detailData?.reportId}`}（当前）</span>
                <span style={{ margin: '0 8px' }}>🆚</span>
                <CommonSelect
                  mode="multiple"
                  onChange={handleChangeReportId}
                  placeholder="请选择要对比的压测报告"
                  style={{ width: 400 }}
                  dataSource={detailData?.reports?.filter((item) => { if (item?.reportId !== detailData?.reportId) { return item; } })?.map((item2) => {
                    return { label: `压测报告${item2?.reportId}（并发数）${item2?.maxConcurrent},${item2?.startTime}`, value: item2?.reportId, disabled: state?.compareReportId?.length >= 3 && state?.compareReportId?.indexOf(item2?.reportId) === -1 };
                  })}
                  onRender={(item) => (
                    <CommonSelect.Option key={item.value} value={item.value} disabled={item.disabled}>
                      {item.label}
                    </CommonSelect.Option>
                  )} 
                  />
              </div>
            </div>
            {detailData?.businessActivities?.map((item, k) => {
              return <div className="export-section" key={k} >
                <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex" justify="space-between">
                  <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }} />{item?.businessActivityName}</Col>
                  <Col>
                    <CompareNodeModal sceneId={sceneId} activityId={item?.businessActivityId} activityName={item?.businessActivityName} btnText="查看节点对比" reportIds={state?.compareReportId ? [state?.detailData?.reportId, state?.compareReportId] : [state?.detailData?.reportId]} />
                  </Col>
                </Row>
                <div style={{ height: 500 }}>
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
                  <CustomTable style={{ marginTop: 8 }} columns={getIndexColumns()} dataSource={state?.allCompareData?.[k]?.targetData || []} />
                </div>
                <div className={styles.detailCardWarp}>
                  <div className={styles.detailCardListTitle}>RT分位明细</div>
                  <CustomTable style={{ marginTop: 8 }} columns={getRtColumns()} dataSource={state?.allCompareData?.[k]?.rtData || []} />
                </div>
                <BarChart data={state?.allCompareData?.[k]?.columnarData || []} />
                <LineChartWrap data={state?.allCompareData?.[k]?.trendData || []} />
              </div>;
            })}
          </div>
  <div className="export-section">
  <div className={`${styles.detailCardTitle}`}>
            应用性能
            <div className={styles.detailCardWarp}>
              <CustomTable style={{ marginTop: 8 }} columns={getAppPerformanceColumns()} dataSource={state?.performanceList || []} />
              <CustomTable style={{ marginTop: 8 }} columns={getAppInstancePerformanceColumns()} dataSource={state?.instancePerformanceList || []} />
            </div>
          </div>
          <div className={styles.detailCardTitle}>
            请求报文
            {detailData?.businessActivities?.map((item, k) => {
              return <div key={k}>
                <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex" justify="space-between">
                  <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }} />{item?.businessActivityName || '-'}</Col>
                  <Col><CommonSelect onChange={(value) => handleChangeCode(item?.serviceName,
                    detailData?.startTime,
                    detailData?.endTime,
                    value,
                    detailData?.jobId, k)} allowClear={false} value={state?.statusCode?.[k]} style={{ width: 200 }} dataSource={state?.allMessageCodeList?.[k]?.map((item) => { return { label: item?.statusName, value: item?.statusCode }; })} /></Col>
                </Row>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="服务入口">{item?.serviceName}</Descriptions.Item>
                  <Descriptions.Item label="请求方式">{item?.requestMethod}</Descriptions.Item>
                  <Descriptions.Item label="Trace ID">（{state?.allMessageDetailList?.[k]?.cost}ms）
                    <RequestDetailModal
                      btnText={state?.allMessageDetailList?.[k]?.traceId}
                      traceId={state?.allMessageDetailList?.[k]?.traceId}
                    // btnText='0100007f16822286171551035d1ca80001'
                    // traceId='0100007f16822286171551035d1ca80001'
                    // traceId={row.traceId}
                    // totalRt={row.totalRt}
                    /></Descriptions.Item>
                  <Descriptions.Item label="请求头" span={3}>{state?.allMessageDetailList?.[k]?.requestHeader || '-'}</Descriptions.Item>
                  <Descriptions.Item label="请求体" span={3}>
                    {state?.allMessageDetailList?.[k]?.request}
                  </Descriptions.Item>
                  <Descriptions.Item label="响应头" span={3}>{state?.allMessageDetailList?.[k]?.responseHeader || '-'}</Descriptions.Item>
                  <Descriptions.Item label="响应体" span={3}>
                    {state?.allMessageDetailList?.[k]?.response}
                  </Descriptions.Item>
                </Descriptions>
              </div>;
            })}

          </div>
          
  </div>
  <div className={`${styles.detailCardTitle} export-section`}>
            趋势图

            {state?.appTrendData?.map((item, k) => {
              return <div key={k}>
                <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex">
                  <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }} />{`${item?.appName}`}</Col>
                </Row>
                <AppTrendData data={[item]} />
              </div>;
            })}
            {state?.trendData?.map((item, k) => {
              return <div key={k}>
                <Row style={{ marginTop: 16, marginBottom: 16 }} type="flex">
                  <Col style={{ fontSize: '16px', fontWeight: 500 }}> <span style={{ width: 4, height: 14, backgroundColor: '#11BBD5', display: 'inline-block', marginRight: 10 }} />{`${item?.applicationName}|${item?.agentId}`}</Col>
                </Row>
                <TrendChart data={item?.tpsTarget} />
              </div>;
            })}
          </div>
         
        </div>
      </BasePageLayout>
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

export default PressureTestReportDetail;

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
      dataIndex: 'startTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '-'
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
      dataIndex: 'avgDiskIoWaitRate',
      render: (text) => {
        return <span>{text}%</span>;
      }
    },
    {
      ...customColumnProps,
      title: '网络宽带利用率',
      dataIndex: 'avgNetUsageRate',
      render: (text) => {
        return <span>{text}%</span>;
      }
    },
    {
      ...customColumnProps,
      title: 'GC次数',
      dataIndex: 'gcCount'
    },
    {
      ...customColumnProps,
      title: 'GC耗时（ms）',
      dataIndex: 'gcCost'
    },
    {
      ...customColumnProps,
      title: '平均TPS',
      dataIndex: 'avgTps'
    }
  ];
};