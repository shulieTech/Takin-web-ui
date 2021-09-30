import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const AppAccessService = {
  /**
   * @name 获取应用列表
   */
  async queryAppList(data = {}) {
    const url = '/fast/agent/access/config/allApplication';
    return httpGet(url, data);
  },
  /**
   * @name 获取版本列表
   */
  async queryVersionList(data = {}) {
    const url = '/fast/agent/access/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取版本列表
   */
  async queryAllVersionList(data = {}) {
    const url = '/fast/agent/access/allVersionList';
    return httpGet(url, data);
  },
  /**
   * @name 应用检测
   */
  async checkAppAccess(data = {}) {
    const url = '/fast/agent/access/probe/discover';
    return httpGet(url, data);
  }   
};

export default AppAccessService;
