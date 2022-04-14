export type GraphFilterConf = {
  title: string;
  types: string[];
  excludeTypes?: never;
} | {
  title: string;
  types?: never;
  excludeTypes: string[];
};

export const GRAPH_FILTER: Record<number, GraphFilterConf> = {
  1: {
    title: 'DB',
    types: ['DB']
  },
  2: {
    title: 'MQ',
    types: ['MQ']
  },
  3: {
    title: 'Cache',
    types: ['CACHE']
  },
  4: {
    title: '其他',
    // types: ['OSS', 'SEARCH', 'OTHER'],
    excludeTypes: ['VIRTUAL', 'APP', 'OUTER', 'UNKNOWN', 'GATEWAY', 'DB', 'MQ', 'CACHE'],
  }
};

export const checkFilterType = (type: string, conf: GraphFilterConf): boolean => {
  return (conf.types && conf.types?.includes(type)) || (conf.excludeTypes && !conf.excludeTypes?.includes(type));
};

export const FLOW_TYPE_ENUM = {
  BLEND: '混合流量',
  PRESSURE_MEASUREMENT: '压测流量',
  BUSINESS: '业务流量',
};

/**
 * 不走安全中心网关的接口列表
 */
export const EXCLUDED_SECURITY_APIS = [
  '/sys/front/config/get',
  '/verification/code',
  '/login',
  '/logout',
  '/tenant',
  '/tenant/env/switch',
  '/link/dictionary',
  '/menu/list',
  '/menu/button',
  '/menu/keys',
  
  // 涉及xlsx上传的接口暂时不走安全中心
  '/application/center/app/config/import',
  '/file/upload',
  '/application/middlewareJar/compare',
  '/application/middlewareJar/import',
  '/file/attachment/upload',
  
];

// 帮助文档地址
export const DOC_HELP_URL =
'https://shulietech.feishu.cn/docs/doccnlEBVRq7HF4ToSJ9jMIzLaf';
// 升级文档地址
export const DOC_UPDATE_URL =
'https://shulietech.feishu.cn/docs/doccnvTvNxzVrH29Xvm60l7kgHc#';
// 用户反馈地址
export const DOC_FEEDBACK_URL = 'https://shulietech.feishu.cn/share/base/shrcn2DDo2jITnVJyDLHJ4mWpJf';
