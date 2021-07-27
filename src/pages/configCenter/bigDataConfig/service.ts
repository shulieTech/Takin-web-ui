import { httpPost } from 'src/utils/request';
const BigDataService = {
  async updateConfig(data) {
    const url = '/pradar/switch/update';
    return httpPost(url, data);
  }
};

export default BigDataService;
