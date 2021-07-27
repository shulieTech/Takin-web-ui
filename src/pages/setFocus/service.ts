import { httpPost, httpPut } from 'src/utils/request';

const MissionManageService = {
  /**
   * @name 获取巡检场景和巡检看板列表
   */
  async read(data = {}) {
    const url = '/patrol/manager/exception_config/read';
    return httpPost(url, data);
  },
  /**
   * @name 删除巡检任务
   */
  async write(data = {}) {
    const url = '/patrol/manager/exception_config/write';
    return httpPost(url, data);
  },
};

export default MissionManageService;
