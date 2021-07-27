import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const E2EBigScreenService = {
  /**
   * @name 获取汇总数量
   */
  async queryTotalNums(data = {}) {
    const url = '/patrol/screen/all';
    return httpGet(url, data);
  },
  /**
   * @name 获取看板数据
   */
  async queryBoardDatas(data = {}) {
    const url = '/patrol/screen/statistic';
    return httpGet(url, data);
  },
  /**
   * @name 获取看板详情
   */
  async queryBoardDetail(data = {}) {
    const url = '/patrol/screen/detail';
    return httpGet(url, data);
  }
};

export default E2EBigScreenService;
