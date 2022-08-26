import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 场景列表
   */
  async getLinkList(data = {}) {
    const url = '/interfaceperformance/config/query';
    return httpGet(url, data);
  },
};