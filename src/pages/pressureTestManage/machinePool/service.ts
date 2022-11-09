import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  async machineList(data = {}) {
    const url = '/machineList';
    return httpGet(url, data);
  },
  async machineAdd(data = {}) {
    const url = '/machineList';
    return httpPost(url, data);
  },
  async machineUpdate(data = {}) {
    const url = '/machineList';
    return httpPut(url, data);
  },
  async machineDelete(data = {}) {
    const url = '/machineList';
    return httpDelete(url, data);
  },
};