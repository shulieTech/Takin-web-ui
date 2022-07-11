import { httpGet, httpPost, httpPut, httpDelete } from 'src/utils/request';

export default {
  async machineList(data = {}) {
    const url = '/pressureMachine';
    return httpGet(url, data);
  },
  async machineAdd(data = {}) {
    const url = '/pressureMachine';
    return httpPost(url, data);
  },
  async machineUpdate(data = {}) {
    const url = '/pressureMachine';
    return httpPut(url, data);
  },
  async machineDelete(data = {}) {
    const url = '/pressureMachine';
    return httpDelete(url, data);
  },
  async enableEngine(data = {}) {
    const url = '/pressureMachine/enable';
    return httpPost(url, data);
  },
  async disableEngine(data = {}) {
    const url = '/pressureMachine/disable';
    return httpPost(url, data);
  },
};