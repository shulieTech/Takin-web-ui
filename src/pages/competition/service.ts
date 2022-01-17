import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const CompetitionService = {
  /**
   * @name 获取应用和系统流程
   */
  async reportList(data = {}) {
    const url = '/scene/report/list';
    return httpGet(url, data);
  },
  async sceneList(data = {}) {
    const url = '/scene/list';
    return httpGet(url, data);
  },
};

export default CompetitionService;
