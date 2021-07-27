import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const AuthorityConfigService = {
  /**
   * @name 重置账号角色
   */
  async handleDelete(data = {}) {
    const url = '/role/clear';
    return httpPut(url, data);
  },
  /**
   * @name 获取账号列表
   */
  async queryAccountList(data = {}) {
    const url = '/auth/dept/users';
    return httpPost(url, data);
  },
  /**
   * @name 获取角色列表
   */
  async queryRoleList(data = {}) {
    const url = '/role/list';
    return httpGet(url, data);
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
   * @name 新增角色
   */
  async addRole(data = {}) {
    const url = '/role/add';
    return httpPost(url, data);
  },
  /**
   * @name 编辑角色
   */
  async editRole(data = {}) {
    const url = '/role/update';
    return httpPut(url, data);
  },
  /**
   * @name 删除角色
   */
  async deleteRole(data = {}) {
    const url = '/role/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 获取角色详情
   */
  async queryRoleDetail(data = {}) {
    const url = '/role/detail';
    return httpGet(url, data);
  },
  /**
   * @name 保存功能权限
   */
  async saveFuncPermission(data = {}) {
    const url = '/auth/resource/config/action';
    return httpPost(url, data);
  },
  /**
   * @name 获取功能权限
   */
  async queryFuncPermission(data = {}) {
    const url = '/auth/resource/config/action';
    return httpGet(url, data);
  },
  /**
   * @name 保存数据权限
   */
  async saveDataPermission(data = {}) {
    const url = '/auth/resource/data/scope';
    return httpPost(url, data);
  },
  /**
   * @name 获取数据权限
   */
  async queryDataPermission(data = {}) {
    const url = '/auth/resource/data/scope';
    return httpGet(url, data);
  },  
  /**
   * @name 分配负责人
   */
  async allocation(data = {}) {
    const url = '/user/allocation';
    return httpPost(url, data);
  },
  /**
   * @name 删除部门
   */
  async deleteDepartment(data = {}) {
    const url = '/dept/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 新增部门
   */
  async createDepartment(data = {}) {
    const url = '/dept/create';
    return httpPost(url, data);
  },
  /**
   * @name 查询部门
   */
  async getDepartmentInfo(data = {}) {
    const url = '/dept/detail';
    return httpGet(url, data);
  },
  /**
   * @name 编辑部门
   */
  async updateDepartment(data = {}) {
    const url = '/dept/update';
    return httpPut(url, data);
  },
  /**
   * @name 删除账号
   */
  async deleteAccount(data = {}) {
    const url = '/user/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 新增账号
   */
  async createAccount(data = {}) {
    const url = '/user/create';
    return httpPost(url, data);
  },
  /**
   * @name 查询用户
   */
  async getAccountInfo(data = {}) {
    const url = '/user/detail';
    return httpGet(url, data);
  },
  /**
   * @name 编辑账号
   */
  async updateAccount(data = {}) {
    const url = '/user/update';
    return httpPut(url, data);
  },
  /**
   * @name 导入账号
   */
  async importAccount(data = {}) {
    const url = '/user/import';
    return httpPost(url, data);
  },
  /**
   * @name 下载失败异常
   */
  async downloadErrotFile(data = {}) {
    const url = '/user/download';
    return httpGet(url, data);
  },
};

export default AuthorityConfigService;
