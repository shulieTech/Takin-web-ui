import { httpGet, httpPost } from 'src/utils/request';
const AnalysisService = {
  /** @name 线程详情 */
  async getThreadDetails(data) {
    const url = '/thread/base';
    return httpGet(url, data);
  },
  /** @name 线程数、cpu图表 */
  async getThreadCpuChart(data) {
    const url = '/thread/analyze';
    return httpGet(url, data);
  },
  /** @name 线程列表 */
  async queryThreadList(data) {
    const url = '/thread/list';
    return httpGet(url, data);
  },
  /** @name 进程列表 */
  async queryProcessList(data) {
    const url = '/thread/process';
    return httpGet(url, data);
  },
  /** @name CPU利用率 */
  async queryCpuChart(data) {
    const url = '/thread/cpuUseRate';
    return httpGet(url, data);
  },
  /** @name 内存分析 */
  async memeryAnalysis(data) {
    const url = '/memory/dump';
    return httpPost(url, data);
  },
  /** @name 方法树 */
  async queryMethodTreeList(data) {
    const url = '/traceManage/queryTraceManageDeploy';
    return httpGet(url, data);
  },
  /** @name 开始追踪 */
  async startTraceMethod(data) {
    const url = '/traceManage/createTraceManage';
    return httpPost(url, data);
  },
  /** @name 方法栈 */
  async getMethodStack(data) {
    const url = '/thread/getThreadStackInfo';
    return httpPost(url, data);
  },
  /** @name 确认dump内存 */
  async confirmDumpMemory(data) {
    const url = '/memory/download/dump';
    return httpGet(url, data);
  },
};

export default AnalysisService;
