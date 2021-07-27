import { httpPost, httpDelete, httpPut, httpGet } from 'src/utils/request';

const PressureMeasurementRecordService = {
  /**
   * @name 获取压测报告详情
   */
  async queryReportDetail(data = {}) {
    const url = '/';
    return httpGet(url, data);
  }
};

export default PressureMeasurementRecordService;
