export enum BusinessFlowBean {
  业务活动名称 = 'artifactId',
  ID = 'groupId',
  状态 = 'type',
  来源 = 'commit',
  节点 = 'version',
  业务活动 = 'status',
  匹配进度 = '1',
  负责人 = '2',
  最后更新时间 = '3'
}

/**
 * @name 业务活动状态颜色
 */
export const businessActivityStatusColorMap = {
  1: '#11D0C5',
  2: '#FFA800',
  3: '#C9C9C9',
  4: '#ED6047'
};

/**
 * @name 业务活动状态名
 */
export const businessActivityStatusMap = {
  1: '已支持',
  2: '未支持',
  3: '无需支持',
  4: '未知'
};
