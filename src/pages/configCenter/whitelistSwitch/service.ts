import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const WhitelistSwitchService = {
  /**
   * @name 获取白名单开关状态
   */
  async queryWhitelistSwitchStatus(data = {}) {
    const url = '/console/switch/whitelist';
    return httpGet(url, data);
  },
  /**
   * @name 打开白名单开关
   */
  async openSwitchStatus(data = {}) {
    const url = '/console/switch/whitelist/open';
    return httpPut(url, data);
  },
  /**
   * @name 关闭白名单开关
   */
  async closeSwitchStatus(data = {}) {
    const url = '/console/switch/whitelist/close';
    return httpPut(url, data);
  }
};

export default WhitelistSwitchService;
