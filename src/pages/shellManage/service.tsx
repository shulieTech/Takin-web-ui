import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const ShellManageService = {
  /**
   * @name 新增shell脚本
   */
  async addShellScript(data = {}) {
    const url = '/shellScriptManage';
    return httpPost(url, data);
  },
  /**
   * @name 编辑shell脚本
   */
  async editShellScript(data = {}) {
    const url = '/shellScriptManage';
    return httpPut(url, data);
  },
  /**
   * @name 获取shell脚本详情
   */
  async queryShellScript(data = {}) {
    const url = '/shellScriptManage';
    return httpGet(url, data);
  },
  /**
   * @name 删除shell脚本
   */
  async deleteShellScript(data = {}) {
    const url = '/shellScriptManage';
    return httpDelete(url, data);
  },
  /**
   * @name 获取脚本标签列表
   */
  async queryScriptTagList(data = {}) {
    const url = '/scriptManage/listScriptTag';
    return httpGet(url, data);
  },
  /**
   * @name 新增shell标签
   */
  async addShellTags(data = {}) {
    const url = '/scriptManage/createScriptTagRef';
    return httpPost(url, data);
  },
  /**
   * @name 获取shell脚本样例
   */
  async queryShellScriptDemo(data = {}) {
    const url = '/shellScriptManage/getDownload';
    return httpGet(url, data);
  },
  /**
   * @name 获取shell脚本代码
   */
  async queryShellScriptCode(data = {}) {
    const url = '/shellScriptManage/history';
    return httpGet(url, data);
  },
  /**
   * @name 获取shell脚本结果列表
   */
  async queryShellResultList(data = {}) {
    const url = '/shellScriptManage/getExecuteResult';
    return httpGet(url, data);
  },
  /**
   * @name 执行shell脚本
   */
  async startShellScript(data = {}) {
    const url = '/shellScriptManage/execute';
    return httpGet(url, data);
  }
};

export default ShellManageService;
