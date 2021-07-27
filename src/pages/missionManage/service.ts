import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const MissionManageService = {
  /**
   * @name 获取巡检场景和巡检看板列表
   */
  async queryPatrolSceneAndDashbordList(data = {}) {
    const url = '/patrol/manager/init';
    return httpGet(url, data);
  },

  async patrolDashbordDataSourceList(data = {}) {
    const url = '/patrol/board/get';
    return httpPost(url, data);
  },
  /**
   * @name 删除巡检任务
   */
  async deleteMission(data = {}) {
    const url = '/patrol/manager/scene/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 启动巡检任务
   */
  async startMission(data = {}) {
    const url = '/patrol/manager/scene/start';
    return httpGet(url, data);
  },
  /**
   * @name 关闭巡检任务
   */
  async closeMission(data = {}) {
    const url = '/patrol/manager/scene/stop';
    return httpGet(url, data);
  },
  /**
   * @name 获取场景详情
   */
  async querySceneDetail(data = {}) {
    const url = '/';
    return httpGet(url, data);
  },
  /**
   * @name 新增场景
   */
  async addScene(data = {}) {
    const url = '/patrol/manager/scene/create';
    return httpPost(url, data);
  },
  /**
   * @name 编辑场景
   */
  async editScene(data = {}) {
    const url = '/';
    return httpPut(url, data);
  },

  async editBoard(data = {}) {
    const url = '/patrol/board/update';
    return httpPost(url, data);
  },
  /**
   * @name 查看看板
   */
  async queryBoard(data = {}) {
    const url = '/patrol/board/get';
    return httpPost(url, data);
  },
  /**
   * @name 新增看板
   */
  async newBoard(data = {}) {
    const url = '/patrol/board/create';
    return httpPost(url, data);
  },

  async sceneDetail(data = {}) {
    const url = '/patrol/manager/scene/detail';
    return httpGet(url, data);
  },

  async sceneDelete(boardId) {
    const url = `/patrol/board/delete?boardId=${boardId}`;
    return httpDelete(url);
  },

  async assertGet(data = {}) {
    const url = '/patrol/manager/assert/get';
    return httpGet(url, data);
  },

  async nodeGet(data = {}) {
    const url = '/patrol/manager/node/get';
    return httpPost(url, data);
  },

  async createOrUpdate(data = {}) {
    const url = '/patrol/manager/assert/createOrUpdate';
    return httpPost(url, data);
  },

  async nodeAdd(data = {}) {
    const url = '/patrol/manager/node/add';
    return httpPost(url, data);
  },

  async sceneUpdate(data = {}) {
    const url = '/patrol/manager/scene/update';
    return httpPost(url, data);
  },

  async sceneException(data = {}) {
    const url = '/patrol/manager/error/get';
    return httpGet(url, data);
  },

  async nodeDelete(id) {
    const url = `/patrol/manager/node/delete?chainId=${id}`;
    return httpDelete(url);
  },

  async timeList(data = {}) {
    const url = '/patrol/manager/scene/get';
    return httpPost(url, data);
  },

  async checkStartStatus(data = {}) {
    const url = '/patrol/manager/scene/checkStartStatus';
    return httpPost(url, data);
  },

  async checkStopStatus(data = {}) {
    const url = '/patrol/manager/scene/checkStopStatus';
    return httpPost(url, data);
  },
};

export default MissionManageService;
