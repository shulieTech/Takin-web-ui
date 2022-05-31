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
    const url = `/interfaceperformance/config/detail`;
    return httpGet(url, data);
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
   * @name 保存文件参数
   */
  async saveFileParams(data = {}) {
    const url = '/interfaceperformance/param/save';
    return httpPost(url, data);
  },
  /**
   * @name 获取上传文件内容
   */
  async getDataSource(data = {}) {
    const url = `/interfaceperformance/param/detail`;
    return httpGet(url, data);
  },
  /**
   * @name 调试场景
   */
  async debugSence(data = {}) {
    const url = '/interfaceperformance/debug/start';
    return httpPost(url, data);
  },
  /**
   * @name 调试场景结果
   */
  async getDebugResult(data = {}) {
    const url = '/interfaceperformance/debug/result';
    return httpGet(url, data);
  },
  /**
   * @name 调试场景结果
   */
  async clearDebugResult(data = {}) {
    const url = '/interfaceperformance/debug/flush';
    return httpDelete(url, data);
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
    const url = '/interfaceperformance/config/relationName';
    return httpPost(url, data);
  },
  /**
   * @name 获取建议pod数
   */
  async querySuggestPodNum(data) {
    const url = '/v2/scene/pod_number';
    return httpPost(url, data);
  },
};
