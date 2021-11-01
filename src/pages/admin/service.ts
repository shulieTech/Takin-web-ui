import { httpPost, httpGet, httpPut } from 'src/utils/request';

const agentService = {
  /**
   * @name 获取探针列表
   */
  async allVersionList(data = {}) {
    const url = '/fast/agent/access/allVersionList';
    return httpGet(url, data);
  },
  /**
   * @name 列表
   */
  async agentList(data = {}) {
    const url = '/fast/agent/access/list';
    return httpGet(url, data);
  },
  /**
   * @name 下载
   */
  async download(data = {}) {
    const url = '/fast/agent/access/download';
    return httpGet(url, data);
  },
  /**
   * @name 下载
   */
  async upload(data = {}) {
    const url = '/fast/agent/access/agent/upload';
    return httpPut(url, data);
  },

  async checkZhKey(data = {}) {
    const url = '/fast/agent/access/config/checkZhKey';
    return httpGet(url, data);
  },

  async checkEnKey(data = {}) {
    const url = '/fast/agent/access/config/checkEnKey';
    return httpGet(url, data);
  },
  async release(data = {}) {
    const url = '/fast/agent/access/release';
    return httpPost(url, data);
  }
};

export default agentService;
