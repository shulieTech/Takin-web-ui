import { httpPost, httpDelete, httpPut, httpGet } from 'src/utils/request';

const PressureMeasurementConfigService = {
  /**
   * @name 获取
   */
  async queryReportDetail(data = {}) {
    const url = '/';
    return httpGet(url, data);
  }
};

export default PressureMeasurementConfigService;
