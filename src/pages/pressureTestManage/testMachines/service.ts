import { httpGet, httpPost, httpPut, httpDelete } from 'src/utils/request';

export default {
  async machineList(data = {}) {
    const url = '/machine/list';
    return httpGet(url, data);
  },
  async machineAdd(data = {}) {
    const url = '/machine/add';
    return httpPost(url, data);
  },
  async machineUpdate(data = {}) {
    const url = '/machine/update';
    return httpPut(url, data);
  },
  async machineDelete(data = {}) {
    const url = '/machine/delete';
    return httpDelete(url, data);
  },
  async toggleEngine(data = {}) {
    const url = '/machine/toggle';
    return httpDelete(url, data);
  },
};