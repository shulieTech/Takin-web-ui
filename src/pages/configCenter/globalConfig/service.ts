import { httpGet, httpPost } from 'src/utils/request';

const GlobalConfigService = {
  /** @name  */
  async saveDumpThread(data = {}) {
    const url = '/confcenter/troConfig/updateGlobalConfig';
    return httpPost(url, data);
  },
  async getDumpThread(data = {}) {
    const url = '/confcenter/troConfig/queryGlobalConfig';
    return httpGet(url, data);
  }
};

export default GlobalConfigService;
