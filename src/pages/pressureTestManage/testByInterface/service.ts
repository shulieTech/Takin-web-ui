import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 场景列表
   */
  async getSenceList(data = {}) {
    const url = '/interfaceperformance/config/query';
    return httpGet(url, data);
  },
  /**
   * @name 单个场景详情
   */
  async getSence(data = {}) {
    const url = `/interfaceperformance/config/detail/${data.id}`;
    return httpGet(url);
  },
  /**
   * @name 新增场景
   */
  async addSence(data = {}) {
    const url = '/interfaceperformance/config/create';
    return httpPost(url, data);
  },
  /**
   * @name 修改场景
   */
  async updateSence(data = {}) {
    const url = '/interfaceperformance/config/update';
    return httpPut(url, data);
  },
  /**
   * @name 删除场景
   */
  async deleteSence(data = {}) {
    const url = '/interfaceperformance/config/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 上传文件
   */
  async uploadFile(data = {}) {
    const url = '/file/upload';
    return httpPost(url, data);
  },
  /**
   * @name 解析上传文件内容
   */
  async getDataFromFile(data = {}) {
    const url = '/interfaceperformance/param/fileDataDetail';
    return httpPost(url, data);
  },
  /**
   * @name 解析上传文件内容
   */
  async getDataSource(data = {}) {
    const url = `/interfaceperformance/param/detail/${data.configId}`;
    return httpGet(url, data);
  },
  /**
   * @name 调试场景
   */
  async debugSence(data = {}) {
    const url = '/interfaceperformance/debug/start';
    return httpGet(url, data);
  },
  /**
   * @name 调试场景
   */
  async getDebugResult(data = {}) {
    const url = '/interfaceperformance/debug/result';
    return httpGet(url, data);
  },
  /**
   * @name 保存并启动场景
   */
  async saveAndStartSence(data = {}) {
    const url = '/interfaceperformance/debug/startAndSave';
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
