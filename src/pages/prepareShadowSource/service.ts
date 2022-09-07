import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

export default {
  /**
   * @name 链路列表
   */
  async getLinkList(data = {}) {
    const url = '/pressureResource/list';
    return httpGet(url, data);
  },
  /**
   * @name 添加链路
   */
  async addLink(data = {}) {
    const url = '/pressureResource/create';
    return httpPost(url, data);
  },
  /**
   * @name 更新链路
   */
  async updateLink(data = {}) {
    const url = '/pressureResource/update';
    return httpPost(url, data);
  },
  /**
   * @name 链路详情
   */
  async getLinkDetail(data = {}) {
    const url = '/pressureResource/detailList';
    return httpGet(url, data);
  },
  /**
   * @name 应用下拉列表
   */
  async appList(data = {}) {
    const url = '/application/names';
    return httpGet(url, data);
  },
  /**
   * @name 入口path列表
   */
  async entryList(data = {}) {
    const url = '/application/entrances/list';
    return httpGet(url, data);
  },
  /**
   * @name 中间件下拉列表
   */
  async middlewareList(data = {}) {
    const url = '/v2/link/ds/support/name/new';
    return httpGet(url, data);
  },
  /**
   * @name 应用检查列表
   */
  async appCheckList(data = {}) {
    const url = '/pressureResource/app/checkList';
    return httpGet(url, data);
  },
  /**
   * @name 数据源新增
   */
  async addDatasource(data = {}) {
    const url = '/pressureResource/ds/create';
    return httpPost(url, data);
  },
  /**
   * @name 数据源模式列表
   */
  async datasourceViewMode(data = {}) {
    const url = '/pressureResource/ds/listByDs';
    return httpGet(url, data);
  },
  /**
   * @name 应用视图模式列表
   */
  async appViewMode(data = {}) {
    const url = '/pressureResource/ds/listByApp';
    return httpGet(url, data);
  },
  /**
   * @name 新增影子表
   */
  async addShadowTable(data = {}) {
    const url = '/pressureResource/table/save';
    return httpPost(url, data);
  },
  /**
   * @name 修改影子表
   */
  async updateShadowTable(data = {}) {
    const url = '/pressureResource/table/update';
    return httpPost(url, data);
  },
  /**
   * @name 删除影子表
   */
  async deleteShadowTable(data = {}) {
    const url = '/pressureResource/table/del';
    return httpGet(url, data);
  },
  /**
   * @name 影子表列表
   */
  async listShadowTable(data = {}) {
    const url = '/pressureResource/table/list';
    return httpGet(url, data);
  },
  /**
   * @name 导入配置文件
   */
  async importConfigFile(data = {}) {
    const url = '/pressureResource/ds/import';
    return httpPost(url, data);
  },
  /**
   * @name 导出配置文件
   */
  async exportConfigFile(data = {}) {
    const url = '/pressureResource/ds/export';
    return httpGet(url, data);
  },
};
