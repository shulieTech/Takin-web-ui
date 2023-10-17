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
   * @name 获取业务流程详情
   */
  async queryPTSDetail(data = {}) {
    const url = '/pts/process/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取JavaRequest详情
   */
  async queryJavaRequestDetail(data = {}) {
    const url = '/pts/javaRequest/detail';
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
   * @name 保存业务流程文件
   */
  async saveUploadDataFile(data = {}) {
    const url = '/businessFlow/uploadDataFile';
    return httpPost(url, data);
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
   * @name 下载脚本文件
   */
  async downloadScript(data = {}) {
    const url = '/scriptManage/getZipFileUrl';
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
  },
  /**
   * @name 获取插件列表
   */
  async queryPluginList(data = {}) {
    const url = '/scriptManage/support/plugin/list/all';
    return httpGet(url, data);
  },
  /**
   * @name 获取插件版本列表
   */
  async queryPluginVersionList(data = {}) {
    const url = '/scriptManage/support/plugin/version';
    return httpGet(url, data);
  },
  /**
   * @name 查询机器列表
   */
  async queryTestMachine(data) {
    const url = '/scenemanage/machine';
    return httpGet(url, data);
  },

  /**
   * @name 新增PTS
   */
  async addPTS(data = {}) {
    const url = '/pts/process/add';
    return httpPost(url, data);
  },

  /**
   * @name 调试场景
   */
  async debugPTS(data = {}) {
    const url = '/pts/process/debug';
    return httpPost(url, data);
  },

  /**
   * @name 调试列表明细
   */
  async debugDetail(data = {}) {
    const url = '/pts/process/debug/record/list';
    return httpGet(url, data);
  },
  /**
   * @name 调试日志
   */
  async debugLog(data = {}) {
    const url = '/pts/process/debug/log';
    return httpGet(url, data);
  },
  /**
   * @name 获取函数列表
   */
  async queryFunctionList(data = {}) {
    const url = '/pts/function/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取函数列表
   */
  async functionDebug(data = {}) {
    const url = '/pts/function/debug';
    return httpPost(url, data);
  },
  /**
   * @name 下载
   */
  async download(data = {}) {
    const url = '/confcenter/takinConfig/queryGlobalConfig';
    return httpGet(url, data);
  },
  
};

export default BusinessFlowService;
