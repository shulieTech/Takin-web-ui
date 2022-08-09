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
    // const url = '/scenemanage/flow/calc';
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
    const url = '/asset/account_book/un_safe';
    return httpGet(url, data);
  },
  /**
   * @name 获取发生偏移数据数
   */
  async queryDataScriptNum(data) {
    const url = '/scenemanage/positionPoint';
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
   * @name 启动中停止
   */
  async scencePreStop(data) {
    const url = '/scene/task/preStop';
    return httpPut(url, data);
  },

  async applicationList(data) {
    const url = '/activities/application/list';
    return httpGet(url, data);
  },
  // 启动压测场景检测
  async scenceStartPreCheck(data) {
    const url = '/scene/task/preCheck';
    return httpGet(url, data);
  },
  /**
   * @name 恢复被归档的压测场景
   */
  async scenceRecovery(data) {
    const url = '/scenemanage/recovery';
    return httpPut(url, data);
  },
  /**
   * @name 归档压测场景
   */
  async scenceArchive(data) {
    const url = '/scenemanage/archive';
    return httpPut(url, data);
  },
  /**
   * @name 查询机器列表
   * 这个服务会被多个地方调用
   */
  async queryTestMachine(params) {
    const url = '/scenemanage/machine';
    const { data: { success, data } } = await httpGet(url, params);
    if (success) {
      let defaultMachine = undefined;
      const list = data.list || [];
      if (
        data.lastStartMachineId &&
        list.some((y) => y.id === data.lastStartMachineId)
      ) {
        // 使用上次启动的机器
        defaultMachine = data.lastStartMachineId;
      } else if (list.find((x) => x.type === 1 && !x.disabled)) {
        // 使用私网机器
        defaultMachine = list.find((x) => x.type === 1 && !x.disabled)?.id;
      } else {
        // 使用公网机器
        defaultMachine = list.find((x) => x.type === 0 && !x.disabled)?.id;
      }
      return {
        machineId: defaultMachine,
        machineList: list,
      };
    }
  },
};

export default PressureTestSceneService;
