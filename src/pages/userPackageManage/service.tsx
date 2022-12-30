import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const UserPackageManageService = {
  /**
   * @name 新增用户套餐
   */
  async addUserPackage(data = {}) {
    const url = '/ecloud/package/add';
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
   * @name 获取用户套餐列表
   */
  async queryUserPackage(data = {}) {
    const url = '/ecloud/package/base';
    return httpGet(url, data);
  },
};

export default UserPackageManageService;
