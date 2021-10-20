import { Icon, message, Spin, Switch } from 'antd';
import { useCreateContext, useStateReducer } from 'racc';
import React, { useEffect, useState } from 'react';
import SkeletonLoading from 'src/common/loading/SkeletonLoading';
import { Basic } from 'src/types';
import HeaderNode from './chain/HeaderNode';
import { NodeBean } from './enum';
import BusinessActivityService from './service';
import GraphNode from 'src/components/g6-graph/GraphNode';
import NodeInfoDrawer from './chain/NodeInfoDrawer';
import WatchList from './chain/WatchList';
import BaseInfoModal from './chain/BaseInfoModal';
import { Graph } from '@antv/g6';
import ActivityLeftList from './chain/ActivityLeftList';
import styles from 'src/components/g6-graph/GraphNode/index.less';

const getInitState = () => ({
  baseInfoVisible: false,
  infoBarVisible: true,
  nodeVisible: false,
  nodeInfo: null as NodeBean,
  details: null,
  node: null as HTMLElement,
  reload: 0,
  graph: Graph,
  labelSetting: [] as string[],
  refreshTime: 0, // 自动刷新间隔，0为不刷新
  detailLoading: false,
  queryParams: {
    // startTime: '',
    // endTime: '',
    flowTypeEnum: 'BLEND',
  },
  watchListVisible: false,
  watchListQuery: {
    nodeId: undefined,
    serviceName: undefined,
    bottleneckStatus: -1,
    bottleneckType: -1,
  },
});
type State = ReturnType<typeof getInitState>;
// eslint-disable-next-line react-hooks/rules-of-hooks
export const BusinessActivityDetailsContext = useCreateContext<State>();

interface Props extends Basic.BaseProps {
  dictionaryMap: { domain: { label: string; value: string }[] };
}
const BusinessActivityDetails: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>(getInitState());

  const [id, setId] = useState(props.location.query.id);

  const afterVertifyFlow = (data) => {
    const { nodes } = data.topology;
    const length = nodes.length - state.details.topology.nodes.length;
    message.success(
      <span>
        节点检测成功，成功扫描出{length}个节点
        <Icon
          onClick={() => message.destroy()}
          type="close"
          style={{ transform: 'translate(6px, -2px)' }}
        />
      </span>,
      0
    );
  };

  const queryActivityDetails = async () => {
    setState({
      detailLoading: true
    });
    const {
      data: { data, success },
    } = await BusinessActivityService.getBusinessActivityDetails({
      activityId: id,
      ...state.queryParams,
    });
    setState({
      detailLoading: false
    });
    if (success && data) {
      if (state.details && data.verifiedFlag) {
        afterVertifyFlow(data);
      }
      setState({ details: data });
    }
  };

  const showNodeDetail = (e, originModel) => {
    setState({
      nodeInfo: originModel,
      nodeVisible: true,
      watchListVisible: false,
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (timer) {
      clearTimeout(timer);
    }
    const refreshData = () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (state.refreshTime) {
        timer = setTimeout(refreshData, state.refreshTime);
      }
      queryActivityDetails();
    };

    refreshData();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.reload, id, state.refreshTime, JSON.stringify(state.queryParams)]);

  useEffect(() => {
    if (state.watchListVisible) {
      setState({
        watchListVisible: false,
      });
    }
    if (state.nodeVisible) {
      setState({
        nodeVisible: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // 标记未知应用后刷新列表，当前节点详情数据同步刷新
    if (state.nodeVisible && state.nodeInfo) {
      const newNodeInfo = state.details.topology.nodes.find(
        (x) => x.id === state.nodeInfo.id
      );
      if (newNodeInfo) {
        setState({ nodeInfo: newNodeInfo });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state?.details?.topology?.node), id]);

  if (!state.details) {
    return <SkeletonLoading />;
  }
  return (
    <BusinessActivityDetailsContext.Provider value={{ state, setState }}>
      <div
        style={{
          background: '#F8F9FA',
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <ActivityLeftList
          initialId={props.location.query.id}
          currentId={id}
          onChangeId={setId}
          currentPageIndex={props.location.query.pageIndex}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <HeaderNode />
          <div style={{ position: 'relative', height: '100%' }} id="detail_graph_box">
            <Spin spinning={false} wrapperClassName={'spin-full'}>
              {/* <span
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                30s自动
                <a
                  onClick={() => {
                    setState({ reload: state.reload + 1 });
                  }}
                >
                  刷新
                </a>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  style={{ marginLeft: 8 }}
                  checked={ennableRefresh}
                  onChange={setEnnableRefresh}
                />
              </span> */}
              <GraphNode
                graphKey={state.details?.activityId}
                graphData={state.details.topology}
                onGraphReady={(val) => setState({ graph: val })}
                onNodeClick={showNodeDetail}
                onGraphClick={() => {
                  setState({ nodeVisible: false, watchListVisible: false, });
                }}
                onLabelSettingChange={(val) => setState({ labelSetting: val })}
                tooltip={
                  <div>
                    调用量：包含所有业务活动的调用量数据，取最近 5分钟的累加值；
                    <br />
                    成功率：包含所有业务活动的成功率数据，取最近 5分钟的平均成功率；
                    <br />
                    TPS：包含所有业务活动的TPS数据，取最近 5分钟的平均TPS, 单位次/秒；
                    <br />
                    RT：包含所有业务活动的RT数据，取最近 5分钟的平均RT, 单位毫秒；
                    <br />
                    延迟：链路性能数据涉及大量数据计算与采集，数据存在一定延迟，大概2分钟左右。
                  </div>
                }
                beforeHeaderNode={<div className={styles.dropdownBtn}>
                    监控详情：
                    <Switch
                      style={{ verticalAlign: 4 }}
                      size="small"
                      checked={state.watchListVisible}
                      onChange={(val) => {
                        setState({
                          watchListVisible: val,
                          watchListQuery: getInitState().watchListQuery,
                        });
                      }}
                    />
                  </div>}
                showBottleneckBtn
                onNodeBottleneckBtnClick={(ev, val) => {
                  setState({
                    nodeVisible: false,
                    watchListVisible: true,
                    watchListQuery: {
                      ...getInitState().watchListQuery,
                      nodeId: val?.id,
                    },
                  });
                }}
              />
            </Spin>
          </div>
          {state.nodeVisible && state.nodeInfo && (
            <NodeInfoDrawer key={state.nodeInfo.id + state.nodeInfo.nodeType} />
          )}
          {state.watchListVisible && state.details && (
            <WatchList activityId={id} />
          )}
          <BaseInfoModal />
        </div>
      </div>
    </BusinessActivityDetailsContext.Provider>
  );
};
export default BusinessActivityDetails;
