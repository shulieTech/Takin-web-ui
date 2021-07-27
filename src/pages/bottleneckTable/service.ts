import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const MissionManageService = {
  /**
   * @name 获取字典
   */
  async queryPatrolSceneAndDashbordList(data = {}) {
    const url = '/link/dictionary';
    return httpGet(url, data);
  },
  /**
   * @name 添加误报
   */
  async mistake(data = {}) {
    const url = '/patrol/manager/exception/mistake';
    return httpPost(url, data);
  },
  /**
   * @name 获取场景详情
   */
  async queryMistakeDetail(exceptionId) {
    const url = `/patrol/manager/exception/mistake_info?exceptionId=${exceptionId}`;
    return httpPost(url);
  },
  /**
   * @name 新增场景
   */
  async addScene(data = {}) {
    const url = '/patrol/manager/scene/create';
    return httpPost(url, data);
  },
  /**
   * @name 场景详情
   */
  async exceptionDetail(id) {
    if (id.chainId) {
      const urls = `/patrol/manager/exception/query_related_items?chainId=${id.chainId}`;
      return httpPost(urls);
    }
    const url = `/patrol/manager/exception/query_related_items?exceptionId=${id.exceptionId}`;
    return httpPost(url);

  },

  async read(data = {}) {
    const url = '/patrol/manager/exception_config/read';
    return httpPost(url, data);
  },

  async topology(activityId) {
    const url = `/patrol/manager/exception/detail/topology?activityId=${activityId.activityId}`;
    return httpPost(url);
  },

  async statistics(data = {}) {
    const url = '/patrol/manager/exception/detail/statistics';
    return httpPost(url, data);
  },
  // 检查点信息
  async checkpoint(data = {}) {
    const url = '/patrol/manager/exception/detail/checkpoint';
    return httpPost(url, data);
  },
  // 流量信息
  async metrics(data = {}) {
    const url = '/patrol/manager/exception/detail/metrics';
    return httpPost(url, data);
  },
};

export default MissionManageService;
