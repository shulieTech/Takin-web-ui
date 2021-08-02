import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const DistributionService = {
  /**
   * @name 获取账号列表
   */
  async queryAccountList(data = {}) {
    const url = '/auth/dept/users';
    return httpPost(url, data);
  },
  /**
   * @name 获取部门列表
   */
  async queryDepartmentList(data = {}) {
    const url = '/auth/dept/tree';
    return httpGet(url, data);
  },
  /**
   * @name 给账号分配角色
   */
  async addRoleToAccount(data = {}) {
    const url = '/role/toUser';
    return httpPut(url, data);
  },
  /**
   * @name 分配负责人
   */
  async allocation(data = {}) {
    const url = '/user/allocation';
    return httpPost(url, data);
  }
};

export default DistributionService;