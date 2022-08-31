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
  /**
   * @name 应用下拉列表
   */
  async appList(data = {}) {
    const url = '/application/center/list/dictionary';
    return httpGet(url, data);
  },
  /**
   * @name 中间件下拉列表
   */
  async middlewareList(data = {}) {
    const url = '/v2/link/ds/support/name/new';
    return httpGet(url, data);
  },
};
