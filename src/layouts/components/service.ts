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
};

export default tenantCodeService;
