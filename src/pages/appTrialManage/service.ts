import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const AppTrialManageService = {
  /**
   * @name 获取应用列表
   */
  async queryAppList(data = {}) {
    const url = '/application/center/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用详情
   */
  async queryAppDetail(data = {}) {
    const url = '/console/application/center/app/info';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件列表
   */
  async queryMiddleWareList(data = {}) {
    const url = '/app/middleware/query';
    return httpGet(url, data);
  },
  /**
   * @name 获取业务库表列表
   */
  async queryTableList(data = {}) {
    const url = '/link/ds/business/query';
    return httpGet(url, data);
  },
  /**
   * @name 获取影子表列表
   */
  async queryPtList(data = {}) {
    const url = '/link/ds/manage';
    return httpGet(url, data);
  },
  /**
   * @name 获取影子表详情
   */
  async queryPtTableDetail(data = {}) {
    const url = '/link/ds/manage/detail';
    return httpGet(url, data);
  },
  /**
   * @name 编辑影子表
   */
  async editPtTable(data = {}) {
    const url = '/link/ds/manage';
    return httpPut(url, data);
  },
  /**
   * @name 删除影子表
   */
  async deletePtTable(data = {}) {
    const url = '/link/ds/manage';
    return httpDelete(url, data);
  }
};

export default AppTrialManageService;
