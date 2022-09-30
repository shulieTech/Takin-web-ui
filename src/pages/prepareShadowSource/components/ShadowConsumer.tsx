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
} from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import EditShowConsumerModal from '../modals/EditShowConsumer';
import { PrepareContext } from '../_layout';
import { getUrl } from 'src/utils/request';

const { Option } = Select;

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const inputSearchRef = useRef();
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
      applicationId: '6977836591314112512',
      topicGroup: undefined,
      type: undefined,
      shadowconsumerEnable: undefined,
      resourceId: prepareState.currentLink.id,
    },
    // isQueryOnMount: false,
  });

  const deleteItem = async (record) => {
    const {
      data: { data, success },
    } = await service.deleteConsumer({
      ids: [record.id],
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
      title: '业务的topic#业务的消费组',
      dataIndex: 'topicGroup',
      render: (text, record) => {
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
                  className="iconfont icon-shujuku"
                  style={{
                    fontSize: 18,
                    color: 'var(--Netural-1000, #141617)',
                  }}
                />
                {record.isManual && (
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
                <div
                  style={{
                    color: 'var(--Netural-1000, #141617)',
                  }}
                >
                  {text}
                </div>
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
      title: 'MQ类型',
      dataIndex: 'type',
      render: (text, record) => {
        return text ? <Tag>{text}</Tag> : '-';
      },
    },
    {
      title: '调用应用',
      dataIndex: 'apps',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: '是否消费topic',
      dataIndex: 'shadowconsumerEnable',
      render: (text, record) => {
        return { 0: '否', 1: '是' }[text] || '-';
      },
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'shadowconsumerEnable',
      render: (text, record) => {
        return record.isManual ? (
          <>
            <Button
              type="link"
              style={{ marginLeft: 8 }}
              onClick={() => setEditItem(record)}
            >
              编辑
            </Button>
            <Popconfirm title="确认删除？" onConfirm={() => deleteItem(record)}>
              <Button type="link" style={{ marginLeft: 8 }}>
                删除
              </Button>
            </Popconfirm>
          </>
        ) : (
          '-'
        );
      },
    },
  ];

  const downLoadTplFile = () => {
    window.location.href = getUrl(
      `/pressureResource/ds/export?resourceId=${prepareState.currentLink.id}`
    );
  };

  useEffect(() => {
    setPrepareState({
      helpInfo: {
        show: false,
      },
    });
  }, []);

  return (
    <>
      <div style={{ display: 'flex', padding: '0 32px' }}>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button onClick={() => setEditItem({})}>新增影子消费者</Button>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <Button type="primary" onClick={downLoadTplFile}>
            导出
          </Button>
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
            ref={inputSearchRef}
            placeholder="搜索"
            onSearch={(val) =>
              getList({
                name: val,
                current: 0,
              })
            }
            style={{
              width: 260,
            }}
          />
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <span style={{ marginRight: 24 }}>
            状态：
            <Select
              placeholder="请选择"
              style={{ width: 114 }}
              value={query.shadowconsumerEnable}
              onChange={(val) =>
                getList({
                  shadowconsumerEnable: val,
                  current: 0,
                })
              }
              allowClear
            >
              {/* <Option value="">全部</Option> */}
              <Option value={0}>可消费</Option>
              <Option value={1}>不消费</Option>
            </Select>
          </span>
          <span style={{ marginRight: 24 }}>
            类型：
            <Select
              placeholder="请选择"
              style={{ width: 114 }}
              value={query.type}
              onChange={(val) =>
                getList({
                  type: val,
                  current: 0,
                })
              }
              allowClear
            >
              {/* <Option value="">全部</Option> */}
              {mqTypeList.map((x) => (
                <Option value={x.value} key={x.value}>
                  {x.label}
                </Option>
              ))}
            </Select>
          </span>
        </div>
        <div>
          <Button
            type="link"
            onClick={() => {
              resetList();
              inputSearchRef?.current?.input?.setValue();
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
