/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, ReactNode } from 'react';
import G6GraphV2, {
  RestGraphOption,
  defaultEdgeLabelCfg,
} from 'src/components/g6-graph/V2';
import { Dropdown, Divider, Icon } from 'antd';
import styles from './index.less';
import { GraphData, IG6GraphEvent } from '@antv/g6/lib/types';
import { Graph } from '@antv/g6';
import { GRAPH_FILTER, GraphFilterConf, checkFilterType } from 'src/constants';

export const getDefaultNodeIconConf = (nodeType: string) => {
  // iconfont 内容需转成\u格式
  // https://antv-g6.gitee.io/zh/docs/manual/advanced/iconfont
  return (
    {
      APP: {
        text: '\ue61b',
        fill: '#00D77D ',
        title: '应用',
      },
      OUTER: {
        text: '\ue615',
        fill: '#646E81',
        title: '外部应用',
      },
      DB: {
        text: '\ue616',
        fill: '#FF9141',
        title: '数据库',
      },
      OSS: {
        text: '\ue61a',
        fill: '#646E81',
        title: '文件',
      },
      UNKNOWN: {
        text: '\ue619',
        fill: '#ED6047',
        title: '未知应用',
      },
      MQ: {
        text: '\ue61c',
        fill: '#646E81',
        title: 'MQ',
      },
      CACHE: {
        text: '\ue61e',
        fill: '#646E81',
        title: '缓存',
      },
      VIRTUAL: {
        text: '\ue61d',
        fill: '#2E333B',
        title: '入口',
      },
      SEARCH: {
        text: '\ue629',
        fill: '#646E81',
        title: 'ES',
      },
    }[nodeType] || {
      text: '\ue619',
      fill: '#ED6047',
      title: nodeType,
    }
  );
};

export const getG6OptionByType = (
  type: number = 1
): Partial<RestGraphOption> => {
  return (
    {
      1: {
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
        },
      },
      2: {
        layout: {
          type: 'force',
          nodeSize: 80,
          preventOverlap: true,
          linkDistance: 400,
          // workerEnabled: true,
          // gpuEnabled: true,
        },
      },
    }[type] || {}
  );
};

const fixNum = (num: number, len = 2) => (num ? num.toFixed(len) : 0);

export const transformNodes = ({
  nodes,
  labelSetting,
  includedTypes = ['APP', 'VIRTUAL', 'OUTER', 'UNKNOWN', 'GATEWAY'], // 第一层展示的节点
  edges = [],
  showBottleneckBtn = false,
  graph,
}) => {
  const newNodes =
    includedTypes?.length > 0
      ? nodes.filter((x: any) => {
        return (
          includedTypes.includes(x.nodeType as string) ||
          graph?.findById(x.id)
        );
      })
      : nodes;
  return newNodes.map((x) => {
    const hasOppositeLine = edges.some((y) => {
      return (
        (y.target === x.id &&
          edges.some((z) => z.source === x.id && z.target === y.source)) ||
        (y.source === x.id &&
          edges.some((z) => z.target === x.id && z.source === y.source))
      );
    }); // 双向线段

    const hasServiceOpened = x?.providerService?.some((y) =>
      y?.dataSource?.some((z) => !!z.switchState)
    );

    let nodeBottleType = 1;
    let nodeBottleCount = 0;

    switch (true) {
      case x.hasL2Bottleneck && x.l2bottleneckNum > 0:
        nodeBottleType = 2;
        nodeBottleCount = x.l2bottleneckNum;
        break;
      case x.hasL1Bottleneck && x.l1bottleneckNum > 0:
        nodeBottleType = 1;
        nodeBottleCount = x.l1bottleneckNum;
        break;
      default:
        nodeBottleType = 1;
        nodeBottleCount = 0;
    }

    return {
      hasOppositeLine,
      ...x,
      // TPS/RT值
      subLabel: hasServiceOpened //
        ? `${x.serviceAllTotalCount || 0}/${x.serviceAllTotalTps || 0}/${
            x.serviceRt || 0
          }/${fixNum(x.serviceAllSuccessRate * 100)}%`
        : undefined,
      // 瓶颈数据
      bottleneckMap: {
        showBottleneckBtn,
        type: nodeBottleType,
        count: nodeBottleCount,
      },
    };
  });
};

