import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const OrderMachineService = {
  /**
   * @name 新增订购机器
   */
  async addOrderMachine(data = {}) {
    const url = '/ecloud/machine/add';
    return httpPost(url, data);
  },

  /**
   * @name 获取租户列表
   */
  async queryTenantList(data = {}) {
    const url = '/ecloud/package/tenant';
    return httpGet(url, data);
  },

  /**
   * @name 获取资源池列表
   */
  async queryResourcePool(data = {}) {
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
   * @name 获取用户套餐列表
   */
  async queryUserPackage(data = {}) {
    const url = '/ecloud/package/base';
    return httpGet(url, data);
  },   
};

export default OrderMachineService;
