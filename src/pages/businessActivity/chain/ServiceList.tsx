/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import { Switch, Empty, Divider, Tooltip, Table } from 'antd';
import BusinessActivityService from '../service';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { Link, router } from 'umi';

interface Props {
  activityDetail: any;
  list: [];
  canSwitch: boolean;
}

export const sortServiceList = (nodes = [], activityId) => {
  let arr = [];
  nodes.forEach((x) => {
    x?.providerService?.forEach((y) => {
      y.dataSource?.forEach((z) => {
        arr.push({
          activityId,
          ...z,
          nodeId: x.id,
          nodeType: x.nodeType,
          serviceLabel: y.label,
        });
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
  const { list, canSwitch = true } = props;

  const { state, setState } = useContext(BusinessActivityDetailsContext);

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

  return (
    <div style={{ marginTop: 16 }}>
      {list.length > 0 ? (
        list.map((x: any, i) => {
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
                    {x.ownerApps || '-'}
                  </span>
                </div>

                {canSwitch && (
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
  );
};

export default ServiceList;
