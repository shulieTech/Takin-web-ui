import { httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 获取报告链路趋势图信息
   */
  async queryLinkChartsInfo(data = {}) {
    const url = '/report/queryReportTrend';
    return httpGet(url, data);
  },
};
