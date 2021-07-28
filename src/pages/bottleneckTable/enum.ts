export enum SceneBean {
  误报类型 = 'category',
  具体描述 = 'detail',
}

export enum NodeType {
  应用 = 'APP',
  缓存 = 'CACHE',
  数据库 = 'DB',
  消息队列 = 'MQ',
  文件 = 'OSS',
  外部应用 = 'OUTER',
  未知应用 = 'UNKNOWN',
  入口 = 'VIRTUAL'
}
export interface NodeBean {
  id: string;
  label: string;
  _label: string;
  nodeType: NodeType;
  manager: string;
  providerService: {
    label: string;
    dataSource: any[];
  }[];
  callService: {
    label: string;
    nodeType: NodeType;
    dataSource: any[];
  }[];
  nodes: any[];
  db: any[];
  mq: any[];
  oss: any[];
}