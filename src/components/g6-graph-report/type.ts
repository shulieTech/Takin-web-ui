import { Graph } from '@antv/g6';
import {
  EdgeConfig,
  GraphData,
  GraphOptions,
  NodeConfig
} from '@antv/g6/lib/types';

export interface G6GraphProps {
  onReady?: (graph: Graph, node?: HTMLElement) => void;
  options?: Partial<GraphOptions>;
  showToolBar?: boolean;
  showMiniMap?: boolean;
  data: GraphData;
  transformNodes?: (node: NodeConfig) => Partial<NodeConfig>;
  transformEdges?: (edge: EdgeConfig) => Partial<EdgeConfig>;
  handleNodeClick?: (ev: any, graph?: Graph) => void;
  handleNodeMouseenter?: (ev: any, graph?: Graph) => void;
  handleNodeMouseleave?: (ev: any, graph?: Graph) => void;
  handleEdgeMouseenter?: (ev: any, graph?: Graph) => void;
  handleEdgeMouseleave?: (ev: any, graph?: Graph) => void;
  handleEdgeClick?: (ev: any, graph?: Graph) => void;
  handleGraphClick?: (ev: any, graph?: Graph) => void;
  id: string;
  emptyNode?: React.ReactNode;
}
