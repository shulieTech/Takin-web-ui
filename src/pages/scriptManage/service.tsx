import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const ScriptManageService = {
  /**
   * @name 新增脚本
   */
  async addScript(data = {}) {
    const url = '/scriptManage';
    return httpPost(url, data);
  },
  /**
   * @name 编辑脚本
   */
  async editScript(data = {}) {
    const url = '/scriptManage';
    return httpPut(url, data);
  },
  /**
   * @name 删除脚本
   */
  async deleteScript(data = {}) {
    const url = '/scriptManage';
    return httpDelete(url, data);
  },
  /**
   * @name 查询脚本详情
   */
  async queryScript(data = {}) {
    const url = '/scriptManage';
    return httpGet(url, data);
  },
  /**
   * @name 上传文件
   */
  async uploadFiles(data = {}) {
    const url = '/file/upload';
    return httpPost(url, data);
  },
  /**
   * @name 删除文件
   */
  async deleteFiles(data = {}) {
    const url = '/file';
    return httpDelete(url, data);
  },
  /**
   * @name 获取下载大文件插件地址
   */
  async getBigFileDownload(data = {}) {
    const url = '/cloud/client/download';
    return httpGet(url, data);
  },
  /**
   * @name 获取脚本标签列表
   */
  async queryScriptTagList(data = {}) {
    const url = '/scriptManage/listScriptTag';
    return httpGet(url, data);
  },
  /**
   * @name 新增脚本标签
   */
  async addScriptTags(data = {}) {
    const url = '/scriptManage/createScriptTagRef';
    return httpPost(url, data);
  },
  /**
   * @name 下载脚本文件
   */
  async downloadScript(data = {}) {
    const url = '/scriptManage/getZipFileUrl';
    return httpGet(url, data);
  },
  /**
   * @name 下载单个文件
   */
  async downloadSingleScript(data = {}) {
    const url = '/scriptManage/getFileDownLoadUrl';
    return httpGet(url, data);
  },
  /**
   * @name 下载文件(cloud迁移)
   */
  async downloadFileByPath(data = {}) {
    const url = '/file/downloadFileByPath';
    return httpGet(url, data);
  },
  /**
   * @name 获取文件代码
   */
  async queryScriptCode(data = {}) {
    const url = '/scriptManage/explainScriptFile';
    return httpGet(url, data);
  },
  /**
   * @name 获取插件列表
   */
  async queryPluginList(data = {}) {
    const url = '/scriptManage/support/plugin/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取插件版本列表
   */
  async queryPluginVersionList(data = {}) {
    const url = '/scriptManage/support/plugin/version';
    return httpGet(url, data);
  },
  /*
   * @name 脚本实例列表
   */
  async queryScriptList(data = {}) {
    const url = '/scriptManage/listScriptDeployByScriptId';
    return httpGet(url, data);
  },
  /**
   * @name 恢复版本
   */
  async resetVersion(data = {}) {
    const url = '/scriptManage/rollbackScriptDeploy';
    return httpPost(url, data);
  },
  /**
   * @name 获取JMX脚本
   */
  async getJMXScript(data = {}) {
    const url = '/scriptManage/compareScriptDeploy';
    return httpGet(url, data);
  },
  /*
   * @name 上传附件
   */
  async uploadAttachments(data = {}) {
    const url = '/file/attachment/upload';
    return httpPost(url, data);
  },
  /**
   * @name 开始调试
   */
  async startDebug(data = {}) {
    const url = '/scriptDebug/debug';
    return httpPost(url, data);
  },
  /**
   * @name 获取调试脚本历史记录列表
   */
  async queryDebugScriptRecordList(data = {}) {
    const url = '/scriptDebug/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取调试脚本历史记录列表
   */
  async queryDebugScriptList(data = {}) {
    const url = '/scriptDebug/requestList';
    return httpGet(url, data);
  },
  /**
   * @name 获取调试脚本历史记录详情
   */
  async queryScriptDebugDetail(data = {}) {
    const url = '/scriptDebug/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取断言详情
   */
  async queryAssertDetail(data = {}) {
    const url = '/scriptManage/list';
    return httpPost(url, data);
  },
  /**
   * @name 获取业务流程
   */
  async queryBusinessFlow(data = {}) {
    const url = '/link/businessFlow';
    return httpGet(url, data);
  },
  /**
   * @name 停止调试
   */
  async stopDebug(data = {}) {
    const url = '/scriptDebug/stop';
    return httpPut(url, data);
  },
};

export default ScriptManageService;
