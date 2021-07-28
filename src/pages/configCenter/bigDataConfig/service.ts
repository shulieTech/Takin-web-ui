import { httpPost, httpPut, httpDelete } from 'src/utils/request';
const BigDataService = {
  async updateConfig(data) {
    const url = '/pradar/switch/update';
    return httpPut(url, data);
  },
  async newConfig(data) {
    const url = '/pradar/switch/add';
    return httpPost(url, data);
  },
  async deleteConfig(data) {
    const url = '/pradar/switch/delete';
    return httpDelete(url, data);
  }
};

export default BigDataService;
