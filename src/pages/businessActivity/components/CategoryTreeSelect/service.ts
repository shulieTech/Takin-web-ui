import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  async categoryList(data = {}) {
    const url = '/businessActivity/category/list';
    return httpGet(url, data);
  },
  async categoryAdd(data = {}) {
    const url = '/businessActivity/category/add';
    return httpPost(url, data);
  },
  async categoryUpdate(data = {}) {
    const url = '/businessActivity/category/update';
    return httpPut(url, data);
  },
  async categoryDelete(data = {}) {
    const url = '/businessActivity/category/delete';
    return httpDelete(url, data);
  },
  async categoryMove(data = {}) {
    const url = '/businessActivity/category/move';
    return httpPut(url, data);
  },
};
