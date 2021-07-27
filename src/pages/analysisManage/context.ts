import { useCreateContext } from 'racc';

export const initState =  {
  appName: undefined,
  processName: undefined,
  agentId: undefined
};

export type AnalysisState = typeof initState;

export const ThreadContext = useCreateContext<AnalysisState>();
