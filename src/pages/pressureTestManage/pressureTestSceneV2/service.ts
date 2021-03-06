import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const PressureTestSceneService = {
  /**
   * @name 新增压测场景
   */
  async addPressureTestScene(data = {}) {
    const url = '/scenemanage';
    return httpPost(url, data);
  },
  /**
   * @name 编辑压测场景
   */
  async editPressureTestScene(data = {}) {
    const url = '/scenemanage';
    return httpPut(url, data);
  },
  /**
   * @name 删除压测场景
   */
  async deletePressureTestScene(data = {}) {
    const url = '/scenemanage';
    return httpDelete(url, data);
  },
  /**
   * @name 检查启动状态
   */
  async checkStartStatus(data = {}) {
    const url = '/scene/task/checkStartStatus';
    return httpGet(url, data);
  },
  /**
   * @name 开始压测
   */
  async startPressureTestScene(data = {}) {
    const url = '/scene/task/start';
    return httpPost(url, data);
  },
  /**
   * @name 停止压测
   */
  async stopPressureTestScene(data = {}) {
    const url = '/scene/task/stop';
    return httpPost(url, data);
  },
  /**
   * @name 获取压测场景详情
   */
  async getPressureTestSceneDetail(data = {}) {
    const url = '/scenemanage/detail';
    return httpGet(url, data);
  },
  /**
   * @name 上传文件
   */
  async uploadFiles(data = {}) {
    const url = '/file/upload';
    return httpPost(url, data);
  },
  /**
   * @name 删除文件
   */
  async deleteFiles(data = {}) {
    const url = '/file';
    return httpDelete(url, data);
  },
  /**
   * @name 获取最大机器数量
   */
  async getMaxMachineNumber(data = {}) {
    const url = '/scenemanage/ipnum';
    return httpGet(url, data);
  },
  /**
   * @name 获取预计消耗流量
   */
  async getEstimateFlow(data = {}) {
    const url = '/asset/calc/estimate';
    return httpPost(url, data);
  },
  /**
   * @name 获取所有业务活动和脚本列表
   */
  async queryBussinessActivityAndScript(data = {}) {
    const url = '/scriptManage/businessActivity/all';
    return httpGet(url, data);
  },
  /**
   * @name 获取所有业务流程和脚本列表
   */
  async queryBussinessFlowAndScript(data = {}) {
    const url = '/scriptManage/businessFlow/all';
    return httpGet(url, data);
  },
  /**
   * @name 根据业务流程获取所有业务活动列表
   */
  async queryBussinessActivityListWithBusinessFlow(data = {}) {
    const url = '/link/business/manage/getBusinessActiveByFlowId';
    return httpGet(url, data);
  },
  /**
   * @name 查询场景下是否配置漏数脚本
   */
  async queryHasMissingDataScript(data = {}) {
    const url = '/leak/sql/scene';
    return httpGet(url, data);
  },
  async queryTagList(data) {
    const url = '/scenemanage/tag';
    return httpGet(url, data);
  },
  async addTags(data) {
    const url = '/scenemanage/tag/ref';
    return httpPost(url, data);
  },
  async closeTiming(data) {
    const url = '/scenemanage/scheduler';
    return httpDelete(url, data);
  },
  /**
   * @name 获取可用流量账户信息（dictionary）
   */
  async queryFlowAccountInfoDic(data = {}) {
    const url = '/asset/account_book';
    return httpGet(url, data);
  },
  /**
   * @name 获取发生偏移数据数
   */
  async queryDataScriptNum(data) {
    const url = '/scenemanage/positionPoint';
    return httpGet(url, data);
  },

  // =================== v2 ===========

  /**
   * @name 获取业务流程列表
   */
  async business_activity_flow(data) {
    const url = '/v2/scene/business_activity_flow';
    return httpGet(url, data);
  },
  /**
   * @name 创建压测场景
   */
  async createSenceV2(data = {}) {
    const url = '/v2/scene/create';
    return httpPost(url, data);
  },
  /**
   * @name 更新压测场景
   */
  async updateSenceV2(data = {}) {
    const url = '/v2/scene/update';
    return httpPost(url, data);
  },
  /**
   * @name 获取压测场景详情
   */
  async getSenceDetailV2(data) {
    const url = '/v2/scene/detail';
    return httpGet(url, data);
  },
  /**
   * 
   * @param data 
   * @returns 
   */
  async getThreadTree(data) {
    const url = '/v2/scene/business_activity_flow/detail';
    return httpGet(url, data);
  },
  // /**
  //  * @name 业务流程详情获取
  //  */
  // async sceneDetail(data) {
  //   const url = '/businessFlow/scene/detail';
  //   return httpGet(url, data);
  // },
  // /**
  //  * @name 业务流程详情获取线程组内容详情
  //  */
  // async threadGroupDetail(data) {
  //   const url = '/businessFlow/scene/threadGroupDetail';
  //   return httpGet(url, data);
  // },
  /**
   * @name 获取漏数验证脚本
   */
  async getValidateSql(data = {}) {
    const url = '/v2/scene/business_activity_flow/leak_sql';
    return httpGet(url, data);
  },
  async querySuggestPodNum(data) {
    const url = '/v2/scene/pod_number';
    return httpPost(url, data);
  },
  async applicationList(data) {
    const url = '/v2/activities/application/list';
    return httpGet(url, data);
  },
};

export default PressureTestSceneService;
