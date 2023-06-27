import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const tenantCodeService = {
  async tenant(data = {}) {
    const url = '/tenant';
    return httpGet(url, data);
  },
  /**
   * @name 获取部门列表
   */
  async queryDepartmentList(data = {}) {
    const url = '/auth/dept/getUserDept';
    return httpGet(url, data);
  },

  /**
   * @name 获取项目列表
   */
  async queryProjectList(data = {}) {
    const url = '/dept/project/switch/list';
    return httpGet(url, data);
  },

  /**
   * @name 切换项目
   */
  async changeProject(data = {}) {
    const url = '/dept/project/switch';
    return httpGet(url, data);
  },
  async tenantSwitch(data = {}) {
    const url = '/tenant/switch';
    return httpPut(url, data);
  },
  async envSwitch(data = {}) {
    const url = '/tenant/env/switch';
    return httpPut(url, data);
  },
  async checkNewVersion(data = {}) {
    const url = '/sys/version';
    return httpGet(url, data);
  },
  async confirmNewVersion(data = {}) {
    const url = '/sys/version/confirm';
    return httpPut(url, data);
  },
  async checkMachineStatus(data = {}) {
    const url = '/sys/pressure/state';
    return httpGet(url, data);
  },
  async addEnv(data = {}) {
    const url = '/tenant/env/add';
    return httpPost(url, data);
  },
  // 编辑和新增使用的同一个接口，修改时envCode不可编辑
  async updateEnv(data = {}) {
    const url = '/tenant/env/update';
    return httpPut(url, data);
  },
  async deleteEnv(data = {}) {
    const url = '/tenant/env/delete';
    return httpDelete(url, data);
  },
  async setDefaultEnv(data = {}) {
    const url = '/tenant/env/default';
    return httpPut(url, data);
  },
};

export default tenantCodeService;
