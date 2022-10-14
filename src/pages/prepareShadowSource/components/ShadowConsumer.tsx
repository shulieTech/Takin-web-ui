import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Divider,
  Icon,
  Button,
  Tooltip,
  Table,
  Input,
  Select,
  Tag,
  Switch,
  message,
  Popconfirm,
  Checkbox,
} from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import EditShowConsumerModal from '../modals/EditShowConsumer';
import { PrepareContext } from '../_layout';

const { Option } = Select;

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const inputSearchRef1 = useRef();
  const inputSearchRef2 = useRef();
  const [editItem, setEditItem] = useState<any>();

  const { list: mqTypeList, loading: mqTypeLoading } = useListService({
    service: service.mqTypeList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
  });

  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.shadowConsumerList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      queryTopicGroup: undefined,
      queryApplicationName: undefined,
      mqType: undefined,
      consumerTag: undefined,
      resourceId: prepareState.currentLink.id,
    },
    // isQueryOnMount: false,
  });

  const toggleItem = async (record, checked) => {
    const {
      data: { data, success },
    } = await service.toggleConsumer({
      id: record.id,
      consumerTag: checked ? 0 : 1,
    });
    if (success) {
      message.success('操作成功');
      getList();
      setPrepareState({
        stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
        refreshListKey: prepareState.refreshListKey + 1,
      });
    }
  };

  const deleteItem = async (record) => {
    const {
      data: { data, success },
    } = await service.deleteConsumer({
      id: record.id,
    });
    if (success) {
      message.success('操作成功');
      getList();
      setPrepareState({
        stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
        refreshListKey: prepareState.refreshListKey + 1,
      });
    }
  };

  const columns = [
    {
      title: '业务的topic',
      dataIndex: 'topicGroup',
      render: (text, record) => {
        const topicName = text.split('#')[0];
        return (
          <>
            {{
              0: <StatusDot title="未检测" />,
              1: (
                <>
                  <StatusDot
                    color="var(--FunctionNegative-500, #D24D40)"
                    title="检测失败"
                  />
                  {record.remark && (
                    <>
                      <Divider
                        type="vertical"
                        style={{ height: 24, margin: '0 24px' }}
                      />
                      <Tooltip title={record.remark}>
                        <Icon
                          type="file-text"
                          theme="filled"
                          style={{
                            cursor: 'pointer',
                            color: 'var(--Brandprimary-500, #0FBBD5)',
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              ),
              2: (
                <StatusDot
                  color="var(--FunctionPositive-300, #2DC396)"
                  title="检测成功"
                />
              ),
            }[record.status] || '-'}
            <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
            <div style={{ display: 'inline-flex' }}>
              <div
                style={{
                  width: 40,
                  lineHeight: '38px',
                  height: 40,
                  textAlign: 'center',
                  border: '1px solid var(--Netural-200, #E5E8EC)',
                  borderRadius: 16,
                  marginRight: 24,
                  position: 'relative',
                }}
              >
                <span
                  className="iconfont icon-ES"
                  style={{
                    fontSize: 18,
                    color: 'var(--Netural-1000, #141617)',
                  }}
                />
                {record.type === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'var(--Netural-600, #90959A)',
                      borderTopLeftRadius: 4,
                      borderBottomRightRadius: 8,
                      textAlign: 'center',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      width: 14,
                      height: 14,
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    <Icon type="edit" style={{ color: '#fff' }} />
                  </span>
                )}
              </div>
              <div>
                <Tooltip title={topicName}>
                  <div
                    style={{
                      color: 'var(--Netural-1000, #141617)',
                      maxWidth: 300,
                    }}
                    className="truncate"
                  >
                    {topicName}
                  </div>
                </Tooltip>
                <div
                  style={{
                    color: 'var(--Netural-600, #90959A)',
                  }}
                >
                  ID:{record.id}
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: '业务的消费组',
      render: (text, record) => {
        const topicGroup = record.topicGroup.split('#')[1];
        return topicGroup || '-';
      },
    },
    {
      title: 'MQ类型',
      dataIndex: 'mqType',
      render: (text, record) => {
        return text ? (
          <>
            <Tag>{text}</Tag>
            {record.mqType === 'KAFKA' && (
              <span>{{ 0: '生产者', 1: '消费者' }[record.comsumerType]}</span>
            )}
          </>
        ) : (
          '-'
        );
      },
    },
    {
      title: '调用应用',
      dataIndex: 'applicationName',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: '是否消费topic',
      dataIndex: 'consumerTag', // 0-消费 1-不消费
      render: (text, record) => {
        // kafka生产者不显示
        if (record.mqType === 'KAFKA' && record.comsumerType === 0) {
          return '-';
        }
        return (
          <Switch
            checked={text === 0}
            onChange={(checked) => toggleItem(record, checked)}
          />
        );
      },
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              style={{ marginLeft: 8 }}
              onClick={() => setEditItem(record)}
            >
              编辑
            </Button>
            {record.type === 0 && (
              <Popconfirm
                title="确认删除？"
                onConfirm={() => deleteItem(record)}
              >
                <Button type="link" style={{ marginLeft: 8 }}>
                  删除
                </Button>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];

  const getConsumerSummaryInfo = async (id) => {
    const {
      data: { success, data },
      // topic 统计信息
    } = await service.consumerSummaryInfo({ id });
    if (success) {
      setPrepareState({
        helpInfo: {
          show: true,
          text: (
            <>
              {data.totalSize > 0 ? (
                <span>
                  识别topic：<b>{data.totalSize}</b>
                </span>
              ) : (
                '暂无数据'
              )}
              {data.normalSize > 0 && (
                <span style={{ marginLeft: 32 }}>
                  正常： <b>{data.normalSize}</b>
                </span>
              )}
              {data.exceptionSize > 0 && (
                <span
                  style={{
                    marginLeft: 32,
                  }}
                >
                  异常：
                  <b style={{ color: 'var(--FunctionNegative-500, #D24D40)' }}>
                    {data.exceptionSize}
                  </b>
                </span>
              )}
            </>
          ),
          checkTime: data.checkTime,
          userName: data.userName,
        },
      });
    }
  };

  useEffect(() => {
    if (prepareState.currentLink?.id) {
      getConsumerSummaryInfo(prepareState.currentLink?.id);
    }
  }, [prepareState.currentLink?.id]);

  return (
    <>
      <div style={{ display: 'flex', padding: '16px 32px 0' }}>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button onClick={() => setEditItem({})}>新增影子消费者</Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 32px',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input.Search
            ref={inputSearchRef1}
            placeholder="搜索业务topic#业务的消费组"
            onSearch={(val) =>
              getList({
                queryTopicGroup: val,
                current: 0,
              })
            }
            style={{
              width: 240,
              marginRight: 16,
            }}
          />
          <Input.Search
            ref={inputSearchRef2}
            placeholder="搜索应用"
            onSearch={(val) =>
              getList({
                queryApplicationName: val,
                current: 0,
              })
            }
            style={{
              width: 240,
              marginRight: 16,
            }}
          />
          <span style={{ marginRight: 24 }}>
            类型：
            <Select
              placeholder="请选择"
              style={{ width: 114 }}
              value={query.mqType}
              onChange={(val) =>
                getList({
                  mqType: val,
                  current: 0,
                })
              }
              allowClear
              loading={mqTypeLoading}
            >
              {/* <Option value="">全部</Option> */}
              {mqTypeList.map((x) => (
                <Option value={x.value} key={x.value}>
                  {x.label}
                </Option>
              ))}
            </Select>
          </span>
          <span>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={query.consumerTag === 0}
              onChange={(e) =>
                getList({
                  consumerTag: e.target.checked ? 0 : undefined,
                })
              }
            >
              消费topic
            </Checkbox>
          </span>
        </div>
        <div>
          <Button
            type="link"
            onClick={() => {
              resetList();
              inputSearchRef1?.current?.input?.setValue();
              inputSearchRef2?.current?.input?.setValue();
            }}
            disabled={loading}
          >
            重置
          </Button>
          <Button
            style={{ width: 32, padding: 0, marginLeft: 32 }}
            onClick={() => getList()}
            disabled={loading}
          >
            <Icon type="sync" spin={loading} />
          </Button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            total,
            pageSize: query.pageSize,
            current: query.current + 1,
            hideOnSinglePage: true,
            onChange: (page, pageSize) =>
              getList({
                pageSize,
                current: page - 1,
              }),
            style: { marginRight: 60 },
          }}
          loading={loading}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </div>
      {!!editItem && (
        <EditShowConsumerModal
          detail={editItem}
          mqTypeList={mqTypeList}
          cancelCallback={() => setEditItem(undefined)}
          okCallback={() => {
            setEditItem(undefined);
            getList();
            setPrepareState({
              stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
              refreshListKey: prepareState.refreshListKey + 1,
            });
          }}
        />
      )}
    </>
  );
};
