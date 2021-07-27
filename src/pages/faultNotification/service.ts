import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const MissionManageService = {
  /**
   * @name 获取巡检场景和巡检看板列表
   */
  async queryPatrolSceneAndDashbordList(data = {}) {
    const url = '/link/dictionary';
    return httpGet(url, data);
  },
  /**
   * @name 删除巡检任务
   */
  async deleteMission(data = {}) {
    const url = '/patrol/manager/exception_notice/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 创建巡检异常通知规则
   */
  async createMission(data = {}) {
    const url = '/patrol/manager/exception_notice/create';
    return httpPost(url, data);
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
  async editMission(data = {}) {
    const url = '/patrol/manager/exception_notice/edit';
    return httpPost(url, data);
  },
  /**
   * @name 获取巡检场景和巡检看板列表
   */
  async queryPatrolSceneList(data = {}) {
    const url = '/patrol/board/get';
    return httpPost(url, data);
  },

  async queryList(data = {}) {
    const url = '/patrol/manager/scene/get';
    return httpPost(url, data);
  },

  async queryText(data = {}) {
    const url = '/patrol/manager/exception_notice/test';
    return httpPost(url, data);
  }
};

export default MissionManageService;
