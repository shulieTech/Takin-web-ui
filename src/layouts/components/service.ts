import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const tenantCodeService = {
  async tenant(data = {}) {
    const url = '/tenant';
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
