import { httpGet, httpPost, httpPut, httpDelete } from 'src/utils/request';

export default {
  async machineList(data = {}) {
    const url = '/machine/list';
    return httpGet(url, data);
  },
  async machineAdd(data = {}) {
    const url = '/testMachine/add';
    return httpPost(url, data);
  },
  async machineUpdate(data = {}) {
    const url = '/testMachine/update';
    return httpPut(url, data);
  },
  async machineDelete(data = {}) {
    const url = '/testMachine/delete';
    return httpDelete(url, data);
  },
  async toggleEngine(data = {}) {
    const url = '/testMachine/toggle';
    return httpDelete(url, data);
  },
};