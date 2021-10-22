/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import { Switch, Empty, Divider, Tooltip, Table, Select } from 'antd';
import BusinessActivityService from '../service';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { Link, router } from 'umi';

interface Props {
  initailQuery: any;
  afterChangeQuery: any;
  isInBaseInfoModal: boolean;
}

const { Option } = Select;

export const sortServiceList = (nodes = [], activityId, nodeId: any) => {
  let arr = [];
  nodes.forEach((x) => {
    x?.providerService?.forEach((y) => {
      y.dataSource?.forEach((z) => {
        if ((nodeId && x.id === nodeId) || !nodeId) {
          arr.push({
            activityId,
            ...z,
            nodeId: x.id,
            nodeType: x.nodeType,
            serviceLabel: y.label,
          });
        }
      });
    });
  });
  arr = arr.sort((x, y) => {
    const calcWeight = (val) => {
      return {
        '-1': 0,
        0: 0,
        1: 10,
        2: 100,
      }[val];
    };
    return (
      calcWeight(y.allSuccessRateBottleneckType) -
      calcWeight(x.allSuccessRateBottleneckType) +
      (calcWeight(y.allTotalRtBottleneckType) -
        calcWeight(x.allTotalRtBottleneckType)) +
      (calcWeight(y.allSqlTotalRtBottleneckType) -
        calcWeight(x.allSqlTotalRtBottleneckType)) +
      (y.serviceName > x.serviceName ? 1 : 0)
    );
  });
  return arr;
};

export const toAppDetail = async (appName: string, activityDetail: any) => {
  const {
    data: { success, data },
  } = await BusinessActivityService.searchApp({
    appName,
    activityName: activityDetail?.activityName,
  });
  if (success && data?.[0]) {
    router.push(`/appManage/details?tabKey=0&id=${data?.[0]?.id}`);
  }
};

