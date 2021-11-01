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
