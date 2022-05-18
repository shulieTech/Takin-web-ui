import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 场景列表
   */
  async getSenceList(data = {}) {
    const url = '/getSenceList';
    return httpGet(url, data);
  },
  /**
   * @name 删除场景
   */
  async deleteSence(data = {}) {
    const url = '/deleteSence';
    return httpDelete(url, data);
  },
  /**
   * @name 复制场景
   */
  async copySence(data = {}) {
    const url = '/copySence';
    return httpGet(url, data);
  },
  /**
   * @name 调试场景
   */
  async debugSence(data = {}) {
    const url = '/debugSence';
    return httpGet(url, data);
  },
  /**
   * @name 启动场景
   */
  async startSence(data = {}) {
    const url = '/startSence';
    return httpPost(url, data);
  },
  /**
   * @name 查询关联应用
   */
  async searchEntrance(data = {}) {
    const url = '/startSence';
    return httpPost(url, data);
  },
};
