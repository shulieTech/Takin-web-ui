import { httpDelete, httpGet, httpPost, httpPut } from 'src/utils/request';

const OrderMachineService = {
  /**
   * @name 新增订购机器
   */
  async addUser(data = {}) {
    const url = '/user/add';
    return httpPost(url, data);
  },
};

export default OrderMachineService;
