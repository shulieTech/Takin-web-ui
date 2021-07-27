/**
 * @name
 * @author MingShined
 */
import { Graph } from '@antv/g6';
import { Spin } from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import G6Graph from 'src/components/g6-graph';
import { getEntranceInfo } from '../addEditPage';
import {
  EmptyNode,
  options,
  transformEdges,
  transformNodes
} from '../chain/GraphNode';
import { AddEditActivityModalState } from '../modals/AddEditActivityModal';
import BusinessActivityService from '../service';
import iconfontNode from 'src/components/g6-graph/iconfontNode';

iconfontNode();

interface Props extends AddEditActivityModalState {}
const AddEditGraph: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    graph: null as Graph,
    nodes: [],
    edges: [],
    loading: false
  });

  useEffect(() => {
    if (props.service && state.graph) {
      queryChartInfo();
    }
  }, [props.service, props.serviceList, state.graph]);

  const queryChartInfo = async () => {
    setState({ loading: true });
    const {
      data: { data, success }
    } = await BusinessActivityService.queryChartInfo({
      ...getEntranceInfo(props.serviceList, props.service),
      applicationName: props.app,
      linkId: props.service,
      type: props.serviceType
    });
    if (success && data.nodes) {
      setState({ nodes: data.nodes, edges: data.edges, loading: false });
    }
  };

  const height = document.body.offsetHeight - 220;

  return (
    <div style={{ background: '#F8F9FA' }}>
      <G6Graph
        id="activity_addEdit_graph"
        options={{ ...options, height: height < 500 ? 500 : height }}
        onReady={graph => {
          setState({ graph });
        }}
        showMiniMap={false}
        showToolBar={false}
        data={{
          nodes: state.nodes,
          edges: state.edges
        }}
        transformNodes={transformNodes}
        transformEdges={transformEdges}
        emptyNode={state.loading ? <Spin spinning={true} /> : EmptyNode}
        handleNodeClick={(ev, graph) => {
          // 先将所有当前是 click 状态的节点置为非 click 状态
          const clickNodes = graph.findAllByState('node', 'click');
          clickNodes.forEach(cn => {
            graph.setItemState(cn, 'click', false);
          });
          const nodeItem = ev.item; // 获取被点击的节点元素对象
          graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
        }}
      />
    </div>
  );
};
export default AddEditGraph;
