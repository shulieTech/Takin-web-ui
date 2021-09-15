export enum AgentManageBean {
  'Artifact ID' = 'artifactId',
  'Group ID' = 'groupId',
  类型 = 'type',
  备注 = 'commit',
  版本号 = 'version',
  状态 = 'status'
}

/**
 * @name agent状态颜色
 */
export const agentStatusColorMap = {
  0: 'var(--BrandPrimary-500)',
  4: 'var(--FunctionalError-500)'
};

/**
 * @name agent状态名
 */
export const agentStatusMap = {
  0: '安装成功',
  4: '安装失败'
};

/**
 * @name 探针状态名
 */
export const probeStatusMap = {
  0: '安装成功',
  1: '未安装',
  2: '安装中',
  3: '卸载中',
  4: '安装失败',
  5: '卸载失败'
};

/**
 * @name 探针状态颜色
 */
export const probeStatusColorMap = {
  0: 'var(--BrandPrimary-500)',
  1: 'var(--FunctionalError-500)',
  2: 'var(--FunctionalAlert-500)',
  3: 'var(--FunctionalAlert-500)',
  4: 'var(--FunctionalError-500)',
  5: 'var(--FunctionalError-500)'
};

/**
 * @name agent插件状态名
 */
export const agentPluginStatusMap = {
  LOAD_SUCCESS: '加载成功',
  LOAD_FAILED: '加载失败',
  LOAD_DISABLE: '禁用',
  UNLOAD: '未加载'
};

/**
 * @name agent插件状态颜色
 */
export const agentPluginStatusColorMap = {
  LOAD_SUCCESS: '#26cdc3',
  LOAD_FAILED: '#ED6047',
  LOAD_DISABLE: '#FFA800',
  UNLOAD: '#3D485A'
};
