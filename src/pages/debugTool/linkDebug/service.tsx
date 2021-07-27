import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const LinkDebugService = {
  /**
   * @name 获取调试结果历史列表
   */
  async queryDebugResultList(data = {}) {
    const url = '/fastdebug/debug/list';
    return httpGet(url, data);
  },
  /**
   * @name 删除调试结果历史列表
   */
  async deleteDebugResult(data = {}) {
    const url = '/fastdebug/debug';
    return httpDelete(url, data);
  },
  /**
   * @name 获取链路调试结果详情
   */
  async queryDebugResultDetail(data = {}) {
    const url = '/fastdebug/debug';
    return httpGet(url, data);
  },
  /**
   * @name 获取链路调试结果异常列表
   */
  async queryDebugResultErrorList(data = {}) {
    const url = '/fastdebug/debug/exception/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取链路调试结果异常下拉选项
   */
  async queryDebugResultErrorListSelect(data = {}) {
    const url = '/fastdebug/debug/exception';
    return httpGet(url, data);
  },
  /**
   * @name 获取调用栈详情
   */
  async queryCallStackDetail(data = {}) {
    const url = '/fastdebug/debug/callstack/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取堆栈异常
   */
  async queryStackError(data = {}) {
    const url = '/fast/debug/log/stack/error';
    return httpGet(url, data);
  },
  /**
   * @name 获取调试日志
   */
  async queryDebugLog(data = {}) {
    const url = '/fast/debug/log/stack';
    return httpGet(url, data);
  },
  /**
   * @name 获取机器性能信息
   */
  async queryMachineInfo(data = {}) {
    const url = '/fast/debug/stack/machine';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用日志
   */
  async queryAppLog(data = {}) {
    const url = '/fast/debug/log/app';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用和实例
   */
  async queryAppAndAgent(data = {}) {
    const url = '/fastdebug/debug/examples';
    return httpGet(url, data);
  },
  /**
   * @name 获取agent日志文件名称
   */
  async queryAgentLogFileName(data = {}) {
    const url = '/fast/debug/log/agentlog/names';
    return httpGet(url, data);
  },
  /**
   * @name 获取agent日志
   */
  async queryAgentLog(data = {}) {
    const url = '/fast/debug/log/agent';
    return httpGet(url, data);
  },
  /**
   * @name 获取调用栈数据
   */
  async queryCallStackList(data = {}) {
    const url = '/fastdebug/debug/callStack';
    return httpGet(url, data);
  },
  /**
   * @name 新增保存调试配置
   */
  async addDebugConfig(data = {}) {
    const url = '/fastdebug/config';
    return httpPost(url, data);
  },
  /**
   * @name 编辑保存调试配置
   */
  async editDebugConfig(data = {}) {
    const url = '/fastdebug/config';
    return httpPut(url, data);
  },
  /**
   * @name 删除调试配置
   */
  async deleteDebugConfig(data = {}) {
    const url = '/fastdebug/config';
    return httpDelete(url, data);
  },
  /**
   * @name 获取链路配置详情
   */
  async queryLinkDebugConfigDetail(data = {}) {
    const url = '/fastdebug/config';
    return httpGet(url, data);
  },
  /**
   * @name 获取链路配置列表
   */
  async queryLinkDebugConfigList(data = {}) {
    const url = '/fastdebug/config/list';
    return httpGet(url, data);
  },
  /**
   * @name 开始调试（查看直接调试）
   */
  async debug(data = {}) {
    const url = '/fastdebug/config/debug';
    return httpGet(url, data);
  },
  /**
   * @name 新增保存并开始调试
   */
  async addAndDebug(data = {}) {
    const url = '/fastdebug/config/debug';
    return httpPost(url, data);
  },
  /**
   * @name 编辑保存并开始调试
   */
  async editAndDebug(data = {}) {
    const url = '/fastdebug/config/debug';
    return httpPut(url, data);
  },
  /**
   * @name 获取数据验证列表
   */
  async queryMissingDataList(data = {}) {
    const url = '/fastdebug/config/leakageCheckData';
    return httpGet(url, data);
  },
  /**
   * @name 获取数据验证列表
   */
  async queryResultMissingDataList(data = {}) {
    const url = '/fastdebug/debug/leakageCheckData';
    return httpGet(url, data);
  },
  /**
   * @name 获取异常节点列表
   */
  async queryErrorNodeList(data = {}) {
    const url = '/fastdebug/debug/callStack/exception';
    return httpGet(url, data);
  },
  /**
   * @name 获取定位调用栈
   */
  async queryLocationList(data = {}) {
    const url = '/fastdebug/debug/callStack/node/locate';
    return httpGet(url, data);
  }
};

export default LinkDebugService;
