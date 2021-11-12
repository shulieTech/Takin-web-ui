import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const BusinessFlowService = {
  /**
   * @name 获取所有业务活动
   */
  async queryBussinessActive(data = {}) {
    const url = '/link/bussinessActive';
    return httpGet(url, data);
  },
  /**
   * @name 获取所有系统流程列表
   */
  async querySystemFlowList(data = {}) {
    const url = '/link/tech/linkmanage/all';
    return httpGet(url, data);
  },
  /**
   * @name 获取业务流程详情
   */
  async queryBusinessActivityDetail(data = {}) {
    const url = '/link/scene/tree/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取业务流程页面的中间件去重
   */
  async querySceneMiddlewares(data = {}) {
    const url = '/link/scene/middlewares';
    return httpPost(url, data);
  },
  /**
   * @name 新增业务流程节点
   */
  async addBusinessFlowNode(data = {}) {
    const url = '/link/scene/manage';
    return httpPost(url, data);
  },
  /**
   * @name 新增业务流程
   */
  async addBusinessFlow(data = {}) {
    const url = '/link/scene/tree/add';
    return httpPost(url, data);
  },
  /**
   * @name 编辑业务流程
   */
  async editBusinessFlow(data = {}) {
    const url = '/link/scene/tree/modify';
    return httpPost(url, data);
  },
  /**
   * @name 删除业务流程
   */
  async deleteBusinessFlow(data = {}) {
    const url = '/link/scene/manage';
    return httpDelete(url, data);
  }
};

export default BusinessFlowService;
