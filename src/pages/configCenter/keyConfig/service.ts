import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const KeyConfigService = {
  /**
   * @name 获取客户详情
   */
  async queryUserDetail(data = {}) {
    const url = '/';
    return httpGet(url, data);
  }
};

export default KeyConfigService;
