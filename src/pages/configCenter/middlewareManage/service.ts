import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const MiddlewareManageService = {
  /**
   * @name 获取中间件概况
   */
  async queryMiddlewareDashboard(data = {}) {
    const url = '/application/middlewareSummary/summary';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件汇总列表
   */
  async queryMiddlewareSummaryList(data = {}) {
    const url = '/application/middlewareSummary/list';
    return httpGet(url, data);
  },
  /**
   * @name 获取中间件版本详情列表
   */
  async queryMiddlewareList(data = {}) {
    const url = '/application/middlewareJar/list';
    return httpGet(url, data);
  },
  /**
   * @name 编辑中间件
   */
  async editMiddleware(data = {}) {
    const url = '/application/middlewareSummary/update';
    return httpPut(url, data);
  },
  /**
   * @name 导入中间件
   */
  async importMiddleware(data = {}) {
    const url = '/application/middlewareJar/import';
    return httpPost(url, data);
  },  
  /**
   * @name 导出中间件
   */
  async exportMiddleware(data = {}) {
    const url = '/application/middlewareSummary/export';
    return httpGet(url, data);
  },
  /**
   * @name 中间件比对
   */
  async compareMiddleware(data = {}) {
    const url = '/application/middlewareJar/compare';
    return httpPost(url, data);
  },
  /**
   * @name 编辑详情中间件
   */
  async editDetailMiddleware(data = {}) {
    const url = '/application/middlewareJar/update';
    return httpPut(url, data);
  }     
};

export default MiddlewareManageService;
