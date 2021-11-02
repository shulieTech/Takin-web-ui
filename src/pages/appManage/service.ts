import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const AppManageService = {
  /**
   * @name 获取影子库表列表
   */
  async queryDbAndTableList(data = {}) {
    const url = '/v2/link/ds/manage';
    return httpGet(url, data);
  },
  /**
   * @name 新增应用
   */
  async addApp(data = {}) {
    const url = '/console/application/center/app/info';
    return httpPost(url, data);
  },
  /**
   * @name 编辑应用
   */
  async editApp(data = {}) {
    const url = '/console/application/center/app/info';
    return httpPut(url, data);
  },
  /**
   * @name 删除应用
   */
  async deleteApp(data = {}) {
    const url = '/console/application/center/app/info';
    return httpDelete(url, data);
  },
  /**
   * @name 获取app应用详情
   */
  async queryAppManageDetail(data = {}) {
    const url = '/console/application/center/app/info';
    return httpGet(url, data);
  },
  /**
   * @name 修改app应用的状态
   */
  async editAppStatus(data = {}) {
    const url = '/application/center/app/switch';
    return httpPut(url, data);
  },
  /**
   * @name 禁用、启用影子库表
   */
  async openAndClose(data = {}) {
    const url = '/v2/link/ds/enable';
    return httpPut(url, data);
  },
  /**
   * @name 新增影子库表
   */
  async addDbTable(data = {}) {
    const url = '/link/ds/manage';
    return httpPost(url, data);
  },
  /**
   * @name 编辑影子库表
   */
  async editDbTable(data = {}) {
    const url = '/link/ds/manage';
    return httpPut(url, data);
  },
  /**
   * @name 新增影子库表（老版本）
   */
  async addDbTableOld(data = {}) {
    const url = '/link/ds/manage/old';
    return httpPost(url, data);
  },
  /**
   * @name 编辑影子库表（老版本）
   */
  async editDbTableOld(data = {}) {
    const url = '/link/ds/manage/old';
    return httpPut(url, data);
  },
  /**
   * @name 编辑动态影子库表
   */
  async editDynamicDbTable(data = {}) {
    const url = '/v2/link/ds/config';
    return httpPost(url, data);
  },
  /**
   * @name 新增动态影子库表
   */
  async addDynamicDbTable(data = {}) {
    const url = '/v2/link/ds/config/create';
    return httpPost(url, data);
  },
  /**
   * @name 删除影子库表
   */
  async deleteDbTable(data = {}) {
    const url = '/v2/link/ds/config/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 获取影子库表隔离方案模板
   */
  async queryTemplate(data = {}) {
    const url = '/v2/link/ds/config/template';
    return httpPost(url, data);
  },
  /**
   * @name 获取影子库表详情
   */
  async queryDbTableDetail(data = {}) {
    const url = '/link/ds/manage/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取动态影子库表详情
   */
  async queryDynamicDbTableDetail(data = {}) {
    const url = '/v2/link/ds/manage/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取影子库表详情(老版本)
   */
  async queryDbTableDetailOld(data = {}) {
    const url = '/link/ds/manage/detail/old';
    return httpGet(url, data);
  },
  /**
   * @name 获取动态影子库表隔离方案
   */
  async queryDynamicProgramme(data = {}) {
    const url = '/v2/link/ds/manage/programme';
    return httpGet(url, data);
  },
  /**
   * @name 新增挡板配置
   */
  async addBaffleConfig(data = {}) {
    const url = '/console/link/guard/guardmanage';
    return httpPost(url, data);
  },
  /**
   * @name 修改挡板配置
   */
  async editBaffleConfig(data = {}) {
    const url = '/console/link/guard/guardmanage';
    return httpPut(url, data);
  },
  /**
   * @name 删除挡板配置
   */
  async deleteBaffleConfig(data = {}) {
    const url = '/console/link/guard/guardmanage';
    return httpDelete(url, data);
  },
  /**
   * @name 获取挡板配置详情
   */
  async queryBaffleConfigDetail(data = {}) {
    const url = '/console/link/guard/guardmanage/info';
    return httpGet(url, data);
  },
  /**
   * @name 获取挡板列表
   */
  async queryAllJobList(data = {}) {
    const url = '/console/link/guard/guardmanage';
    return httpGet(url, data);
  },
  /**
   * @name 禁用、启用出口挡板
   */
  async openAndCloseExitJob(data = {}) {
    const url = '/console/link/guard/guardmanage/switch';
    return httpPut(url, data);
  },
  /**
   * @name 新增Job
   */
  async addJob(data = {}) {
    const url = '/console/shadow/job/insert';
    return httpPost(url, data);
  },
  /**
   * @name 修改Job
   */
  async editJob(data = {}) {
    const url = '/console/shadow/job/update';
    return httpPut(url, data);
  },
  /**
   * @name 删除Job
   */
  async deleteJob(data = {}) {
    const url = '/console/shadow/job/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 获取Job详情
   */
  async queryJobDetail(data = {}) {
    const url = '/console/shadow/job/query/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取Job列表
   */
  async queryJobList(data = {}) {
    const url = '/console/shadow/job/query';
    return httpGet(url, data);
  },
  /**
   * @name 禁用、启用job
   */
  async openAndCloseJob(data = {}) {
    const url = '/console/shadow/job/updateStatus';
    return httpPut(url, data);
  },
  /**
   * @name 获取压测开关状态
   */
  async querySwitchStatus(data = {}) {
    const url = '/application/center/app/switch';
    return httpGet(url, data);
  },
  /**
   * @name 修改压测开关状态
   */
  async editSwitchStatus(data = {}) {
    const url = '/application/center/app/switch';
    return httpPut(url, data);
  },
  /**
   * @name 重试修改压测开关状态
   */
  async retryEditSwitchStatus(data = {}) {
    const url = '/application/center/app/switch/calculate';
    return httpGet(url, data);
  },
  /**
   * @name 新增白名单
   */
  async addWhiteList(data = {}) {
    const url = '/application/whitelist';
    return httpPost(url, data);
  },
  /**
   * @name 修改白名单
   */
  async editWhiteList(data = {}) {
    const url = '/application/whitelist/update';
    return httpPut(url, data);
  },
  /**
   * @name 删除白名单
   */
  async deleteWhiteList(data = {}) {
    const url = '/application/whitelist';
    return httpDelete(url, data);
  },
  /**
   * @name 获取白名单详情
   */
  async queryWhiteListDetail(data = {}) {
    const url = '/link/white/list/wlist/info';
    return httpGet(url, data);
  },
  /**
   * @name 禁用、启用白名单
   */
  async openAndCloseWhiteList(data = {}) {
    const url = '/application/whitelist';
    return httpPut(url, data);
  },
  /**
   * @name 获取白名单列表
   */
  async queryWhiteListList(data = {}) {
    const url = '/application/whitelist';
    return httpGet(url, data);
  },
  /**
   * @name 获取挡板模板
   */
  async queryConfig(data = {}) {
    const url = '/base/config';
    return httpGet(url, data);
  },
  /**
   * @name 获取应用角色列表
   */
  async queryAppRoleList(data = {}) {
    const url = '/auth/app/role';
    return httpGet(url, data);
  },
  /**
   * @name 获取成员配置角色列表
   */
  async queryMemberConfigRoleList(data = {}) {
    const url = '/auth/role/user';
    return httpGet(url, data);
  },
  /**
   * @name 移除成员
   */
  async deleteRoleMember(data = {}) {
    const url = '/auth/role/user';
    return httpDelete(url, data);
  },
  /**
   * @name 获取员工列表
   */
  async queryUserList(data = {}) {
    const url = '/auth/dept/user';
    return httpPost(url, data);
  },
  /**
   * @name 添加角色成员
   */
  async addRoleMember(data = {}) {
    const url = '/auth/role/user';
    return httpPost(url, data);
  },
  /**
   * @name 获取部门结构
   */
  async queryDept(data = {}) {
    const url = '/auth/dept/tree';
    return httpGet(url, data);
  },
  /**
   * @name 获取节点列表
   */
  async queryNodeManageListOld(data = {}) {
    const url = '/application/node/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取节点列表
   */
  async queryNodeManageList(data = {}) {
    const url = '/v2/application/node/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取节点数
   */
  async queryNodeNumOld(data = {}) {
    const url = '/application/node/dashboard';
    return httpGet(url, data);
  },
  /**
   * @name 获取节点数
   */
  async queryNodeNum(data = {}) {
    const url = '/v2/application/node/dashboard';
    return httpGet(url, data);
  },
  /**
   * @name 获取插件列表
   */
  async queryPuginManageList(data = {}) {
    const url = '/application/plugins/config/page';
    return httpGet(url, data);
  },
  /**
   * @name 编辑插件
   */
  async editPugin(data = {}) {
    const url = '/application/plugins/config/update';
    return httpPut(url, data);
  },

  /**
   * @name 获取应用异常列表
   */
  async queryAppErrorList(data = {}) {
    const url = '/application/error/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取影子消费者MQ类型
   */
  async queryMQType(data = {}) {
    const url = '/v2/consumers/type';
    return httpGet(url, data);
  },
  /**
   * @name 获取影子消费者隔离方案
   */
  async queryMQPlan(data = {}) {
    const url = '/v2/consumers/type/programme';
    return httpGet(url, data);
  },
  /**
   * @name 新增影子消费
   */
  async createShdowConsumer(data = {}) {
    const url = '/v2/consumers/create';
    return httpPost(url, data);
  },
  /**
   * @name 编辑影子消费
   */
  async updateShdowConsumer(data = {}) {
    const url = '/v2/consumers/update';
    return httpPut(url, data);
  },
  /**
   * @name 查询影子消费
   */
  async getShdowConsumer(data = {}) {
    const url = '/consumers/get';
    return httpGet(url, data);
  },
  /**
   * @name 设置批量消费
   */
  async batchSetConsumer(data = {}) {
    const url = '/consumers/operate';
    return httpPost(url, data);
  },
  /**
   * @name 删除影子消费
   */
  async deleteConsumer(data = {}) {
    const url = '/consumers/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 导出应用配置
   */
  async exportAppConfig(data = {}) {
    const url = '/application/center/app/config/url';
    return httpGet(url, data);
  },
  /**
   * @name 导入应用配置
   */
  async importAppConfig(data = {}) {
    const url = '/application/center/app/config/import';
    return httpPost(url, data);
  },
  /**
   * @name 获取agent版本
   */
  async queryAgentStatus(data = {}) {
    const url = '/application/center/app/config/ds/isnew';
    return httpGet(url, data);
  },
  /**
   * @name 获取agent版本(forTabs)
   */
  async queryAgentForTabsStatus(data = {}) {
    const url = '/config/application/newAgent';
    return httpGet(url, data);
  },
  /**
   * @name 获取黑名单列表
   */
  async queryBlackListList(data = {}) {
    const url = '/application/blacklist/list';
    return httpGet(url, data);
  },
  async monitorDetailes(data = {}) {
    const url = '/application/center/app/monitorDetailes';
    return httpGet(url, data);
  },
  /**
   * @name 删除黑名单（单个）
   */
  async deleteBlacklist(data = {}) {
    const url = '/application/blacklist';
    return httpDelete(url, data);
  },
  /**
   * @name 删除黑名单（批量）
   */
  async deleteBlacklistList(data = {}) {
    const url = '/application/blacklist/list';
    return httpDelete(url, data);
  },
  /**
   * @name 获取黑名单详情
   */
  async queryBlacklistDetail(data = {}) {
    const url = '/application/blacklist';
    return httpGet(url, data);
  },
  /**
   * @name 增加黑名单
   */
  async addBlacklist(data = {}) {
    const url = '/application/blacklist';
    return httpPost(url, data);
  },
  /**
   * @name 编辑黑名单
   */
  async editBlacklist(data = {}) {
    const url = '/application/blacklist';
    return httpPut(url, data);
  },
  /**
   * @name 禁用、启用黑名单
   */
  async openAndCloseBlacklist(data = {}) {
    const url = '/application/blacklist/enable';
    return httpPut(url, data);
  },
  /**
   * @name 禁用、启用黑名单(批量)
   */
  async openAndCloseBlacklistList(data = {}) {
    const url = '/application/blacklist/list/enable';
    return httpPut(url, data);
  },
  /**
   * @name 白名单全局生效
   */
  async whiteListGlobal(data = {}) {
    const url = '/application/global';
    return httpGet(url, data);
  },
  /**
   * @name 白名单部分生效
   */
  async whiteListPart(data = {}) {
    const url = '/application/part';
    return httpPost(url, data);
  },
  /**
   * @name 获取所有应用列表
   */
  async queryAppList(data = {}) {
    const url = '/application/part';
    return httpGet(url, data);
  },

  /**
   * @name 卸载升级安装探针
   */
  async actionAgent(data = {}) {
    const url = '/v2/application/node/probe/operate';
    return httpPost(url, data);
  },
  /**
   * @name 获取探针列表
   */
  async queryAgentVersionList(data = {}) {
    const url = '/probe/list';
    return httpGet(url, data);
  },
  /**
   * @name 上传探针包
   */
  async uploadAgent(data = {}) {
    const url = '/v2/file/upload';
    return httpPost(url, data);
  },
  /**
   * @name 新增探针
   */
  async addAgent(data = {}) {
    const url = '/probe';
    return httpPost(url, data);
  },
  /**
   * @name 获取远程调用列表
   */
  async queryMockList(data = {}) {
    const url = '/application/remote/call/list';
    return httpGet(url, data);
  },
  /**
   * @name 编辑远程调用
   */
  async configMock(data = {}) {
    const url = '/v2/application/remote/call/update';
    return httpPost(url, data);
  },
  /**
   * @name 新增远程调用
   */
  async addMock(data = {}) {
    const url = '/v2/application/remote/call/add';
    return httpPost(url, data);
  },
  /**
   * @name 获取远程调用详情
   */
  async getMockDetail(data = {}) {
    const url = '/v2/application/remote/call/detail';
    return httpGet(url, data);
  },
  /**
   * @name 获取远程接口配置类型
   */
  async getConfigType(data = {}) {
    const url = '/v2/application/remote/call/config/select';
    return httpGet(url, data);
  },
  /**
   * @name 获取远程接口类型
   */
  async getMockType(data = {}) {
    const url = '/v2/application/remote/call/interface/type/select';
    return httpGet(url, data);
  },
  /**
   * @name 获取远程调用异常数
   */
  async getErrorCount(data = {}) {
    const url = '/application/remote/call/getException';
    return httpGet(url, data);
  },
  /**
   * @name 删除远程调用
   */
  async deleteMock(data = {}) {
    const url = '/v2/application/remote/call/delete';
    return httpDelete(url, data);
  },

  /**
   * @name 刷新应用状态
   */
  async refreshAppStatus(data = {}) {
    const url = '/';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件支持概况
   */
  async queryMiddlewareDashboard(data = {}) {
    const url = '/application/middleware/count';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件列表
   */
  async queryMiddlewareList(data = {}) {
    const url = '/application/middleware/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件列表
   */
  async compare(data = {}) {
    const url = '/application/middleware/compare';
    return httpPost(url, data);
  },
  /**
   * @name 探针一键卸载
   */
  async uninstall(data = {}) {
    const url = '/application/center/unstallAllAgent';
    return httpPost(url, data);
  },
  /**
   * @name 探针一键恢复
   */
  async recover(data = {}) {
    const url = '/application/center/resumeAllAgent';
    return httpPost(url, data);
  },
  /**
   * @name 获取中间件类型（新增）
   */
  async queryMiddleWareType(data = {}) {
    const url = '/v2/link/ds/support/new';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件名称（新增）
   */
  async queryMiddleWareName(data = {}) {
    const url = '/v2/link/ds/support/name/new';
    return httpGet(url, data);
  },
  /**
   * @name 获取缓存模式（新增）
   */
  async queryCacheType(data = {}) {
    const url = '/v2/link/ds/cache/type';
    return httpGet(url, data);
  },
  async attendService(data = {}) {
    const url = '/application/center/app/attendService';
    return httpPost(url, data);
  },
  async entrances(data = {}) {
    const url = '/application/entrances/all';
    return httpGet(url, data);
  },
  async allByActivity(data = {}) {
    const url = '/application/center/app/activityList' ;
    return httpGet(url, data);
  },
  async goActivityInfo(data = {}) {
    const url = '/application/center/app/gotoActivityInfo' ;
    return httpPost(url, data);
  },
};

export default AppManageService;
