/**
 * @name 调用栈详情机器性能列表单位
 */
export enum MachinePerformanceColumns {
    类型 = 'type',
    Before进 = 'beforeIn',
    Before出 = 'beforeAfter',
    After进 = 'afterIn',
    After出 = 'afterOut',
    Exception进 = 'exceptionIn' ,
    Exception出 = 'exceptionOut' 
}

/**
 * @name 调用栈详情机器性能列表单位
 */
export enum MachinePerformanceUnit {
    CPU利用率 = '%',
    CPU负载 = '',
    内存利用率 = '%',
    堆内存总和 = 'MB',
    IO = '%',
    YoungGC次数	= '次',
    YoungGC耗时	= 'ms',
    OldGC次数= '次',
    OldGC耗时= 'ms'
  }