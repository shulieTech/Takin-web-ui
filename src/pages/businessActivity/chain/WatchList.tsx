/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import {
  Drawer,
  Select,
  Icon,
  Spin,
  Tooltip,
} from 'antd';
import styles from '../index.less';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { Link } from 'umi';
import ServiceList, { sortServiceList } from './ServiceList';

const { Option } = Select;

interface Props {
  activityId?: number;
}

const WatchList: React.FC<Props> = (props) => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const nodeList = (state.details?.topology?.nodes || []).filter(
    (x) => x.nodeType !== 'VIRTUAL'
  );

  const { watchListQuery, watchListVisible } = state;

  const [bottleneckList, setBottleneckList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const arr = sortServiceList(
      state?.details?.topology?.nodes,
      props.activityId
    );
    setBottleneckList(arr);
    setFilteredList(arr);
  }, [JSON.stringify(state?.details?.topology?.nodes)]);

  const initalQuery = {
    activityId: props.activityId,
    nodeId: undefined,
    serviceName: undefined,
    bottleneckStatus: -1,
    bottleneckType: -1,
  };

  const getList = async () => {
    // setLoading(true);
    // const {
    //   data: { data, success },
    //   headers: { totalCount },
    // } = await BusinessActivityService.getBottleneckList({
    //   activityId: props.activityId,
    //   ...state.watchListQuery,
    // });
    // setLoading(false);
    // if (success && data) {
    //   setBottleneckList(data);
    //   setTotal(+totalCount);
    // }
    const { nodeId, bottleneckStatus, bottleneckType, serviceName } =
      state.watchListQuery;
    const list = bottleneckList.filter((x) => {
      if (nodeId && x.nodeId !== nodeId) {
        return false;
      }
      // if (serviceName && !x.serviceName.includes(serviceName?.trim())) {
      //   return false;
      // }
      if (serviceName && x.serviceName !== serviceName) {
        return false;
      }
      if (bottleneckStatus !== -1) {
        if (
          !(
            x.allSuccessRateBottleneckType === bottleneckStatus ||
            x.allTotalRtBottleneckType === bottleneckStatus ||
            x.allSqlTotalRtBottleneckType === bottleneckStatus
          )
        ) {
          return false;
        }
      }
      if (bottleneckType !== -1) {
        // 卡慢是 allTotalRtBottleneckType 不等于 -1
        // 接口异常是 allSuccessRateBottleneckType 不等于 -1
        // 慢sql 是 allSqlTotalRtBottleneckType 不等于 -1
        if (bottleneckType === 1) {
          return x.allTotalRtBottleneckType !== -1;
        }
        if (bottleneckType === 2) {
          return x.allSuccessRateBottleneckType !== -1;
        }
        if (bottleneckType === 4) {
          return x.allSqlTotalRtBottleneckType !== -1;
        }
        return false;
      }
      return true;
    });

    setFilteredList(list);
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state.watchListQuery), bottleneckList]);

  return (
    <Drawer
      maskClosable
      onClose={() => setState({ watchListVisible: false })}
      width={560}
      style={{
        position: 'absolute',
        height: 'calc(100% - 16px)',
        top: 8,
        right: 10,
      }}
      headerStyle={{ backgroundColor: 'var(--FunctionalNetural-50, #F5F7F9)' }}
      placement="right"
      className={styles.nodeInfoDrawer}
      mask={false}
      visible={watchListVisible}
      getContainer={document.getElementById('detail_graph_box')}
      destroyOnClose
      title={
        <div id="watchListHeader">
          链路性能监控
          <Tooltip
            title="1、「在链路图显示流量性能」：表示当前节点服务的性能数据显示在链路图中，对于单一节点来说，如果选中了多个服务，则显示多个服务性能数据的加权平均值，性能数据包括调用量、TPS、RT、成功率等。
            2、「瓶颈监控」：瓶颈监控是根据混合流量（包含压测流量+业务流量）的性能情况计算得出的性能瓶颈"
          >
            <Icon
              type="question-circle"
              style={{ cursor: 'pointer', marginLeft: 8 }}
            />
          </Tooltip>
        </div>
      }
    >
      <Spin spinning={loading}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          选择节点：
          <Select
            placeholder="搜索节点"
            style={{ flex: 1, overflow: 'hidden' }}
            showSearch
            allowClear
            value={watchListQuery.nodeId}
            filterOption={(val, option) => {
              if (val) {
                return option?.props.children.toString().includes(val);
              }
              return true;
            }}
            onChange={(val) =>
              setState({
                watchListQuery: {
                  ...watchListQuery,
                  nodeId: (val as string) || undefined,
                },
              })
            }
          >
            {nodeList.map((x) => (
              <Option key={x.id} value={x.id}>
                {x.label}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          服务名称：
          <Select
            placeholder="搜索服务"
            style={{ flex: 1, overflow: 'hidden' }}
            showSearch
            allowClear
            value={watchListQuery.serviceName}
            filterOption={(val, option) => {
              if (val) {
                return option?.props.children.toString().includes(val);
              }
              return true;
            }}
            onChange={(val) =>
              setState({
                watchListQuery: {
                  ...watchListQuery,
                  serviceName: (val as string) || undefined,
                },
              })
            }
          >
            {bottleneckList
              .filter(
                (x, i) =>
                  bottleneckList.findIndex(
                    (y) => y.serviceName === x.serviceName
                  ) === i
              )
              // ?.slice(0, 20)
              ?.map((x, i) => (
                <Option key={i + x.serviceName} value={x.serviceName}>
                  {x.serviceName}
                </Option>
              ))}
          </Select>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          瓶颈状态：
          <Select
            style={{ flex: 1, marginRight: 16 }}
            value={watchListQuery.bottleneckStatus}
            onChange={(val) =>
              setState({
                watchListQuery: {
                  ...watchListQuery,
                  bottleneckStatus: val,
                },
              })
            }
          >
            <Option value={-1}>全部</Option>
            <Option value={1}>一般瓶颈</Option>
            <Option value={2}>严重瓶颈</Option>
          </Select>
          瓶颈类型：
          <Select
            style={{ flex: 1, marginRight: 16 }}
            value={watchListQuery.bottleneckType}
            onChange={(val) =>
              setState({
                watchListQuery: {
                  ...watchListQuery,
                  bottleneckType: val,
                },
              })
            }
          >
            <Option value={-1}>全部</Option>
            <Option value={1}>卡慢</Option>
            <Option value={2}>接口异常</Option>
            <Option value={4}>慢SQL</Option>
          </Select>
          <span>
            <a
              style={{ lineHeight: '32px', marginRight: 8 }}
              onClick={() =>
                setState({
                  watchListQuery: initalQuery,
                })
              }
            >
              重置
            </a>
            {/* <Button onClick={getList} style={{ padding: '0 8px' }}>
              <Icon type="reload" />
            </Button> */}
          </span>
        </div>
        <ServiceList list={filteredList} activityDetail={state.details}/>
      </Spin>
    </Drawer>
  );
};

export default WatchList;
