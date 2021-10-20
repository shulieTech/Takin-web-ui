import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const ErrorLogService = {
  /**
   * @name 获取探针异常日志
   */
  async queryErrorLogList(data = {}) {
    const url = '/fast/agent/access/errorLog/list';
    return httpGet(url, data);
  }
     
};

export default ErrorLogService;
