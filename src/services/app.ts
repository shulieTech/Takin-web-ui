import { httpDelete, httpGet, httpPost } from 'src/utils/request';

/**
 * @name 全局service
 */
const AppService = {
  async uploadSingleFile(data) {
    const url = '/upload/singleFile';
    return httpPost(url, data);
  },
  async getDictionaries(data) {
    const url = '/link/dictionary';
    return httpGet(url, data);
  },
  async getTheme(data = {}) {
    const url = '/sys/front/config/get';
    return httpGet(url, data);
  },
};
export default AppService;
