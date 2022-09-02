import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 链路列表
   */
  async getLinkList(data = {}) {
    const url = '/pressureResource/list';
    return httpGet(url, data);
  },
  /**
   * @name 添加链路
   */
  async addLink(data = {}) {
    const url = '/pressureResource/create';
    return httpPost(url, data);
  },
  /**
   * @name 应用下拉列表
   */
  async appList(data = {}) {
    const url = '/application/names';
    return httpGet(url, data);
  },
  /**
   * @name 入口path列表
   */
  async entryList(data = {}) {
    const url = '/application/entrances/bySamplerType';
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
