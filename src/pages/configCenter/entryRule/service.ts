import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const EntryRuleService = {
  /**
   * @name 删除入口规则
   */
  async deleteEntryRule(data = {}) {
    const url = '/api/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 获取入口规则详情
   */
  async queryEntryRuleDetail(data = {}) {
    const url = '/api/getDetail';
    return httpGet(url, data);
  },
  /**
   * @name 增加入口规则
   */
  async addEntryRule(data = {}) {
    const url = '/api/add';
    return httpPost(url, data);
  },
  /**
   * @name 编辑入口规则
   */
  async editEntryRule(data = {}) {
    const url = '/api/update';
    return httpPut(url, data);
  }
};

export default EntryRuleService;
