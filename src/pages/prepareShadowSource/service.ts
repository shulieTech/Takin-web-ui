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
   * @name 删除链路
   */
  async deleteLink(data = {}) {
    const url = '/pressureResource/del';
    return httpGet(url, data);
  },
  /**
   * @name 链路详情
   */
  async getLinkDetail(data = {}) {
    const url = '/pressureResource/detailList';
    return httpGet(url, data);
  },
  /**
   * @name 设置隔离方式
   */
  async setIsolateType(data = {}) {
    const url = '/pressureResource/updateIsolate';
    return httpPost(url, data);
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
    const url = '/application/entrances/pageList';
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
   * @name 修改应用检查配置
   */
  async updateAppCheckRow(data = {}) {
    const url = '/pressureResource/app/update';
    return httpPost(url, data);
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
   * @name 删除手工数据源
   */
  async deleteDataSource(data = {}) {
    const url = '/pressureResource/ds/del';
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
   * @name 批量修改影子表加入状态
   */
  async batchUpdateShadowTable(data = {}) {
    const url = '/pressureResource/table/batchUpdate';
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
  /**
   * @name 应用统计信息
   */
  async appSummaryInfo(data = {}) {
    const url = '/pressureResource/appInfo';
    return httpGet(url, data);
  },
  /**
   * @name 数据源统计信息
   */
  async dataSourceSummaryInfo(data = {}) {
    const url = '/pressureResource/dsInfo';
    return httpGet(url, data);
  },
  /**
   * @name 步骤状态
   */
  async stepStatus(data = {}) {
    const url = '/pressureResource/progress';
    return httpGet(url, data);
  },
  /**
   * @name 接口类型下拉
   */
  async interfaceTypeList(data = {}) {
    const url = '/v2/application/remote/call/interface/type/select';
    return httpGet(url, data);
  },
  /**
   * @name 远程调用列表
   */
  async remoteCallList(data = {}) {
    const url = '/pressureResource/remotecall/list';
    return httpGet(url, data);
  },
  /**
   * @name 修改远程调用
   */
  async updateRemoteCall(data = {}) {
    const url = '/pressureResource/remotecall/update';
    return httpPost(url, data);
  },
  /**
   * @name 获取响应时间
   */
  async getAvgRt(data = {}) {
    const url = '/pressureResource/remotecall/avgRt';
    return httpGet(url, data);
  },
  /**
   * @name 检测mock
   */
  async mockcheck(data = {}) {
    const url = '/pressureResource/remotecall/mockcheck';
    return httpPost(url, data);
  },
  /**
   * @name mock模板列表
   */
  async mockTplList(data = {}) {
    const url = '/pressureResource/mockTpl/list';
    return httpGet(url, data);
  },
  /**
   * @name 进度清单
   */
  async progressList(data = {}) {
    const url = '/pressureResource/progress/list';
    return httpGet(url, data);
  },
  /**
   * @name 同步链路到其他环境
   */
  async syncLink(data = {}) {
    const url = '/pressureResource/syncLink';
    return httpPost(url, data);
  },
  /**
   * @name 获取关联的业务流程详情
   */
  async getFlowDetail(data = {}) {
    const url = '/businessFlow/scene/detail';
    return httpGet(url, data);
  },
  /**
   * @name 影子消费者列表
   */
  async shadowConsumerList(data = {}) {
    const url = '/pressureResource/mqconsumer/list';
    return httpGet(url, data);
  },
  /**
   * @name mq类型列表
   */
  async mqTypeList(data = {}) {
    const url = '/v2/consumers/type';
    return httpGet(url, data);
  },
  /**
   * @name 新增影子消费
   */
  async createShdowConsumer(data = {}) {
    const url = '/pressureResource/mqconsumer/create';
    return httpPost(url, data);
  },
  /**
   * @name 编辑影子消费
   */
  async updateShdowConsumer(data = {}) {
    const url = '/pressureResource/mqconsumer/update';
    return httpPost(url, data);
  },
  /**
   * @name 删除影子消费
   */
  async deleteConsumer(data = {}) {
    const url = '/pressureResource/mqconsumer/del';
    return httpGet(url, data);
  },
  /**
   * @name 是否消费影子topic
   */
  async toggleConsumer(data = {}) {
    const url = '/pressureResource/mqconsumer/consumerTag';
    return httpPost(url, data);
  },
  /**
   * @name 获取压测开关状态
   */
  async querySwitchStatus(data = {}) {
    const url = '/application/center/app/switch/un_safe';
    return httpGet(url, data);
  },
  /**
   * @name 获取agent版本
   */
  async queryAgentStatus(data = {}) {
    const url = '/application/center/app/config/ds/isnew';
    return httpGet(url, data);
  },
};
