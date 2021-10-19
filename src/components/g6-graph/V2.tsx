import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  MutableRefObject,
} from 'react';
import { GraphData, GraphOptions } from '@antv/g6/lib/types';
import { Graph, Minimap, ToolBar, Grid } from '@antv/g6';
import { Empty, Modal } from 'antd';
import iconfontNode from './iconfontNode';
import styles from './index.less';

iconfontNode();

export const defaultEdgeLabelCfg = {
  style: {
    fill: '#838B99',
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 15,
    background: {
      fill: '#fff',
      stroke: '#E1E7EF',
      padding: [4, 6, 4, 4],
      radius: 4,
    },
  },
};

export type RestGraphOption = Pick<
  GraphOptions,
  Exclude<keyof GraphOptions, 'container'>
>;
interface GraphProps {
  data?: GraphData;
  showMiniMap?: boolean;
  showToolBar?: boolean;
  showGrid?: boolean;
  canDragNode?: boolean;
  g6Option?: RestGraphOption;
  onReady?: (graph: Graph) => void;
  graphKey?: number | string;
  help?: string;
}

const GraphComponent = (props: GraphProps, ref: any) => {
  const {
    data,
    showMiniMap = true,
    showToolBar = true,
    showGrid = true,
    g6Option = {},
    onReady,
    canDragNode = true,
  } = props;
  const containerRef: MutableRefObject<any> = useRef();
  const [graph, setGraph] = useState<Graph>();

  const initGraph = (): Graph | undefined => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    const { width, height } = (
      container as HTMLElement
    ).getBoundingClientRect();

    const plugins = [];
    if (showMiniMap) {
      plugins.push(
        new Minimap({
          size: [100, 100],
        })
      );
    }
    if (showToolBar) {
      const toolbar = new ToolBar(!props?.help ? {} : {
        getContent: () => {
          return `<ul class="g6-component-toolbar">
          <li code="help">
            <svg class="icon" viewBox="-64 -64 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
            </svg>
          </li>
          <li code="zoomOut">
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M658.432 428.736a33.216 33.216 0 0 1-33.152 33.152H525.824v99.456a33.216 33.216 0 0 1-66.304 0V461.888H360.064a33.152 33.152 0 0 1 0-66.304H459.52V296.128a33.152 33.152 0 0 1 66.304 0V395.52H625.28c18.24 0 33.152 14.848 33.152 33.152z m299.776 521.792a43.328 43.328 0 0 1-60.864-6.912l-189.248-220.992a362.368 362.368 0 0 1-215.36 70.848 364.8 364.8 0 1 1 364.8-364.736 363.072 363.072 0 0 1-86.912 235.968l192.384 224.64a43.392 43.392 0 0 1-4.8 61.184z m-465.536-223.36a298.816 298.816 0 0 0 298.432-298.432 298.816 298.816 0 0 0-298.432-298.432A298.816 298.816 0 0 0 194.24 428.8a298.816 298.816 0 0 0 298.432 298.432z"></path>
            </svg>
          </li>
          <li code="zoomIn">
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M639.936 416a32 32 0 0 1-32 32h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 32 32z m289.28 503.552a41.792 41.792 0 0 1-58.752-6.656l-182.656-213.248A349.76 349.76 0 0 1 480 768 352 352 0 1 1 832 416a350.4 350.4 0 0 1-83.84 227.712l185.664 216.768a41.856 41.856 0 0 1-4.608 59.072zM479.936 704c158.784 0 288-129.216 288-288S638.72 128 479.936 128a288.32 288.32 0 0 0-288 288c0 158.784 129.216 288 288 288z" p-id="3853"></path>
            </svg>
          </li>
          <li code="realZoom">
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
              <path d="M384 320v384H320V320h64z m256 0v384H576V320h64zM512 576v64H448V576h64z m0-192v64H448V384h64z m355.968 576H92.032A28.16 28.16 0 0 1 64 931.968V28.032C64 12.608 76.608 0 95.168 0h610.368L896 192v739.968a28.16 28.16 0 0 1-28.032 28.032zM704 64v128h128l-128-128z m128 192h-190.464V64H128v832h704V256z"></path>
            </svg>
          </li>
          <li code="autoZoom">
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
              <path d="M684.288 305.28l0.128-0.64-0.128-0.64V99.712c0-19.84 15.552-35.904 34.496-35.712a35.072 35.072 0 0 1 34.56 35.776v171.008h170.944c19.648 0 35.84 15.488 35.712 34.432a35.072 35.072 0 0 1-35.84 34.496h-204.16l-0.64-0.128a32.768 32.768 0 0 1-20.864-7.552c-1.344-1.024-2.816-1.664-3.968-2.816-0.384-0.32-0.512-0.768-0.832-1.088a33.472 33.472 0 0 1-9.408-22.848zM305.28 64a35.072 35.072 0 0 0-34.56 35.776v171.008H99.776A35.072 35.072 0 0 0 64 305.216c0 18.944 15.872 34.496 35.84 34.496h204.16l0.64-0.128a32.896 32.896 0 0 0 20.864-7.552c1.344-1.024 2.816-1.664 3.904-2.816 0.384-0.32 0.512-0.768 0.768-1.088a33.024 33.024 0 0 0 9.536-22.848l-0.128-0.64 0.128-0.704V99.712A35.008 35.008 0 0 0 305.216 64z m618.944 620.288h-204.16l-0.64 0.128-0.512-0.128c-7.808 0-14.72 3.2-20.48 7.68-1.28 1.024-2.752 1.664-3.84 2.752-0.384 0.32-0.512 0.768-0.832 1.088a33.664 33.664 0 0 0-9.408 22.912l0.128 0.64-0.128 0.704v204.288c0 19.712 15.552 35.904 34.496 35.712a35.072 35.072 0 0 0 34.56-35.776V753.28h170.944c19.648 0 35.84-15.488 35.712-34.432a35.072 35.072 0 0 0-35.84-34.496z m-593.92 11.52c-0.256-0.32-0.384-0.768-0.768-1.088-1.088-1.088-2.56-1.728-3.84-2.688a33.088 33.088 0 0 0-20.48-7.68l-0.512 0.064-0.64-0.128H99.84a35.072 35.072 0 0 0-35.84 34.496 35.072 35.072 0 0 0 35.712 34.432H270.72v171.008c0 19.84 15.552 35.84 34.56 35.776a35.008 35.008 0 0 0 34.432-35.712V720l-0.128-0.64 0.128-0.704a33.344 33.344 0 0 0-9.472-22.848zM512 374.144a137.92 137.92 0 1 0 0.128 275.84A137.92 137.92 0 0 0 512 374.08z"></path>
            </svg>
          </li>
        </ul>`;
        },
      });

      plugins.push(toolbar);
    }
    if (showGrid) {
      plugins.push(
        new Grid({
          // 图片位置 assets/img/grid.svg
          img: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAxMDAgMTAwIEwgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YwRjBGMCIgc3Ryb2tlLXdpZHRoPSIxIiAvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=")',
        })
      );
    }

    const defaultMode = [
      'drag-canvas',
      'zoom-canvas',
      {
        type: 'tooltip',
        shouldBegin: (evt: any) => {
          const { model } = evt.item._cfg;
          return model.nodeType !== 'VIRTUAL';
        },
        formatText: (model: any) => {
          const fixNum = (num: number, len = 2) => (num ? num.toFixed(len) : 0);
          const hasServiceOpened = model?.providerService?.some(y => y?.dataSource?.some(z => !!z.switchState));

          // tslint:disable-next-line: max-line-length
          return `<div style="padding: 8px;box-shadow:  0px 10px 35px rgba(0, 0, 0, 0.1);background: #2E333B;max-width: 448px;border-radius: 4px;word-break:break-all;color:#fff;font-size:12px;">
          应用名称：${model.label}<br/>
          ${
            hasServiceOpened ? `${`调用量：${model.serviceAllTotalCount || 0}<br/>`}
            ${`TPS：${model.serviceAllTotalTps || 0}<br/>`}
            ${`RT：${model.serviceRt || 0}<br/>`}
            ${`成功率：${fixNum(model.serviceAllSuccessRate * 100)}%<br/>`}` : ''
          }

        </div>`;
        },
      },
      {
        type: 'edge-tooltip',
        shouldBegin: (evt: any) => {
          const { infos } = evt.item._cfg.model;
          return (
            Array.isArray(infos) && infos.filter((x) => x.length > 0).length > 0
          );
        },
        formatText: (model: any) => {
          const text: string = (model.infos || [])
            .map((item) => `<div>${item}</div>`)
            .join(
              `<hr style="border: none;background-color: #F8F8F8; height: 1px;"/>`
            );
          // tslint:disable-next-line: max-line-length
          return `<div style="border: 1px solid #E8E8E8;padding: 16px;box-shadow:  0px 10px 35px rgba(0, 0, 0, 0.1);background: #fff;max-width: 448px;border-radius: 4px;word-break:break-all;color:var(--Netural-14,#424242);font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;">
           ${text}
        </div>`;
        },
      },
    ];
    if (canDragNode) {
      defaultMode.push('drag-node');
    }
    return new Graph({
      container,
      width,
      height,
      plugins,
      layout: {
        type: 'dagre',
        rankdir: 'LR', // 从左至右布局
        align: 'UL',
        nodesep: 50, // 节点间距
        ranksep: 50, //
        ranksepFunc: (node) => {
          let distance = 50;
          if (node.subNodesCountMap) {
            const expanderTypeCounts = Object.values(
              node.subNodesCountMap
            ).filter((x) => x > 0).length; // 有多少个折叠
            distance = expanderTypeCounts > 0 ? 100 : 60;
          }
          if (node.hasOppositeLine) {
            distance += 60;
          }
          return distance;
        }, // 层间距
      },
      modes: {
        default: defaultMode,
      },
      defaultNode: {
        size: [64, 64],
        type: 'rect',
        style: {
          lineWidth: 2,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
        },
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        size: 2,
        color: '#98A1B3',
        style: {
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#98A1B3',
          },
          radius: 20,
        },
        labelCfg: defaultEdgeLabelCfg,
        loopCfg: {
          // 自环
          position: 'left',
          dist: 150,
        },
      },
      edgeStateStyles: {
        fade: {
          strokeOpacity: 0.2,
        },
        hover: {
          stroke: '#26cdc3',
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#26cdc3',
          },
        },
      },
      animate: true,
      fitCenter: true,
      fitView: true,
      fitViewPadding: [60, 16, 16, 16],
      minZoom: 0.2,
      maxZoom: 1.5,
      ...g6Option,
    });
  };

  /**
   * 转发出graph对象
   */
  useImperativeHandle(
    ref,
    () => {
      return {
        graph,
      };
    },
    [graph]
  );

  /**
   * data/配置变更时重新渲染
   */
  useEffect(() => {
    let _graph = graph;
    if (!graph) {
      _graph = initGraph();
      // 关闭局部刷新，修复safari下拖拽残影
      // https://github.com/antvis/G6/issues/2920
      _graph.get('canvas').set('localRefresh', false);
      setGraph(_graph);
    }
    if (_graph && data?.nodes?.length > 0) {
      _graph?.data(data);
      setTimeout(() => {
        _graph?.render();
        if (onReady) {
          onReady(_graph);
        }
      }, 50);
    }
    // return () => {
    //   graph?.destroy();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, props?.graphKey]);

  useEffect(() => {
    if (graph) {
      data?.nodes?.forEach((x) => {
        const nodeItem = graph.findById(x.id);
        if (nodeItem) {
          // 折叠状态需要从节点旧的状态中获取， 否则会被重置
          graph.updateItem(x.id, { ...x, expanderTypeState: nodeItem.getModel().expanderTypeState });
        }
      });
      data?.edges?.forEach((x) => {
        const edgeItem = graph.find('edge', (y: any) => {
          const model = y.getModel();
          return model.source === x.source && model.target === x.target;
        });
        if (edgeItem) {
          graph.updateItem(edgeItem, x);
        }
      });
      // (graph.getNodes() || []).forEach((x) => {
      //   const model = x.getModel();
      //   if (!data?.nodes.some(y => y.id === model.id)) {
      //     graph.removeItem(x);
      //   }
      // });
      // (graph.getEdges() || []).forEach((x) => {
      //   const model = x.getModel();
      //   if (!data?.edges.some(y => y.source === model.source && y.target === model.target)) {
      //     graph.removeItem(x);
      //   }
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, JSON.stringify(data)]);

  /**
   * 窗口大小变动时重新渲染
   */
  useEffect(() => {
    const container = containerRef.current;
    let timer: ReturnType<typeof setTimeout> | null;
    const resizeHandle = () => {
      if (graph && !graph.get('destroyed')) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          const { width, height } = (
            container as HTMLElement
          ).getBoundingClientRect();
          graph?.changeSize(width, height);
          graph?.fitCenter();
          timer = null;
        }, 200);
      }
    };
    window.addEventListener('resize', resizeHandle);

    // toolbar 提示语
    const helpDom = document.querySelector('[code=help]');
    const showHelp = () => {
      Modal.info({
        title: '提示',
        content: props.help
      });
    };
    if (props.help) {
      helpDom?.addEventListener('click', showHelp);
    }

    return () => {
      window.removeEventListener('resize', resizeHandle);
      if (props.help) {
        helpDom?.removeEventListener('click', showHelp);
      }
      if (timer) {
        clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  return (
    <>
      <div
        ref={containerRef}
        className={styles.graph}
        style={{
          height: '100%',
          position: 'relative',
          backgroundColor: '#fff',
          // display: data?.nodes?.length > 0 ? 'block' : 'none',
        }}
      />
      {!(data?.nodes?.length > 0) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 10,
            background: '#fff',
          }}
        >
          <Empty
            style={{
              // position: 'relative',
              // top: '50%',
              // transform: 'translatey(-50%)',
              marginTop: 240,
            }}
            image={require('src/assets/link-empty.png')}
            imageStyle={{
              marginLeft: 40,
              height: 200,
              width: 'auto',
              marginRight: 40,
            }}
            description={
              <>
                <span
                  style={{
                    fontSize: 20,
                    color: 'var(--Netural-14, #424242)',
                    display: 'block',
                    marginBottom: 16,
                  }}
                >
                  链路暂无节点
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--Netural-08, #ABABAB)',
                  }}
                >
                  链路暂无节点，请检查链路相关节点是否接入探针
                </span>
              </>
            }
          />
        </div>
      )}
    </>
  );
};

export default forwardRef(GraphComponent);
