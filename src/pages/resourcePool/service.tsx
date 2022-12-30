import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const ResourcePoolService = {
  /**
   * @name 获取资源池列表
   */
  async queryResourcePoolList(data = {}) {
    const url = '/ecloud/region/pools';
    return httpPost(url, data);
  },
  /**
   * @name 获取可用区
   */
  async queryRegion(data = {}) {
    const url = '/ecloud/region/detail';
    return httpGet(url, data);
  },
  /**
   * @name 设置可用区
   */
  async setRegion(data = {}) {
    const url = '/ecloud/region/set';
    return httpPut(url, data);
  },
  
};

export default ResourcePoolService;
