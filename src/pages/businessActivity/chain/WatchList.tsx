/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import {
  Drawer,
  Select,
  Switch,
  Icon,
  Button,
  Empty,
  Spin,
  Divider,
  Tooltip,
  Modal,
} from 'antd';
import BusinessActivityService from '../service';
import styles from '../index.less';
import classNames from 'classnames';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { Link } from 'umi';

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
    let arr = [];
    state?.details?.topology?.nodes?.forEach((x) => {
      x?.providerService?.forEach((y) => {
        y.dataSource?.forEach((z) => {
          arr.push({
            ...z,
            nodeId: x.id,
            activityId: props.activityId,
            nodeType: x.nodeType,
            serviceLabel: y.label,
          });
        });
      });
    });
    arr = arr.sort((x, y) => {
      const calcWeight = val => {
        return ({
          '-1': 0,
          0: 0,
          1: 10,
          2: 100,
        }[val]);
      };
      return (calcWeight(y.allSuccessRateBottleneckType) - calcWeight(x.allSuccessRateBottleneckType)) +
        (calcWeight(y.allTotalRtBottleneckType) - calcWeight(x.allTotalRtBottleneckType)) +
        (calcWeight(y.allSqlTotalRtBottleneckType) - calcWeight(x.allSqlTotalRtBottleneckType)) +
        (y.serviceName > x.serviceName ? 1 : 0);
    });
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

  const toggleWatchService = (checked, item) => {
    const toggleRequest = async () => {
      const {
        data: { success: success2 },
      } = await BusinessActivityService.setWatchService({
        activityId: item.activityId,
        serviceName: `${item.serviceLabel}:${item.serviceName}`,
        ownerApps: item.ownerApps,
        state: checked,
        nodeId: item.nodeId,
      });
      if (success2) {
        setState({
          reload: state.reload + 1,
        });
        // getList();
      }
    };

    toggleRequest();

    // if (checked && bottleneckList.filter(x => (x.nodeId === item.nodeId) && x.switchState).length >= 1) {
    //   Modal.confirm({
    //     title: '提示',
    //     content: '目前每个节点仅支持展示一个服务的性能数据，是否确认显示？',
    //     onOk: toggleRequest,
    //   });
    // } else {
    //   toggleRequest();
    // }
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
        <div style={{ marginTop: 16 }}>
          {filteredList.length > 0 ? (
            filteredList.map((x, i) => {
              return (
                <div
                  key={i + x.nodeId + x.serviceName}
                  style={{
                    padding: 16,
                    borderRadius: 4,
                    boxShadow:
                      '0px 2px 10px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.1)',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: 'var(--Netural-13, #525252)',
                    }}
                  >
                    <span style={{ marginRight: 24 }}>
                      {i < 9 ? `0${i + 1}` : i + 1}
                    </span>
                    {x.serviceName}
                    <Divider style={{ margin: '10px 0' }} />
                  </div>
                  <div style={{ paddingLeft: 24 }}>
                    {x.nodeType === 'APP' && x.middlewareName && <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        调用方中间件：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        {x.middlewareName || '-'}
                      </span>
                    </div>}
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        所属应用：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        {x.ownerApps || '-'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        上游应用：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          overflow: 'hidden',
                        }}
                      >
                        {x.beforeApps || '-'}
                      </span>
                    </div>
                    {/* <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        性能概览：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          overflow: 'hidden',
                        }}
                      >
                        {x.allTotalTps || 0}/{x.allTotalCount || 0}
                      </span>
                    </div> */}
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        在链路图中显示：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        <Switch
                          checked={x.switchState}
                          onChange={(val) => toggleWatchService(val, x)}
                        />
                      </span>
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        成功率
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        {x.allSuccessRateBottleneckType !== -1 &&
                          x.successRateBottleneckId && (
                            <>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: 8,
                                  height: 8,
                                  marginRight: 8,
                                  backgroundColor: {
                                    1: '#FFA800',
                                    2: '#ed6047',
                                  }[x.allSuccessRateBottleneckType],
                                  borderRadius: '100%',
                                }}
                              />
                              {{ 1: '一般瓶颈', 2: '严重瓶颈' }[x.allSuccessRateBottleneckType]}
                              <Link
                                style={{ marginLeft: 4 }}
                                to={`/bottleneckTable/bottleneckDetails?exceptionId=${x.successRateBottleneckId}`}
                              >
                                查看
                              </Link>
                            </>
                          )}
                        <span
                          style={{
                            marginLeft: 16,
                            color: { 1: '#FFA800', 2: '#ed6047' }[x.allSuccessRateBottleneckType],
                          }}
                        >
                          {(x.serviceAllSuccessRate || 0) * 100}%
                        </span>
                      </span>
                    </div>

                    {/* DB类型，RT的值字段名不同 */}
                    {x.nodeType === 'DB' ? (
                      <div style={{ display: 'flex', marginBottom: 8 }}>
                        <span
                          style={{
                            color: 'var(--Netural-10, #8e8e8e)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          RT
                        </span>
                        <span
                          style={{
                            flex: 1,
                            textAlign: 'right',
                            wordBreak: 'break-all',
                            overflow: 'hidden',
                          }}
                        >
                          {x.allSqlTotalRtBottleneckType !== -1 &&
                            x.rtSqlBottleneckId && (
                              <>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: 8,
                                    height: 8,
                                    marginRight: 8,
                                    backgroundColor: {
                                      1: '#FFA800',
                                      2: '#ed6047',
                                    }[x.allSqlTotalRtBottleneckType],
                                    borderRadius: '100%',
                                  }}
                                />
                                {{ 1: '一般瓶颈', 2: '严重瓶颈' }[x.allSqlTotalRtBottleneckType]}
                                <Link
                                  style={{ marginLeft: 4 }}
                                  to={`/bottleneckTable/bottleneckDetails?exceptionId=${x.rtSqlBottleneckId}`}
                                >
                                  查看
                                </Link>
                              </>
                            )}
                          <span
                            style={{
                              marginLeft: 16,
                              color: { 1: '#FFA800', 2: '#ed6047' }[x.allSqlTotalRtBottleneckType],
                            }}
                          >
                            {x.serviceRt || 0}ms
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', marginBottom: 8 }}>
                        <span
                          style={{
                            color: 'var(--Netural-10, #8e8e8e)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          RT
                        </span>
                        <span
                          style={{
                            flex: 1,
                            textAlign: 'right',
                            wordBreak: 'break-all',
                            overflow: 'hidden',
                          }}
                        >
                          {x.allTotalRtBottleneckType !== -1 &&
                            x.rtBottleneckId && (
                              <>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: 8,
                                    height: 8,
                                    marginRight: 8,
                                    backgroundColor: {
                                      1: '#FFA800',
                                      2: '#ed6047',
                                    }[x.allTotalRtBottleneckType],
                                    borderRadius: '100%',
                                  }}
                                />
                                {{ 1: '一般瓶颈', 2: '严重瓶颈' }[x.allTotalRtBottleneckType]}
                                <Link
                                  style={{ marginLeft: 4 }}
                                  to={`/bottleneckTable/bottleneckDetails?exceptionId=${x.rtBottleneckId}`}
                                >
                                  查看
                                </Link>
                              </>
                            )}
                          <span
                            style={{
                              marginLeft: 16,
                              color: { 1: '#FFA800', 2: '#ed6047' }[x.allTotalRtBottleneckType],
                            }}
                          >
                            {x.serviceRt || 0}ms
                          </span>
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        TPS：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        {x.serviceAllTotalTps || 0}
                      </span>
                    </div>

                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <span
                        style={{
                          color: 'var(--Netural-10, #8e8e8e)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        请求数：
                      </span>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        {x.serviceAllTotalCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty style={{ marginTop: 100 }} />
          )}
        </div>
      </Spin>
    </Drawer>
  );
};

export default WatchList;
