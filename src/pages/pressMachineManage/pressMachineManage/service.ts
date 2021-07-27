import { httpDelete, httpGet, httpPut } from 'src/utils/request';

const PressMachineManageService = {
  /** @name 压力机状态统计 */
  async getStatisticsInfo() {
    const url = '/pressure/machine/statistics';
    return httpGet(url);
  },
  /** @name 压力机趋势统计 */
  async getTrendInfo(data) {
    const url = '/pressure/machine/statistics/trend/chart';
    return httpGet(url, data);
  },
  /** @name 编辑压力机信息 */
  async editPressMachineInfo(data) {
    const url = '/pressure/machine';
    return httpPut(url, data);
  },
  /** @name 删除压力机 */
  async deletePressMachine(data) {
    const url = '/pressure/machine';
    return httpDelete(url, data);
  },
  /** @name 压力机日志趋势图 */
  async pressManchineLogChart(data) {
    const url = '/pressure/machine/log/info';
    return httpGet(url, data);
  }
};

export default PressMachineManageService;
