import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const AgentManageService = {
  /**
   * @name 获取探针概况
   */
  async queryAgentDashboard(data = {}) {
    const url = '/fast/agent/access/probe/overview';
    return httpGet(url, data);
  },
  /**
   * @name 获取探针管理列表
   */
  async queryAgentManageList(data = {}) {
    const url = '/fast/agent/access/probe/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取插件列表（全部）
   */
  async queryMiddlewareList(data = {}) {
    const url = '/fast/agent/access/config/pluginList';
    return httpGet(url, data);
  },
  /**
   * @name 获取异常日志列表
   */
  async queryErrorLogList(data = {}) {
    const url = '/fast/agent/access/errorLog/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取所有应用名称列表
   */
  async queryAllAppList(data = {}) {
    const url = '/fast/agent/access/config/allApplication';
    return httpGet(url, data);
  }
};

export default AgentManageService;
