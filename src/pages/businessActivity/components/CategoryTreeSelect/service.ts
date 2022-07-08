import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  async categoryList(data = {}) {
    const url = '/link/tech/linkManage/detail';
    return httpGet(url, data);
  },
  async categoryAdd(data = {}) {
    const url = '/link/tech/linkManage/detail';
    return httpGet(url, data);
  },
  async categoryUpdate(data = {}) {
    const url = '/link/tech/linkManage/detail';
    return httpGet(url, data);
  },
  async categoryDelete(data = {}) {
    const url = '/link/tech/linkManage/detail';
    return httpGet(url, data);
  },
};