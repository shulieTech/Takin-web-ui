export enum SceneBean {
  误报类型 = 'patrolSceneName',
  具体描述 = 'patrolBoardId',
}

export enum NodeType {
  一一 = 'valueType1Level1',
  一二 = 'valueType1Level2',
  二一 = 'valueType2Level1',
  二二 = 'valueType2Level2',
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