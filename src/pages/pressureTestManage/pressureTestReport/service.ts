import { httpGet, httpPost, httpPut } from 'src/utils/request';

const PressureTestReportService = {
  /**
   * @name 获取警告详情列表
   */
  async queryWaringDetailList(data = {}) {
    const url = '/report/listWarn';
    return httpGet(url, data);
  },
  /**
   * @name 获取报告详情
   */
  async queryReportDetail(data = {}) {
    const url = '/report/getReportByReportId';
    return httpGet(url, data);
  },
  /**
   * @name 获取警告列表
   */
  async queryWarningList(data = {}) {
    const url = '/report/listWarn';
    return httpGet(url, data);
  },
  /**
   * @name 获取报告业务活动列表
   */
  async queryReportBusinessActivity(data = {}) {
    const url = '/report/queryReportActivityByReportId';
    return httpGet(url, data);
  },
  /**
   * @name 获取实况业务活动列表
   */
  async queryLiveBusinessActivity(data = {}) {
    const url = '/report/queryReportActivityBySceneId';
    return httpGet(url, data);
  },
  /**
   * @name 获取实况、报告业务活动列表（树）
   */
  async queryBusinessActivityTree(data = {}) {
    const url = '/report/queryNodeTree';
    return httpGet(url, data);
  },
  /**
   * @name 获取报告链路趋势图信息
   */
  async queryLinkChartsInfo(data = {}) {
    const url = '/report/queryReportTrend';
    return httpGet(url, data);
  },
  /**
   * @name 获取实况详情
   */
  async queryLiveDetail(data = {}) {
    const url = '/report/tempReportDetail';
    return httpGet(url, data);
  },
  /**
   * @name 获取实况链路趋势图信息
   */
  async queryLiveLinkChartsInfo(data = {}) {
    const url = '/report/queryTempReportTrend';
    return httpGet(url, data);
  },
  /**
   * @name 停止压测
   */
  async stopPressureTest(data = {}) {
    const url = '/scene/task/stop';
    return httpPost(url, data);
  },
  /**
   * @name 获取瓶颈接口
   */
  async queryBottleneckAPIList(data = {}) {
    const url = '/report/bottleneckInterface/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取风险机器左侧应用列表
   */
  async queryRiskMachineAppList(data = {}) {
    const url = '/report/risk/application';
    return httpGet(url, data);
  },
  /**
   * @name 获取风险机器列表
   */
  async queryRiskMachineList(data = {}) {
    const url = '/report/risk/machine/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取压测明细列表
   */
  async queryPressureTestDetailList(data = {}) {
    const url = '/report/businessActivity/summary/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取容量水位应用列表
   */
  async queryWaterLevelList(data = {}) {
    const url = '/report/application/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取风险机器性能详情
   */
  async queryMachinePerformanceDetail(data = {}) {
    const url = '/report/machine/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取容量水位应用机器列表
   */
  async queryWaterLeveAppMachineList(data = {}) {
    const url = '/report/machine/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取报告汇总数据
   */
  async queryReportCount(data = {}) {
    const url = '/report/count';
    return httpGet(url, data);
  },
  /**
   * @name 获取业务活动压测明细
   */
  async queryBusinessActivityPressureTestDetail(data = {}) {
    const url = '/report/link/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取请求明细列表
   */
  async queryRequestDetail(data = {}) {
    const url = '/report/link/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取请求流量列表
   */
  async queryRequestList(data = {}) {
    const url = '/report/realtime/link/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取请求流量失败数据
   */
  async queryRequestCount(data = {}) {
    const url = '/report/application/trace/failedCount';
    return httpGet(url, data);
  },
  /**
   * @name 获取漏数验证数据
   */
  async queryMissingDataList(data = {}) {
    const url = '/leak/report/detail';
    return httpGet(url, data);
  },
  /**
   * @name 调整TPS
   */
  async adjustTPS(data = {}) {
    const url = '/scene/task/tps';
    return httpPut(url, data);
  },
  /**
   * @name 调整TPS
   */
  async getTpsValue(data = {}) {
    const url = '/scene/task/queryTaskTps';
    return httpGet(url, data);
  },
  /**
   * @name 压测实况链路图
   */
  async getLiveGraphData(data) {
    const url = '/report/queryTempReportTrendWithTopology';
    return httpGet(url, data);
  },
  /**
   * @name 获取jtl文件下载地址
   */
  async getJtlDownLoadUrl(data = {}) {
    const url = '/report/getJtlDownLoadUrl';
    return httpGet(url, data);
  },
  /**
   * @name 下载文件
   */
  async downloadFileByPath(data = {}, options = {}) {
    const url = '/file/downloadFileByPath';
    return httpGet(url, data, options);
  },
  async monitor(data) {
    const url = '/scene/monitor/list';
    return httpGet(url, data);
  },
  // 入口应用列表
  async listDictionary(data = {}) {
    const url = '/application/center/list/dictionary';
    return httpGet(url, data);
  },
  // 请求类型列表
  async middlewareList(data = {}) {
    const url = '/application/interface/configs/middleware/list';
    return httpGet(url, data);
  },
  // 压力机明细
  async machineSummary(data = {}) {
    const url = '/cloud/resources/getDetails';
    return httpGet(url, data);
  },
  // 请求类型列表
  async getReportPdf(data = {}) {
    const url = '/report/export';
    return httpGet(url, data);
  },

  /**
   * @name 获取报告基本信息
   */
  async queryVltReportDetail(data = {}) {
    const url = '/vlt/report/getReportById';
    return httpGet(url, data);
  },
  /**
   * @name 获取瓶颈接口
   */
  async queryVltBottleneck(data = {}) {
    const url = '/vlt/report/bottleneckInterface/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取风险容器
   */
  async queryVlRiskMachine(data = {}) {
    const url = '/vlt/report/risk/machine/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取状态码列表
   */
  async queryVlMessageCode(data = {}) {
    const url = '/vlt/report/message/code';
    return httpGet(url, data);
  },
  /**
   * @name 获取报文详情
   */
  async queryVlMessageDetail(data = {}) {
    const url = '/vlt/report/message/detail';
    return httpGet(url, data);
  },
 /**
  * @name 获取报告对比
  */
  async queryVlCompare(data = {}) {
    const url = '/vlt/report/compare';
    return httpGet(url, data);
  },
/**
 * @name 获取业务活动链路图
 */
  async queryVlTopologyData(data = {}) {
    const url = '/vlt/report/getLinkDiagram';
    return httpGet(url, data);
  },
/**
 * @name 获取应用性能列表
 */
  async queryVltPerformanceList(data = {}) {
    const url = '/vlt/report/application/performanceList';
    return httpGet(url, data);
  },
/**
 * @name 获取实例性能列表
 */
  async queryVltInstancePerformanceList(data = {}) {
    const url = '/vlt/report/application/instance/performanceList';
    return httpGet(url, data);
  },
  /**
   * @name 获取实例趋势图
   */
  async queryTrendData(data = {}) {
    const url = '/vlt/report/application/instance/trendMap';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用趋势图
   */
  async queryAppTrendData(data = {}) {
    const url = '/vlt/report/application/trendMap';
    return httpGet(url, data);
  },
  /**
   * @name 获取节点对比
   */
  async queryNodeCompare(data = {}) {
    const url = '/vlt/report/node/compare';
    return httpGet(url, data);
  },

  /**
   * @name 获取列表
   */
  async queryTraceFlowManage(data = {}) {
    const url = '/apm/traceFlowManage/detail';
    return httpGet(url, data);
  },
};

export default PressureTestReportService;
