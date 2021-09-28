/**
 * @name 压力模式
 */
export enum TestMode {
  并发模式,
  TPS模式,
  自定义模式
}

export enum PressureTestSceneEnum {
  标签 = 'tag',
  是否定时 = 'isScheduler',
  定时时间 = 'executeTime'
}

/**
 * @name 发压来源
 */
export enum PressureSource {
  本地发压,
  云端发压
}

/**
 * @name 施压模式
 */
export enum PressureMode {
  固定压力值 = 1,
  线性递增,
  阶梯递增
}

export enum PressureStyle {
  继续压测 = '1',
  从头开始压测 = '0'
}
