import { httpPost, httpGet, httpPut, httpDelete } from 'src/utils/request';

const configService = {
  /**
   * @name 获取巡检场景和巡检看板列表
   */
  async configList(data = {}) {
    const url = '/fast/agent/access/config/list';
    return httpGet(url, data);
  },
  /**
   * @name 删除巡检任务
   */
  async write(data = {}) {
    const url = '/patrol/manager/exception_config/write';
    return httpPost(url, data);
  },
  async allApplication(data = {}) {
    const url = '/fast/agent/access/config/allApplication';
    return httpGet(url, data);
  },
  async allKey(data = {}) {
    const url = '/fast/agent/access/config/getValueOption';
    return httpGet(url, data);
  },
  async update(data = {}) {
    const url = '/fast/agent/access/config/update';
    return httpPut(url, data);
  },
  async countStatus(data = {}) {
    const url = '/fast/agent/access/config/countStatus';
    return httpGet(url, data);
  },
  async effectList(data = {}) {
    const url = '/fast/agent/access/config/effect/list';
    return httpGet(url, data);
  },
  async useGlobal(id) {
    const url = `/fast/agent/access/config/useGlobal?id=${id}`;
    return httpDelete(url);
  },
};

export default configService;
