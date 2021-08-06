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

export enum PressureSource {
  本地发压,
  云端发压,
}
