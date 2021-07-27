/**
 * @name
 * @author MingShined
 */
import G6, { Graph } from '@antv/g6';
import { GraphOptions } from '@antv/g6/lib/types';
import { Empty } from 'antd';
import React, { Fragment, useContext, useEffect } from 'react';
import G6Graph from 'src/components/g6-graph';
import { getEdgeType, getLabelMaxLength } from 'src/components/g6-graph/utils';
import { BusinessActivityDetailsContext } from '../modals/ServiceLinkModal';
import MissionManageService from '../service';
import { NodeType } from '../enum';
import iconfontNode from 'src/components/g6-graph/iconfontNode';

iconfontNode();

interface Props {
  id?: string;
}
const GraphNode: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const handleGraphClick = () => {
    setState({ nodeVisible: false });
  };
  const handleHoverNode = (ev, graph: Graph, active: boolean) => {
    const nodeItem = ev.item;
    const edges = nodeItem.getEdges();
    graph.setItemState(nodeItem, 'hover', active);
    edges.forEach(edge => graph.setItemState(edge, 'hover', active));
  };
  const handleHoverEdge = (ev, graph: Graph, active: boolean) => {
    const edgeItem = ev.item;
    graph.setItemState(edgeItem, 'hover', active);
  };
  return (
    <G6Graph
      id="g6_graph"
      // data={{ nodes: [], edges: [] }}
      emptyNode={EmptyNode}
      data={{
        nodes: state.details && state.details.topology.nodes || [],
        edges: state.details && state.details.topology.edges || []
      }}
      handleNodeMouseenter={(ev, graph) => handleHoverNode(ev, graph, true)}
      handleNodeMouseleave={(ev, graph) => handleHoverNode(ev, graph, false)}
      handleEdgeMouseenter={(ev, graph) => handleHoverEdge(ev, graph, true)}
      handleEdgeMouseleave={(ev, graph) => handleHoverEdge(ev, graph, false)}
      onReady={(graph, node) => {
        setState({ graph, node });
      }}
      handleNodeClick={async (ev, graph) => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach(cn => {
          graph.setItemState(cn, 'click', false);
        });
        const nodeItem = ev.item; // 获取被点击的节点元素对象
        graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true

        if (!ev.item._cfg.model.root) {
          const {
            data: { data, success }
          } = await MissionManageService.nodeGet({
            chainId: props.id,
            activityId: state.details.activityId,
            techNodeId: ev.item._cfg.model.id
          });
          if (success) {
            setState({
              providerService: data.nodeList
            });
          }
          setState({
            nodeInfo: ev.item._cfg.model,
            nodeVisible: true,
          });
        }
      }}
      handleGraphClick={handleGraphClick}
      options={options}
      transformNodes={transformNodes}
      transformEdges={transformEdges}
    />
  );
};
export default GraphNode;

const getNodeIconConf = nodeType => {
  // iconfont 内容需转成\u格式
  // https://antv-g6.gitee.io/zh/docs/manual/advanced/iconfont
  return {
    [NodeType.应用]: {
      text: '\ue61b',
      fill: '#11BBD5'
    },
    [NodeType.外部应用]: {
      text: '\ue615',
      fill: '#11BBD5'
    },
    [NodeType.数据库]: {
      text: '\ue616',
      fill: '#596170'
    },
    [NodeType.文件]: {
      text: '\ue61a',
      fill: '#6158CC'
    },
    [NodeType.未知应用]: {
      text: '\ue619',
      fill: '#C14F48'
    },
    [NodeType.消息队列]: {
      text: '\ue61c',
      fill: '#428ADE'
    },
    [NodeType.缓存]: {
      text: '\ue61e',
      fill: '#FEAE1B'
    },
    [NodeType.入口]: {
      text: '\ue61d',
      fill: '#1FD296'
    }
  }[nodeType];
};

export const transformNodes = (item: any) => {
  const _nodeTypeConf = getNodeIconConf(item.nodeType);
  return {
    ...item,
    type: 'iconfont',
    size: 64,
    labelCfg: {
      style: {
        fontSize: 15,
        fill: '#434343',
        fontWeight: 600
      }
    },
    style: {
      cursor: 'pointer',
      stroke: '#E8E8E8',
      strokeWidth: 1,
      radius: 4,
      fill: _nodeTypeConf.fill
    },
    text: _nodeTypeConf.text, // iconfont 文本
    label: item.label,
    _label: item.label,
    anchorPoints: [
      [0, 0.5], // 左侧中间
      [1, 0.5], // 右侧中间
    ],
  };
};

const endArrow = {
  size: 5,
  path: G6.Arrow.triangle(5, 5, 5),
  d: 5,
  fill: '#536075',
  stroke: '#536075'
};

export const transformEdges = item => ({
  ...item,
  type: getEdgeType(item),
  // edgeOffset: getOffset({ ...item, edges: _edges }),
  style: {
    endArrow,
    stroke: '#536075',
  },
  labelCfg: {
    style: {
      fill: '#5A626F',
      fontWeight: 'bold',
      fontSize: 13,
      fontStyle: 'italic',
      background: {
        fill: '#fff',
        padding: [2, 4, 4, 4],
        radius: 4,
        strokeWidth: 1,
        stroke: '#E1E7EF'
      }
    }
  },
  size: 1
});

export const options: Partial<GraphOptions> = {
  edgeStateStyles: {
    active: {
      // lineWidth: 2,
      stroke: '#11BBD5',
      endArrow: {
        ...endArrow,
        stroke: '#11BBD5',
        fill: '#11BBD5'
      }
    },
    hover: {
      // lineWidth: 2,
      stroke: '#11BBD5',
      endArrow: {
        ...endArrow,
        stroke: '#11BBD5',
        fill: '#11BBD5'
      }
    }
  },
  nodeStateStyles: {},
  minZoom: 0.4,
  maxZoom: 2,
  modes: {
    default: [
      {
        type: 'tooltip',
        formatText: (model: any) => {
          return `<div style="padding: 8px 16px;border: 1px solid rgba(255, 255, 255, 0.2);background:
        #161E35;border-radius: 4px;font-size: 14px;color: #fff;max-width:300px;word-break:break-all;">
             ${model.label}
          </div>`;
        }
      },
      {
        type: 'edge-tooltip',
        shouldBegin: (evt: any) => {
          const { infos } = evt.item._cfg.model;
          if (infos || !infos.length) {
            return true;
          }
          return false;
        },
        formatText: (model: any) => {
          const text: string = model.infos
            .map(item => `<div>${item}</div>`)
            .join(` `);
          // tslint:disable-next-line: max-line-length
          return `<div style="padding: 8px 16px;box-shadow: 0px 0px 12px 0px rgba(177, 192, 192, 0.45);background: #2E333B;max-width: 300px;border-radius: 4px;font-size: 12px;max-height: 300px;word-break:break-all;color:#fff;font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;">
             ${text}
          </div>`;
        }
      },
      {
        type: 'activate-relations',
        trigger: 'click'
      }
    ]
  },
  layout: {
    type: 'dagre',
    rankdir: 'LR',
    // align: 'UR',
    nodesepFunc: d => {
      return 20;
    },
    controlPoints: true,
    ranksep: 30
    // controlPoints: true,
  }
};

export const EmptyNode: React.ReactNode = (
  <Empty
    description={
      <Fragment>
        <h1 style={{ fontSize: 18, color: '#454545' }}>链路暂无节点</h1>
        <p
          style={{
            fontSize: 14,
            color: '#8C8C8C'
          }}
        >
          链路暂无节点，请检查链路相关节点是否接入探针
        </p>
      </Fragment>
    }
  />
);
