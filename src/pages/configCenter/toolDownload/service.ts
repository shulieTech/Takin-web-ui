import { httpGet } from 'src/utils/request';

const ToolDownloadService = {
  /**
   * @name 工具下载
   */
  async toolDownload(data = {}) {
    const url = '/api/tool/list';
    return httpGet(url, data);
  }
};

export default ToolDownloadService;
