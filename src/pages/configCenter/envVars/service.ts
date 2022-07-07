import { httpGet, httpPost, httpPut, httpDelete } from 'src/utils/request';

export default {
  async envVarList(data = {}) {
    const url = '/envVar/list';
    return httpGet(url, data);
  },
  async envVarAdd(data = {}) {
    const url = '/envVar/add';
    return httpPost(url, data);
  },
  async envVarUpdate(data = {}) {
    const url = '/envVar/update';
    return httpPut(url, data);
  },
  async envVarDelete(data = {}) {
    const url = '/envVar/delete';
    return httpDelete(url, data);
  },
};