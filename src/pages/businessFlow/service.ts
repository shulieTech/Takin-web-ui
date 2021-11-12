import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const BusinessFlowService = {
  /**
   * @name 获取业务流程列表
   */
  async queryBusinessFlowList(data = {}) {
    const url = '/link/scene/manage';
    return httpGet(url, data);
  }
};

export default BusinessFlowService;
