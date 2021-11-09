import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const BusinessFlowService = {
  /**
   * @name 获取业务流程列表
   */
  async queryBusinessFlowList(data = {}) {
    const url = '/businessFlow/scene/list';
    return httpGet(url, data);
  },
  /**
   * @name 上传jmeter文件
   */
  async uploadJmeter(data = {}) {
    const url = '/file/upload';
    return httpPost(url, data);
  },
  /**
   * @name 保存jmeter并解析
   */
  async saveAndAnalysis(data = {}) {
    const url = '/businessFlow/parseScriptAndSave';
    return httpPost(url, data);
  },
  /**
   * @name 获取文件代码
   */
  async queryScriptCode(data = {}) {
    const url = '/scriptManage/explainScriptFile';
    return httpGet(url, data);
  },
  /**
   * @name 获取业务活动匹配进度
   */
  async queryMatchProcess(data = {}) {
    const url = '/businessFlow/autoMatchActivity';
    return httpPost(url, data);
  },
  /**
   * @name 获取业务流程详情
   */
  async queryDetail(data = {}) {
    const url = '/businessFlow/scene/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取线程组内容详情
   */
  async queryTreeData(data = {}) {
    const url = '/businessFlow/scene/threadGroupDetail';
    return httpGet(url, data);
  },

  /**
   * @name 获取入口应用
   */
  async queryEntryApp(data = {}) {
    const url = '/application/names';
    return httpGet(url, data);
  },
  /**
   * @name 获取入口path
   */
  async queryEntryPath(data = {}) {
    const url = '/application/entrances/bySamplerType';
    return httpGet(url, data);
  },
  /**
   * @name 获取业务活动名称
   */
  async queryBusinessActivityName(data = {}) {
    const url = '/activities/queryNormalActivities';
    return httpGet(url, data);
  },
  /**
   * @name 确认匹配
   */
  async confirmMatch(data = {}) {
    const url = '/businessFlow/matchActivity';
    return httpPost(url, data);
  },
  /**
   * @name 更新业务流程
   */
  async editBusinessFlowNew(data = {}) {
    const url = '/businessFlow/scene';
    return httpPut(url, data);
  },
  /**
   * @name 获取调试脚本历史记录列表
   */
  async queryDebugScriptRecordList(data = {}) {
    const url = '/scriptDebug/list';
    return httpGet(url, data);
  },
  /**
   * @name 开始调试
   */
  async startDebug(data = {}) {
    const url = '/scriptDebug/debug';
    return httpPost(url, data);
  },
  /**
   * @name 获取调试脚本历史记录详情
   */
  async queryScriptDebugDetail(data = {}) {
    const url = '/scriptDebug/detail';
    return httpGet(url, data);
  },
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
