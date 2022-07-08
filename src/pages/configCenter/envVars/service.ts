import { httpGet, httpPost, httpPut, httpDelete } from 'src/utils/request';

export default {
  async envVarList(data = {}) {
    const url = '/placeholderManage/list';
    return httpGet(url, data);
  },
  async envVarAdd(data = {}) {
    const url = '/placeholderManage';
    return httpPost(url, data);
  },
  async envVarUpdate(data = {}) {
    const url = '/placeholderManage';
    return httpPut(url, data);
  },
  async envVarDelete(data = {}) {
    const url = '/placeholderManage';
    return httpDelete(url, data);
  },
};