/**
 * @name 应用配置状态颜色
 */
export const appConfigStatusColorMap = {
  0: 'var(--BrandPrimary-500)',
  1: 'var(--FunctionalAlert-500)',
  2: 'var(--Netural-06)',
  3: 'var(--FunctionalError-500)'
};

/**
 * @name 应用配置状态
 */
export const appConfigStatusMap = {
  0: '正常',
  1: '待配置',
  2: '待检测',
  3: '异常'
};

export enum ShadowConsumerBean {
  MQ类型 = 'type',
  状态 = 'enabled',
  groupId = 'topicGroup',
  最后修改时间 = 'gmtUpdate'
}

/** @name 接口类型 */
export enum InterfaceType {
  HTTP = 1,
  DUBBO,
  RABBITMQ
}

export enum DbBean {
  应用 = 'applicationName',
  类型 = 'dbType',
  业务数据源地址 = 'url',
  用户名 = 'userName',
  方案类型 = 'dsType',
  配置代码 = 'config',
  数据源地址 = 'shadowDbUrl',
  数据源用户名 = 'shadowDbUserName',
  密码 = 'shadowDbPassword',
  minldle = 'shadowDbMinIdle',
  maxActive = 'shadowDbMaxActive'
}
