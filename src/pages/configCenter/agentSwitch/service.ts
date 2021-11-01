import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const AgentSwitchService = {
  /**
   * @name 获取agent开关状态
   */
  async queryAgentSwitchStatus(data = {}) {
    const url = '/application/center/app/switch/silence';
    return httpGet(url, data);
  },
  /**
   * @name 打开agent开关
   */
  async openSwitchStatus(data = {}) {
    const url = '/application/center/app/switch/silence';
    return httpPut(url, data);
  },
  /**
   * @name 关闭agent开关
   */
  async closeSwitchStatus(data = {}) {
    const url = '/application/center/app/switch/silence';
    return httpPut(url, data);
  },
  /**
   * @name 获取未生效应用节点
   */
  async queryInoperativeNode(data = {}) {
    const url = '/application/center/app/report/config/info';
    return httpGet(url, data);
  }
};

export default AgentSwitchService;
