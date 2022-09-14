import { httpGet } from 'src/utils/request';
export default {
  async getTopSceneList(data) {
    const url = '/statistic/getPressureListTotal';
    return httpGet(url, data);
  },
  async getReportTotal(data) {
    const url = '/statistic/getReportTotal';
    return httpGet(url, data);
  },
  async getSceneTotal(data) {
    const url = '/statistic/getPressurePieTotal';
    return httpGet(url, data);
  },
  async getScriptTotal(data) {
    const url = '/businessFlow/scene/list/size';
    return httpGet(url, data);
  },
};
