import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const UserManageService = {
  /**
   * @name 获取客户详情
   */
  async queryUserDetail(data = {}) {
    const url = '/user/detail';
    return httpGet(url, data);
  },
  /**
   * @name 新增客户
   */
  async addUser(data = {}) {
    const url = '/user/add';
    return httpPost(url, data);
  },
  /**
   * @name 编辑客户
   */
  async editUser(data = {}) {
    const url = '/user/update';
    return httpPut(url, data);
  }
};

export default UserManageService;
