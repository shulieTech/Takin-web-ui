import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const IndexService = {
  /**
   * @name 获取快捷入口数据
   */
  async queryQuickEntrance(data = {}) {
    const url = '/user/work/bench/access';
    return httpGet(url, data);
  },
  /**
   * @name 获取压测场景列表
   */
  async queryPressureTestSceneList(data = {}) {
    const url = '/scenemanage/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取压测报告列表
   */
  async queryPressureTestReportList(data = {}) {
    const url = '/report/listReport';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用和系统流程
   */
  async queryAppAndSystemFlow(data = {}) {
    const url = '/user/work/bench';
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

export default IndexService;
