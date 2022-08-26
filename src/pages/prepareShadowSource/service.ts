import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 链路列表
   */
  async getLinkList(data = {}) {
    const url = '/interfaceperformance/config/query';
    return httpGet(url, data);
  },
  /**
   * @name 添加链路
   */
  async addLink(data = {}) {
    const url = '/interfaceperformance/config/query';
    return httpPost(url, data);
  },
};
