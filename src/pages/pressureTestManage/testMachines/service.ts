import { Modal } from 'antd';
import { httpGet, httpPost, httpPut, httpDelete } from 'src/utils/request';

const customConfig = {
  errorHandle: (msg) => Modal.error({ title: '出错了', content: msg }),
};

export default {
  async machineList(data = {}) {
    const url = '/pressureMachine/list';
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
  async machineSync(data = {}) {
    const url = '/pressureMachine/syncMachine';
    return httpGet(url, data, customConfig);
  },
  async enableEngine(data = {}) {
    const url = '/pressureMachine/enable';
    return httpPost(url, data);
  },
  async disableEngine(data = {}) {
    const url = '/pressureMachine/disable';
    return httpPost(url, data);
  },
  async suiteList(data = {}) {
    const url = '/pressureMachine/list';
    return httpGet(url, data);
  },
  async deployToBenchmark(data = {}) {
    const url = '/pressureMachine/list';
    return httpPost(url, data);
  },
};
