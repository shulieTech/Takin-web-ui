import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const UserPackageManageService = {
  /**
   * @name 新增用户套餐
   */
  async addUser(data = {}) {
    const url = '/user/add';
    return httpPost(url, data);
  },
};

export default UserPackageManageService;
