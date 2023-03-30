import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const FailOrderService = {
  /**
   * @name 人工处理
   */
  async failDeal(data = {}) {
    const url = '/ecloud/machine/failed/deal';
    return httpPut(url, data);
  },
  
};

export default FailOrderService;
