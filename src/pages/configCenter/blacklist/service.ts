import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const BlacklistService = {
  /**
   * @name 删除黑名单（批量，单个）
   */
  async deleteBlacklist(data = {}) {
    const url = '/confcenter/delete/blist';
    return httpDelete(url, data);
  },
  /**
   * @name 获取黑名单详情
   */
  async queryBlacklistDetail(data = {}) {
    const url = '/confcenter/query/blistbyid';
    return httpGet(url, data);
  },
  /**
   * @name 增加黑名单
   */
  async addBlacklist(data = {}) {
    const url = '/confcenter/add/blist';
    return httpPost(url, data);
  },
  /**
   * @name 编辑黑名单
   */
  async editBlacklist(data = {}) {
    const url = '/confcenter/update/blist';
    return httpPut(url, data);
  },
  /**
   * @name 禁用、启用黑名单
   */
  async openAndCloseBlacklist(data = {}) {
    const url = '/confcenter/useyn/blist';
    return httpPut(url, data);
  }
};

export default BlacklistService;
