export enum MiddlewareBean {
    'Artifact ID' = 'artifactId',
    'Group ID' = 'groupId',
    类型 = 'type',
    备注 = 'commit',
    版本号 = 'version',
    状态 = 'status'
  }

/**
 * @name 中间件状态颜色
 */
export const middlewareStatusColorMap = {
  1: '#11D0C5',
  2: '#FFA800',
  3: '#C9C9C9',
  4: '#ED6047'
};

/**
 * @name 中间件状态名
 */
export const middlewareStatusMap = {
  1: '已支持',
  2: '未支持',
  3: '无需支持',
  4: '未知',
};