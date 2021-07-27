import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const DemoService = {
  /**
   * @name 获取Demo
   */
  async queryDemo(data = {}) {
    const url = '/';
    return httpGet(url, data);
  }
};

export default DemoService;
