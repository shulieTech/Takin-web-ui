import { httpGet } from 'src/utils/request';
const PressureTestStatisticService = {
  /** @name 图表信息 */
  async getChartInfo(data) {
    const url = '/statistic/getPressurePieTotal';
    return httpGet(url, data);
  },
  /** @name 报告信息 */
  async getReportInfo(data) {
    const url = '/statistic/getReportTotal';
    return httpGet(url, data);
  },
  /** @name 列表 */
  async queryList(data) {
    const url = '/statistic/getPressureListTotal';
    return httpGet(url, data);
  },
  /** @name 标签 */
  async queryScriptLabelList(data) {
    const url = '/statistic/getScriptLabelListTotal';
    return httpGet(url, data);
  }
};

export default PressureTestStatisticService;
