import React, { FC, useState, useEffect, useRef } from 'react';
import { GraphOptions, Graph } from '@antv/g6/lib/types';
import domNode from 'src/components/g6-graph/domNode';
import G6Graph from 'src/components/g6-graph';
import { Empty, Spin, Button, Icon, Radio } from 'antd';
import Styles from './index.less';
import classNames from 'classnames';
import AppNodeCard from './components/AppNodeCard';
import ReactDOMServer from 'react-dom/server';

domNode();

interface Props {

}

const RelationPage: FC<Props> = props => {
  const [graph, setGraph] = useState();
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);

  const containerRef = useRef();

  const endArrow = {
    size: 5,
    path: 'M 0,0 L -4,2 L -4,-2 Z',
    aaaa: 'red',
    // path: G6.Arrow.triangle(5, 5, 5), // svg模式下箭头方向会跟canvs相反
    d: 2,
  };

  const options: Partial<GraphOptions> = {
    renderer: 'svg',
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      nodesepFunc: (d) => {
        return 0;
      },
      ranksep: 90,
      controlPoints: true,
    },
  };

  const transformNodes = (item: any) => {
    const container: HTMLElement = containerRef?.current;
    if (!container) {
      return item;
    }
    const itemJsx = (
      <AppNodeCard
        style={{ width: 330 }}
        className={classNames({ [Styles['card-darken']]: item.id === '000' })}
      />
    );
    const html = ReactDOMServer.renderToString(itemJsx); // jsx 转换成dom字符串
    const span = document.createElement('span');
    span.innerHTML = html;
    container.appendChild(span);
    const { width, height } = (span.firstChild as HTMLElement).getBoundingClientRect();
    container.removeChild(span);

    return {
      ...item,
      html,
      size: [width, height],
      type: 'dom-node',
      anchorPoints: [
        [0, 0.5], // 左侧中间
        [1, 0.5], // 右侧中间
      ],
    };
  };
  const transformEdges = (item: any) => {
    return {
      ...item,
      style: {
        endArrow,
        stroke: '#E6EAF0',
        lineWidth: 4,
      }
    };
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setData({
        nodes: [
          { id: '111' },
          { id: '222' },
          { id: '000' },
          { id: '333' },
          { id: '444' },
        ],
        edges: [
          { source: '111', target: '000' },
          { source: '222', target: '000' },
          { source: '000', target: '333' },
          { source: '000', target: '444' },
        ]
      });
    }, 1000);
  }, []);

  return (
    <div className="flex" style={{ height: '100%', flexDirection: 'column' }} >
      <div
        className={classNames(
          'pd-2x',
          Styles['bg-white'],
          Styles.shadow,
          Styles['rounded-8px']
        )}
      >
        <div className="flex w-100p">
          <div
            className={classNames(
              'ft-white ft-ct ft-16 mg-r2x',
              Styles['bg-green-500'],
              Styles.rounded
            )}
            style={{
              lineHeight: '28px',
              width: 28,
              height: 28,
            }}
          >
            <span className="iconfont icon-jieshi-3" />
          </div>
          <div className="flex-1">
            <div className={classNames('ft-16', Styles['text-gray-600'])} style={{ fontWeight: 600 }}>
              调用详情
            </div>

          </div>
          <Icon className="pointer" type="close" onClick={() => history.go(-1)} />
        </div>
        <div className="flex mg-t3x">
          <div
            className={classNames('flex-1', Styles['text-gray-400'])}
            style={{ lineHeight: '32px' }}
          >
            仅展示当前应用直接关联的第一层调用关系
          </div>
          <Radio.Group defaultValue={1} className="mg-r2x">
            <Radio.Button value={1}>调用关系</Radio.Button>
            <Radio.Button value={2}>调用明细</Radio.Button>
          </Radio.Group>
          <Button style={{ padding: '0 8px' }}>
            <Icon type="reload" />
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1">
        <Spin spinning={loading} wrapperClassName={Styles['full-spin']}>
          <G6Graph
            id="g6_graph"
            emptyNode={Empty}
            data={data}
            options={options}
            onReady={(graphInstance: Graph, node) => {
              setGraph(graphInstance);
            }}
            transformNodes={transformNodes}
            transformEdges={transformEdges}
          />
        </Spin>
      </div>
    </div>
  );
};

export default RelationPage;