const ServiceList: React.FC<Props> = (props) => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const nodeList = (state.details?.topology?.nodes || []).filter(
    (x) => x.nodeType !== 'VIRTUAL'
  );
  const {
    isInBaseInfoModal,
    initailQuery = state.watchListQuery,
    afterChangeQuery,
  } = props;

  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initailQuery);

  const initailList = sortServiceList(
    state?.details?.topology?.nodes,
    state.details.activityId,
    isInBaseInfoModal ? initailQuery.nodeId : undefined
  );

  const onChangeQuery = (query) => {
    setSearchQuery({
      ...initailQuery,
      ...query,
    });
    if (afterChangeQuery) {
      afterChangeQuery({
        ...initailQuery,
        ...query,
      });
    }
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

  const getList = async () => {
    const { nodeId, bottleneckStatus, bottleneckType, serviceName } =
      searchQuery;
    const list = initailList.filter((x: any) => {
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
          return ![0, -1].includes(x.allTotalRtBottleneckType);
        }
        if (bottleneckType === 2) {
          return ![0, -1].includes(x.allSuccessRateBottleneckType);
        }
        if (bottleneckType === 4) {
          return ![0, -1].includes(x.allSqlTotalRtBottleneckType);
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
  }, [JSON.stringify(searchQuery), JSON.stringify(initailList)]);

  return (
    <>
      {!isInBaseInfoModal && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          选择节点：
          <Select
            placeholder="搜索节点"
            style={{ flex: 1, overflow: 'hidden' }}
            showSearch
            allowClear
            value={searchQuery.nodeId}
            filterOption={(val, option) => {
              if (val) {
                return option?.props.children.toString().includes(val);
              }
              return true;
            }}
            onChange={(val) => {
              onChangeQuery({
                nodeId: (val as string) || undefined,
              });
            }}
          >
            {nodeList.map((x) => (
              <Option key={x.id} value={x.id}>
                {x.label}
              </Option>
            ))}
          </Select>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        服务名称：
        <Select
          placeholder="搜索服务"
          style={{ flex: 1, overflow: 'hidden' }}
          showSearch
          allowClear
          value={searchQuery.serviceName}
          filterOption={(val, option) => {
            if (val) {
              return option?.props.children.toString().includes(val);
            }
            return true;
          }}
          onChange={(val) => {
            onChangeQuery({
              serviceName: (val as string) || undefined,
            });
          }}
        >
          {initailList
            .filter((x: any, i) => {
              return (
                initailList.findIndex(
                  (y: any) => y.serviceName === x.serviceName
                ) === i
              );
            })
            // ?.slice(0, 20)
            ?.map((x: any, i) => (
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
          value={searchQuery.bottleneckStatus}
          onChange={(val) => {
            onChangeQuery({
              bottleneckStatus: val,
            });
          }}
        >
          <Option value={-1}>全部</Option>
          <Option value={1}>一般瓶颈</Option>
          <Option value={2}>严重瓶颈</Option>
        </Select>
        瓶颈类型：
        <Select
          style={{ flex: 1, marginRight: 16 }}
          value={searchQuery.bottleneckType}
          onChange={(val) => {
            onChangeQuery({
              bottleneckType: val,
            });
          }}
        >
          <Option value={-1}>全部</Option>
          <Option value={1}>卡慢</Option>
          <Option value={2}>接口异常</Option>
          <Option value={4}>慢SQL</Option>
        </Select>
        <span>
          <a
            style={{ lineHeight: '32px', marginRight: 8 }}
            onClick={() => {
              onChangeQuery(initailQuery);
            }}
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
          filteredList.map((x: any, i) => {
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
                <div style={{ padding: '0 8px' }}>
                  {x.nodeType === 'APP' && x.middlewareName && (
                    <div style={{ display: 'flex', marginBottom: 8 }}>
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
                    </div>
                  )}
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
                      {x.ownerApps ? (
                        <a
                          onClick={() =>
                            toAppDetail(x.ownerApps, state.details)
                          }
                        >
                          {x.ownerApps}
                        </a>
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>

                  {!isInBaseInfoModal && (
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
                          size="small"
                          checked={x.switchState}
                          onChange={(val) => toggleWatchService(val, x)}
                        />
                      </span>
                    </div>
                  )}
                  <Divider style={{ margin: '10px 0' }} />
                  <Table
                    size="small"
                    columns={[
                      {
                        title: '上游应用',
                        dataIndex: 'beforeApps',
                        render: (text) => {
                          return (
                            <Tooltip title={text}>
                              <div
                                style={{
                                  maxWidth: 100,
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {text ? (
                                  <a
                                    onClick={() =>
                                      toAppDetail(text, state.details)
                                    }
                                  >
                                    {text}
                                  </a>
                                ) : (
                                  '无'
                                )}
                              </div>
                            </Tooltip>
                          );
                        },
                      },
                      {
                        title: '成功率',
                        dataIndex: 'serviceAllSuccessRate',
                        align: 'center',
                        render: (text, record: any) => {
                          return (
                            <span>
                              {record.allSuccessRateBottleneckType !== -1 &&
                                record.successRateBottleneckId && (
                                  <div>
                                    <span
                                      style={{
                                        display: 'inline-block',
                                        width: 8,
                                        height: 8,
                                        marginRight: 8,
                                        backgroundColor: {
                                          1: '#FFA800',
                                          2: '#ed6047',
                                        }[record.allSuccessRateBottleneckType],
                                        borderRadius: '100%',
                                      }}
                                    />
                                    <Link
                                      to={`/pro/bottleneckTable/bottleneckDetails?exceptionId=${record.successRateBottleneckId}`}
                                    >
                                      {{ 1: '一般瓶颈', 2: '严重瓶颈' }[record.allSuccessRateBottleneckType]}
                                    </Link>
                                  </div>
                                )}
                              {(text || 0) * 100}%
                            </span>
                          );
                        },
                      },
                      {
                        title: 'RT',
                        dataIndex: 'serviceRt',
                        align: 'center',
                        render: (text, record: any) => {
                          const rtType =
                            x.nodeType === 'DB'
                              ? record.allSqlTotalRtBottleneckType
                              : record.allTotalRtBottleneckType;
                          const rtId =
                            x.nodeType === 'DB'
                              ? record.rtSqlBottleneckId
                              : record.rtBottleneckId;
                          return (
                            <span>
                              {rtType !== -1 && rtId && (
                                <div>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: 8,
                                      height: 8,
                                      marginRight: 8,
                                      backgroundColor: {
                                        1: '#FFA800',
                                        2: '#ed6047',
                                      }[rtType],
                                      borderRadius: '100%',
                                    }}
                                  />
                                  <Link
                                    to={`/pro/bottleneckTable/bottleneckDetails?exceptionId=${rtId}`}
                                  >
                                    {{ 1: '一般瓶颈', 2: '严重瓶颈' }[rtType]}
                                  </Link>
                                </div>
                              )}
                              {text || 0}
                            </span>
                          );
                        },
                      },
                      {
                        title: 'TPS',
                        dataIndex: 'serviceAllTotalTps',
                        align: 'center',
                        render: (text) => {
                          return <span>{text || 0}</span>;
                        },
                      },
                      {
                        title: '请求数',
                        dataIndex: 'serviceAllTotalCount',
                        align: 'center',
                        render: (text) => {
                          return <span>{text || 0}</span>;
                        },
                      },
                    ]}
                    dataSource={x.containRealAppProvider || []}
                    pagination={false}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <Empty style={{ marginTop: 100 }} />
        )}
      </div>
    </>
  );
};

export default ServiceList;
