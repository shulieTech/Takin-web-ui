export enum PressMachineManageEnum {
  机器名称 = 'name',
  IP地址 = 'ip',
  标签 = 'flag',
  状态 = 'status',
  机器水位 = 'machineUsage',
  CPU = 'cpu',
  内存 = 'memory',
  磁盘 = 'disk',
  网络带宽 = 'transmittedTotal',
  使用场景 = 'sceneNames',
  CPU利用率 = 'cpuUsageList',
  'CPU load' = 'cpuLoadList',
  内存利用率 = 'memoryUsageList',
  '磁盘I/O等待率' = 'ioWaitPerList',
  网络带宽使用率 = 'transmittedUsageList',
  压力机总数 = 'machineTotal'
}

export enum DayMap {
  周日,
  周一,
  周二,
  周三,
  周四,
  周五,
  周六
}

export const StatisticMap = {
  machineOffline: {
    label: '离线',
    color: 'rgb(202, 202, 202)',
    percent: 'offlinePercent'
  },
  machinePressured: {
    label: '压测中',
    color: 'rgb(62, 141, 255)',
    percent: 'pressuredPercent'
  },
  machineFree: {
    label: '空闲',
    color: 'rgb(63, 196, 99)',
    percent: 'freePercent'
  }
};

export enum StatusMap {
  离线 = -1,
  空闲,
  压测中
}

export enum StatusColorMap {
  'rgb(202, 202, 202)' = -1,
  'rgb(63, 196, 99)',
  'rgb(62, 141, 255)'
}
