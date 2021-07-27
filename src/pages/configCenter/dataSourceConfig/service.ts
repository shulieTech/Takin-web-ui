import { httpGet, httpPost, httpDelete, httpPut } from 'src/utils/request';

const DataSourceConfigService = {
  /**
   * @name 删除数据源配置
   */
  async deleteDataSourceConfig(data = {}) {
    const url = '/datasource/delete';
    return httpDelete(url, data);
  },
  /**
   * @name 新增数据源配置
   */
  async addDataSourceConfig(data = {}) {
    const url = '/datasource/create';
    return httpPost(url, data);
  },
  /**
   * @name 编辑数据源配置
   */
  async editDataSourceConfig(data = {}) {
    const url = '/datasource/update';
    return httpPut(url, data);
  },
  /**
   * @name 获取数据源配置详情
   */
  async queryDataSourceConfigDetail(data = {}) {
    const url = '/datasource/detail';
    return httpGet(url, data);
  },
  /**
   * @name 调试数据源
   */
  async debugDataSource(data = {}) {
    const url = '/datasource/test';
    return httpPost(url, data);
  },
  /**
   * @name 获取所有标签列表
   */
  async queryTagList(data = {}) {
    const url = '/datasource/tags';
    return httpGet(url, data);
  },
  /**
   * @name 新增数据源管理标签
   */
  async addDataSourceConfigTags(data = {}) {
    const url = '/datasource/tags';
    return httpPost(url, data);
  },
  /**
   * @name 获取数据源绑定的业务活动
   */
  async queryDataSourceActivityList(data = {}) {
    const url = '/datasource/refs';
    return httpGet(url, data);
  },
};

export default DataSourceConfigService;