export const transformEdges = (edges, labelSetting, originEdges = edges) => {
  return edges.map((x) => {
    const arr = [];
    if (labelSetting.includes('1') || labelSetting.includes('2')) {
      arr.push(
        `${labelSetting.includes('1') ? x.label : ''}${
          labelSetting.includes('1') && labelSetting.includes('2') ? ' ' : ''
        }${labelSetting.includes('2') ? x.allTotalCount || 0 : ''}`
      );
    }
    // if (labelSetting.includes('4')) {
    //   arr.push(`${fixNum(x.serviceAllTotalTps)}/${fixNum(x.serviceRt)}`);
    // }
    // if (labelSetting.includes('3')) {
    //   arr.push(`${fixNum(x.serviceAllSuccessRate * 100)}%`);
    // }

    const hasOppositeLine = originEdges.some(
      (y) => y.target === x.source && y.source === x.target
    ); // 双向线段

    const edgeLabel = arr.length > 0 ? arr.join('\n') : ''; // g6这有个bug，只能使用''并在后面重置样式, 使用undefied或者null，无法被更新
    const labelStyle = {
      ...defaultEdgeLabelCfg.style,
      background: !!edgeLabel
        ? defaultEdgeLabelCfg.style.background
        : undefined,
    };
    return {
      ...x,
      ...(hasOppositeLine
        ? 
      {
        labelCfg: {
          ...defaultEdgeLabelCfg,
          style: {
            ...labelStyle,
            textAlign: 'center',
          },
          position: 'start',
          refX: 70,
        },
      }
      : 
      {
        labelCfg: {
          ...defaultEdgeLabelCfg,
          style: labelStyle,
        },
      }),
      label: edgeLabel,
      style: {
        ...(x.style || {}),
        lineWidth: x.main ? 8 : 2, // 主干加粗
        endArrow: {
          path: x.main ? 'M 2,0 L 10,4 L 10,-4 Z' : 'M 0,0 L 8,4 L 8,-4 Z',
          fill: '#98A1B3',
        },
      },
      type: x.source === x.target ? 'loop' : 'cubic-horizontal',
    };
  });
};

let isAnimating = false;

export interface GraphComponentProps {
  graphData: GraphData;
  getNodeIconConf?: () => any;
  onGraphReady?: (graph: Graph) => void;
  onGraphClick?: (ev: IG6GraphEvent, originModel: any) => void;
  onNodeClick?: (ev: IG6GraphEvent, originModel: any) => void;
  onLabelSettingChange?: (labelSetting: string[]) => void;
  defaultLabelSetting?: string[];
  freezedDrag?: boolean;
  freezeExpand?: boolean;
  freezeLabelSetting?: boolean;
  tooltip?: string | ReactNode;
  graphKey?: string | number;
  showBottleneckBtn?: boolean;

