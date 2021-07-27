import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const FlowAccountService = {
  /**
   * @name 获取流量账户列表
   */
  async queryFlowAccountList(data = {}) {
    const url = '/settle/balance/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取流量账户信息
   */
  async queryFlowAccountInfo(data = {}) {
    const url = '/settle/accountbook';
    return httpGet(url, data);
  },
  /**
   * @name 获取可用流量账户信息（dictionary）
   */
  async queryFlowAccountInfoDic(data = {}) {
    const url = '/settle/accountbook/dictionary';
    return httpGet(url, data);
  }
};

export default FlowAccountService;
