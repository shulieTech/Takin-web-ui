import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const IndexService = {
  /**
   * @name 获取快捷入口数据
   */
  async querySwitchStatus(data = {}) {
    const url = '/application/center/app/switch/un_safe';
    return httpGet(url, data);
  },
  async queryQuickEntrance(data = {}) {
    const url = '/workbench/user/access';
    return httpGet(url, data);
  },
  /**
   * @name 获取压测场景列表
   */
  async queryPressureTestSceneList(data = {}) {
    const url = '/scenemanage/list/un_safe';
    return httpGet(url, data);
  },
  /**
   * @name 获取压测报告列表
   */
  async queryPressureTestReportList(data = {}) {
    const url = '/report/listReport/un_safe';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用和系统流程
   */
  async queryAppAndSystemFlow(data = {}) {
    const url = '/workbench/user';
    return httpGet(url, data);
  },
  /**
   * @name 获取可用流量账户信息（dictionary）
   */
  async queryFlowAccountInfoDic(data = {}) {
    const url = '/asset/account_book/un_safe';
    return httpGet(url, data);
  },
  /**
   * @name 获取dashboard相关数据
   */
  async queryPackageInfo(data = {}) {
    const url = '/ecloud/package/into/tenant';
    return httpGet(url, data);
  }
};

export default IndexService;