  onNodeBottleneckBtnClick?: (ev: IG6GraphEvent, originModel: any) => void;
  beforeHeaderNode?: React.ReactNode;
}
const GraphNode: React.FC<GraphComponentProps> = (props) => {
  const {
    graphData,
    // defaultLabelSetting = ['1', '2', '3', '4'],
    defaultLabelSetting = ['2', '3', '4'],
    getNodeIconConf = getDefaultNodeIconConf,
    tooltip,
    showBottleneckBtn = false,
  } = props;
  const initalLabelSetting = props?.freezeExpand
    ? // ? ['1', '2', '3', '4']
      ['2', '3', '4']
    : defaultLabelSetting;
  const [graphInstance, setGraphInstance] = useState<Graph>();
  const isExpandedOninit =
    graphData?.nodes?.length > 0 && graphData?.nodes?.length < 10; // 初始化是否全部展开
  const initalNodeFilter = {
    1: isExpandedOninit,
    2: isExpandedOninit,
    3: isExpandedOninit,
    4: isExpandedOninit,
  };
  const [nodeFilter, setNodeFilter] = useState(initalNodeFilter);
  const [labelSetting, setLabelSetting] = useState(initalLabelSetting);
  const nodeStatics: Record<string, number> = {}; // 统计数

  /**
   * 获取节点的直接上下游节点
   * @param node
   * @param param1 原始数据
   * @param typeConf 筛选特定类型，不传为所有类型
   * @returns
   */
  const getSiblings = (
    node,
    { edges = [], nodes = [] },
    typeConf?: GraphFilterConf
  ) => {
    return nodes.filter((x) => {
      const isDiffrentNode = x.id !== node.id;
      const { types, excludeTypes } = typeConf || {};
      const isTypeOk =
        types?.length > 0 || excludeTypes?.length > 0
          ? checkFilterType(x.nodeType, typeConf)
          : true;
      return (
        isDiffrentNode &&
        isTypeOk &&
        edges.some((y) => {
          return (
            (y.source === node.id && y.target === x.id) ||
            (y.target === node.id && y.source === x.id)
          );
        })
      );
    });
  };

  const getOriginData = () => {
    const _data = graphData;
    if (!(graphData?.nodes?.length > 0)) {
      return {
        nodes: [],
        edges: [],
      };
    }
    return {
      nodes: _data.nodes.map((item: any) => {
        const nodeTypeConf = getNodeIconConf(item.nodeType);
        nodeStatics[item.nodeType] = nodeStatics[item.nodeType] || 0;
        nodeStatics[item.nodeType] += 1;
        const subNodesCountMap = {};
        const expanderTypeState = {};

        const checkBottleneckType = (nodeModel, bottleneckType) => {
          return nodeModel[{
            1: 'hasL1Bottleneck',
            2: 'hasL2Bottleneck',
          }[bottleneckType]
];
          // return nodeModel?.providerService?.some((y) => {
          //   return y?.dataSource?.some((z) => {
          //     return (
          //       z?.allSuccessRateBottleneckType === bottleneckType ||
          //       z?.allTotalRtBottleneckType === bottleneckType ||
          //       z?.allSqlTotalRtBottleneckType === bottleneckType
          //     );
          //   });
          // });
        };

        // 获取应用的折叠数
        if (
          ['APP', 'OUTER', 'UNKNOWN', 'GATEWAY'].includes(
            item.nodeType as string
          )
        ) {
          const neighbors = getSiblings(item, _data);
          neighbors.forEach((neighborModel) => {
            Object.entries(GRAPH_FILTER).forEach(([key, cfg]) => {
              if (checkFilterType(neighborModel.nodeType as string, cfg)) {
                subNodesCountMap[key] = subNodesCountMap[key] || { count: 0 };
                subNodesCountMap[key].count += 1;

                // 瓶颈类型
                if (checkBottleneckType(neighborModel, 2)) {
                  subNodesCountMap[key].bottleneckType = 2;
                } else if (
                  checkBottleneckType(neighborModel, 1) &&
                  !subNodesCountMap[key].bottleneckType
                ) {
                  subNodesCountMap[key].bottleneckType = 1;
                }
                expanderTypeState[key] = isExpandedOninit;
              }
            });
          });
        }

        return {
          ...item,
          subNodesCountMap,
          expanderTypeState,
          type: 'iconfont',
          size: 64,
          labelCfg: {
            style: {
              fontSize: 13,
              fill: '#505C70',
            },
          },
          style: {
            cursor: 'pointer',
            stroke: '#E8E8E8',
            strokeWidth: 1,
            radius: 4,
            fill: nodeTypeConf?.fill,
          },
          text: nodeTypeConf?.text, // iconfont 文本
          label: item.label,
        };
      }),
      edges: _data.edges.map((x) => {
        return {
          ...x,
          type: 'cubic-horizontal',
        };
      }),
    };
  };

  // 原始数据
  const originData = getOriginData();

  // 根据折叠状态处理后的数据
  const transformData = ({ nodes = [], edges: newEdges = [] }) => {
    return {
      nodes: transformNodes({
        nodes,
        labelSetting,
        showBottleneckBtn,
        includedTypes: nodes.length < 10 || props.freezeExpand ? [] : undefined,
        edges: newEdges,
        graph: graphInstance,
      }),
      edges: transformEdges(newEdges, labelSetting),
    };
  };

  const data = transformData(originData);

  const dataStaticsDropdownContent = (
    <div
      className={styles.dropdownContent}
      style={{
        width: 160,
      }}
    >
      {Object.entries(nodeStatics)
        .filter(([nodeType, num]) => !['VIRTUAL'].includes(nodeType))
        .sort((x, y) => {
          const typeOrder = [
            'APP',
            'DB',
            'MQ',
            'CACHE',
            'OSS',
            'OUTER',
            'UNKNOWN',
          ];
          return (
            typeOrder.findIndex((t) => t === x[0]) -
            typeOrder.findIndex((t) => t === y[0])
          );
        })
        .map(([nodeType, num], i, arr) => {
          const nodeTypeConf = getNodeIconConf(nodeType);
          return (
            <div key={nodeType}>
              {nodeTypeConf?.title}
              <span
                style={{
                  float: 'right',
                  fontWeight: 'bold',
                  color: 'var(--Netural-14, #424242)',
                }}
              >
                {num}
              </span>
              {i < arr.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
          );
        })}
    </div>
  );

  // 显示设置
  // const labelSettingEnum = [
  //   { value: '2', label: '线：调用量' },
  //   { value: '1', label: '线：调用类型' },
  //   { value: '3', label: '线：成功率' },
  //   { value: '4', label: '节点/线：TPS/RT' },
  // ];
  // const labelSettingDropdownContent = (
  //   <div className={styles.dropdownContent}>
  //     <Checkbox.Group
  //       style={{ width: '100%' }}
  //       value={labelSetting}
  //       onChange={(val: string[]) => {
  //         setLabelSetting(val);
  //         if (props?.onLabelSettingChange) {
  //           props?.onLabelSettingChange(val);
  //         }
  //       }}
  //       disabled={props.freezeLabelSetting}
  //     >
  //       <div onClick={(e) => e.stopPropagation()}>
  //         <div>
  //           {labelSettingEnum.map((x, i, arr) => (
  //             <div key={x.value}>
  //               <Checkbox value={x.value} style={{ lineHeight: '48px' }}>
  //                 {x.label}
  //               </Checkbox>
  //               {i !== arr.length - 1 && <Divider style={{ margin: 0 }} />}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </Checkbox.Group>
  //     {props?.onTrafficTypeChange && (
  //       <>
  //         <Divider style={{ marginBottom: 10, marginTop: 0 }} />
  //         <div
  //           onClick={(e) => e.stopPropagation()}
  //           style={{ display: 'flex', marginBottom: 12, alignItems: 'center' }}
  //         >
  //           <span style={{ color: '--var(Netural-05, #DADADA)' }}>流量类型：</span>
  //           <Select
  //             style={{ flex: 1 }}
  //             defaultValue={defaultTrafficType}
  //             onChange={props?.onTrafficTypeChange}
  //           >
  //             <Select.Option value={1}>混合流量</Select.Option>
  //             <Select.Option value={2}>压测流量</Select.Option>
  //             <Select.Option value={3}>业务流量</Select.Option>
  //           </Select>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );

  /**
   * 获取渲染结束后单个节点的折叠状态
   * @param graph
   * @param nodeModel
   */
  const checkNodeExpandState = (graph, nodeModel) => {
    const { expanderTypeState = {} } = nodeModel;
    Object.entries(GRAPH_FILTER).forEach(([key, cfg]) => {
      const trueSiblings = getSiblings(nodeModel, originData, cfg); // 实际的关联节点
      if (trueSiblings.length === 0) {
        expanderTypeState[key] = undefined;
        return;
      }
      // 渲染上的关联节点
      const paintedSiblings = getSiblings(
        nodeModel,
        {
          nodes: graph.getNodes().map((x) => x.getModel()),
          edges: originData.edges,
        },
        cfg
      );

      if (trueSiblings.length === paintedSiblings.length) {
        expanderTypeState[key] = true;
      } else {
        expanderTypeState[key] = false;
      }
    });
    return expanderTypeState;
  };

  /**
   * 展开折叠单个子节点
   * @param graph
   * @param expanderType
   * @param nodeItem  传值则只影响该节点上下游， 不传示影响所有节点，
   */
  const toggleSubNodes = (graph, expanderType, nodeItem) => {
    const model = nodeItem.getModel();
    model.expanderTypeState = model.expanderTypeState || {};
    const isExpanded = model.expanderTypeState[expanderType];

    const effectedNodes = getSiblings(
      model,
      originData,
      GRAPH_FILTER[expanderType]
    );

    //   const effectedNodes = getSiblings(model, originData).filter((x) =>
    //   GRAPH_FILTER[expanderType].types.includes(x.nodeType)
    // );

    effectedNodes.forEach((neighborModel) => {
      const neighborNode = graph.findById(neighborModel.id);
      if (isExpanded && neighborNode) {
        // 收起
        graph.removeItem(neighborNode);
      } else if (!isExpanded && !neighborNode) {
        // 展开
        graph.addItem(
          'node',
          transformNodes({
            graph,
            labelSetting,
            showBottleneckBtn,
            nodes: [neighborModel],
            includedTypes: [neighborModel.nodeType],
            edges: originData.edges,
          })[0],
          originData.edges
        );
      }
    });

    const nodeLeft = graph.getNodes();

    // 重新添加边
    originData.edges.forEach((x) => {
      const edgeAdded = graph.find('edge', (y) => {
        const { source, target } = y.getModel();
        return source === x.source && target === x.target;
      });
      if (graph.findById(x.source) && graph.findById(x.target) && !edgeAdded) {
        graph.addItem(
          'edge',
          transformEdges([x], labelSetting, originData.edges)[0]
        );
      }
      if (
        !(graph.findById(x.source) && graph.findById(x.target)) &&
        edgeAdded
      ) {
        graph.removeItem(x);
      }
    });
    graph.updateLayout({});

    const nodeOldBbox = nodeItem.getBBox();
    setTimeout(() => {
      const newNode = graph.findById(model.id);
      const nodeNewBbox = newNode.getBBox();
      const zoom = graph.getZoom();
      // 被点击的应用可能发生了较大的位移，这里聚焦到被点击的应用
      if (
        Math.abs(nodeOldBbox.x - nodeNewBbox.x) * zoom > 10 ||
        Math.abs(nodeOldBbox.y - nodeNewBbox.y) * zoom > 10
      ) {
        graph.focusItem(newNode);
        graph.setItemState(newNode, 'focus', true);
        setTimeout(() => {
          graph.setItemState(newNode, 'focus', false);
        }, 2000);
      }
    }, 500);

    // 节点的折叠状态和全部折叠的状态联动
    let isAllExpanded = true;
    nodeLeft.forEach((x) => {
      const nodeModel = x.getModel();
      // 更新单个节点的折叠状态
      if (['APP', 'OUTER', 'UNKNOWN'].includes(nodeModel.nodeType)) {
        graph.updateItem(x, {
          expanderTypeState: checkNodeExpandState(graph, nodeModel),
        });
        // 更新源数据
        if (nodeModel?.expanderTypeState?.[expanderType] === false) {
          isAllExpanded = false;
        }
      }
    });

    setNodeFilter({
      ...nodeFilter,
      [expanderType]: isAllExpanded,
    });
  };

  /**
   * 折叠所有指定类型
   * @param graph
   * @param expanderType
   */
  const toggleAllSubNodes = (graph, expanderType) => {
    isAnimating = true;
    setTimeout(() => {
      isAnimating = false;
    }, 500);
    const isExpanded = nodeFilter[expanderType];
    const effectedNodes = originData.nodes.filter((x) => {
      return checkFilterType(x.nodeType, GRAPH_FILTER[expanderType as string]);
    });

    if (isExpanded) {
      // 收起
      effectedNodes.forEach((x) => {
        const currentNode = graph.findById(x.id);
        if (currentNode) {
          currentNode.getEdges().forEach((y) => {
            graph.removeItem(y);
          });
          graph.removeItem(x.id);
        }
      });
    } else {
      // 展开所有指定类型
      effectedNodes.forEach((x) => {
        if (!graph.findById(x.id)) {
          graph.addItem(
            'node',
            transformNodes({
              graph,
              labelSetting,
              showBottleneckBtn,
              nodes: [x],
              includedTypes: [x.nodeType],
              edges: originData.edges,
            })[0]
          );
        }
        originData.edges.forEach((y) => {
          const edgeExist = graph.find('edge', (z) => {
            const model = z.getModel();
            return model.source === y.source && model.target === y.target;
          });
          if (y.source === x.id || (y.target === x.id && !edgeExist)) {
            graph.addItem(
              'edge',
              transformEdges([y], labelSetting, originData.edges)[0]
            );
          }
        });
      });
    }
    // 更新应用的折叠状态
    graph.getNodes().forEach((x) => {
      const { expanderTypeState } = x.getModel();
      graph.updateItem(x, {
        expanderTypeState: {
          ...expanderTypeState,
          [expanderType]: !isExpanded,
        },
      });
    });
    graph.updateLayout({});
    setNodeFilter({
      ...nodeFilter,
      [expanderType]: !nodeFilter[expanderType],
    });
  };

  let dataFilterTotal = 0;
  const dataFilterEl = Object.entries(GRAPH_FILTER).map(([x, y]) => {
    const isExpanded = nodeFilter[x];
    let count = 0;
    Object.entries(nodeStatics).forEach(([m, n = 0]) => {
      if (checkFilterType(m, y)) {
        count += n;
      }
    });

    dataFilterTotal += count;
    if (count <= 0) {
      return null;
    }

    return (
      <span
        key={x}
        style={{
          color: 'var(--BrandPrimary-500, #26cdc3)',
          display: 'inline-block',
          cursor: 'pointer',
          lineHeight: '33px',
          marginLeft: 20,
        }}
        onClick={() => {
          toggleAllSubNodes(graphInstance, x);
        }}
      >
        {isExpanded ? '收起' : '展开'}
        {y.title}
        <span
          className={`iconfont ${
            isExpanded ? 'icon-a-InlineDelete' : 'icon-a-InlineAdd'
          }`}
          style={{ marginLeft: 4 }}
        />
      </span>
    );
  });

  const handleGraphRef = useCallback((ref) => {
    if (ref?.graph) {
      setGraphInstance(ref.graph);
    }
  }, []);

  useEffect(() => {
    const graph = graphInstance;
    if (!graph) {
      return;
    }
    setGraphInstance(graph);
    if (props?.onGraphReady) {
      props?.onGraphReady(graph);
    }

    const nodeEnter = (ev) => {
      // 动画过程中不触发高亮逻辑
      if (isAnimating) {
        return;
      }
      const nodeItem = ev.item;
      const currentId = nodeItem._cfg.model.id;
      const isRoot = nodeItem._cfg.model.root;
      const shapeName = ev.target.get('name');
      if (shapeName.startsWith('expander-') || isRoot) {
        return;
      }
      const { edges = [] } = data;
      const allNodes = graph.getNodes();
      const allEdges = graph.getEdges();
      const linkedNodesMap = {};
      linkedNodesMap[currentId] = true;

      const findLinkedNodes = (nodeId, start = 'source') => {
        // start target查找上游 , start source查找下游
        const end = start === 'source' ? 'target' : 'source';
        edges.forEach((x, i, arr) => {
          if (x[start] === nodeId && !linkedNodesMap[x[end]]) {
            linkedNodesMap[x[end]] = true;
            if (
              edges.some((y) => {
                return y[start] === x[end] && !linkedNodesMap[y[end]];
              })
            ) {
              findLinkedNodes(x[end], start); // 递归查找
            }
          }
        });
      };
      findLinkedNodes(currentId, 'source');
      findLinkedNodes(currentId, 'target');

      // 关联高亮
      allEdges.forEach((edgeItem) => {
        graph.setItemState(edgeItem, 'fade', true);
      });
      allNodes.forEach((item: any) => {
        if (linkedNodesMap[item._cfg.model.id]) {
          graph.setItemState(item, 'fade', false);
          item.getEdges().forEach((edgeItem) => {
            const edgeModel: any = edgeItem.getModel();
            if (
              linkedNodesMap[edgeModel.source] &&
              linkedNodesMap[edgeModel.target]
            ) {
              graph.setItemState(edgeItem, 'fade', false);
            }
          });
        } else {
          graph.setItemState(item, 'fade', true);
        }
      });
      graph.setItemState(nodeItem, 'hover', true);
    };

    const nodeLeave = (ev) => {
      const allNodes = graph.getNodes();
      const allEdges = graph.getEdges();
      allEdges.forEach((edgeItem) => {
        graph.setItemState(edgeItem, 'fade', false);
      });
      allNodes.forEach((item) => {
        graph.setItemState(item, 'fade', false);
      });
      graph.setItemState(ev.item, 'hover', false);
    };

    const nodeClick = (ev) => {
      const nodeItem = ev.item; // 获取被点击的节点元素对象
      const shapeName = ev.target.get('name');
      const originModel = originData.nodes.find(
        (x) => x.id === nodeItem.getModel().id
      );
      isAnimating = true;
      setTimeout(() => {
        isAnimating = false;
      }, 500);
      // 点击折叠展开
      if (
        shapeName &&
        shapeName.startsWith('expander-') &&
        !props.freezeExpand
      ) {
        const expanderType = shapeName.match(/\d+/)[0]; // 获取折叠类型
        toggleSubNodes(graph, expanderType, nodeItem);
        return;
      }
      // 点击瓶颈按钮
      if (shapeName && shapeName.startsWith('bottleneck-')) {
        props?.onNodeBottleneckBtnClick?.(ev, originModel);
        return;
      }

      // 点击其他区域触发显示详情等逻辑
      if (!ev.item._cfg.model.root) {
        const allNodes = graph.getNodes();

        allNodes.forEach((item) => {
          graph.setItemState(item, 'click', false);
        });
        if (nodeItem.getStates().includes('click')) {
          return;
        }
        graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true

        if (props?.onNodeClick) {
          props?.onNodeClick(ev, originModel);
        }
      }
    };

    const edgeEnter = (ev) => {
      // 动画过程中不触发高亮逻辑
      if (isAnimating) {
        return;
      }
      const edgeItem = ev.item;
      edgeItem.toFront();
      graph.setItemState(edgeItem, 'hover', true);
    };

    const edgeLeave = (ev) => {
      const edgeItem = ev.item;
      graph.setItemState(edgeItem, 'hover', false);
    };

    if (props?.onGraphClick) {
      graph.on('canvas:click', props?.onGraphClick);
    }

    graph.on('node:mouseenter', nodeEnter);
    graph.on('node:mouseleave', nodeLeave);
    graph.on('node:click', nodeClick);

    graph.on('edge:mouseenter', edgeEnter);
    graph.on('edge:mouseleave', edgeLeave);

    return () => {
      if (props?.onGraphClick) {
        graph.off('canvas:click', props?.onGraphClick);
      }
      graph.off('node:mouseenter', nodeEnter);
      graph.off('node:mouseleave', nodeLeave);
      graph.off('node:click', nodeClick);
      graph.off('edge:mouseenter', edgeEnter);
      graph.off('edge:mouseleave', edgeLeave);
      graph.getEdges().forEach((x) => {
        graph.clearItemStates(x);
      });
    };
  }, [
    graphInstance,
    labelSetting.length,
    JSON.stringify(graphData),
    JSON.stringify(nodeFilter),
  ]);

  useEffect(() => {
    setNodeFilter(initalNodeFilter);
  }, [props.graphKey]);

  return (
    <div
      style={{
        flex: 1,
        margin: '0 8px 8px 8px',
        borderRadius: 4,
        position: 'relative',
        height: '100%',
      }}
      id="activity_detail"
    >
      <G6GraphV2
        graphKey={props.graphKey}
        data={data}
        ref={handleGraphRef}
        canDragNode={!props.freezedDrag}
        help={tooltip}
      />
      <div>
        {/* {originData.nodes.length > 0 && (
          <Dropdown overlay={dataStaticsDropdownContent}>
            <div
              className={styles.dropdownBtn}
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 2,
                cursor: 'pointer',
                marginRight: 16,
              }}
            >
              <span>
                节点统计
                <Icon
                  type="down"
                  style={{ marginLeft: 8, cursor: 'pointer' }}
                />
              </span>
            </div>
          </Dropdown>
        )} */}
        {!props.freezeExpand && (
          <div
            style={{
              position: 'absolute',
              right: 40,
              top: 16,
              zIndex: 2,
            }}
          >
            {props?.beforeHeaderNode}
            {dataFilterTotal > 0 && (
              <div className={styles.dropdownBtn} style={{ marginLeft: 16 }}>
                节点类型筛选：
                {dataFilterEl}
              </div>
            )}
          </div>
        )}
        {/* {originData.nodes.length > 0 && (
          <div
            className={styles.dropdownBtn}
            style={{ cursor: 'pointer', marginRight: 16 }}
          >
            {tooltip && (
              <Tooltip title={tooltip} arrowPointAtCenter placement="rightTop">
                <Icon
                  type="question-circle"
                  className="pointer"
                  style={{
                    marginRight: 8,
                    color: 'var(--Netural-09, #9E9E9E)',
                  }}
                />
              </Tooltip>
            )}
            <Dropdown overlay={labelSettingDropdownContent}>
              <span>
                显示设置
                <Icon
                  type="down"
                  style={{ marginLeft: 8, cursor: 'pointer' }}
                />
              </span>
            </Dropdown>
          </div>
        )} */}
      </div>
    </div>
  );
};
export default GraphNode;
