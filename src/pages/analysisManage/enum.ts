export enum AnalysisType {
  分析实况 = 'actually',
  分析报告 = 'report'
}

export enum AnalysisEnum {
  进程名称 = 'processName',
  PID = 'processId',
  机器IP = 'appIp',
  AgentId = 'agentId',
  线程名称 = 'threadName',
  cpu利用率 = 'threadCpuUseRate',
  方法栈 = 'threadStack',
  方法名 = 'traceDeployObject',
  行号 = 'lineNum',
  平均耗时 = 'avgCost',
  中位数 = 'p50',
  P90 = 'p90',
  P95 = 'p95',
  P99 = 'p99',
  最小值 = 'min',
  最大值 = 'max',
  a = 'a',
  b = 'b'
}

export enum AnalysisTab {
  线程分析 = 'thread',
  内存分析 = 'memery',
  方法追踪 = 'method'
}

export const intervalTime = 5000;
export const tipColor = '#aaa';