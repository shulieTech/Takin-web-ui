import React, { useState, useEffect, useContext } from 'react';
import {
  Divider,
  Icon,
  Button,
  Table,
  Input,
  Select,
  Checkbox,
  Tooltip,
  Switch,
  InputNumber,
  Form,
} from 'antd';
import { PrepareContext } from '../indexPage';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import { debounce } from 'lodash';
import EditAgentCount from './EditAgentCount';

const { Option } = Select;

export default (props) => {
  const {
    list: appList,
    getList: getAppList,
    loading: appLoading,
  } = useListService({
    service: service.appList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
  });

  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.getLinkList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      type: '',
      status: '',
      entry: undefined,
    },
    // isQueryOnMount: false,
  });

  const toggleInvovled = (checked, record) => {
    // TODO 加入压测范围
  };

  const columns = [
    {
      title: '应用',
      dataIndex: 'applicationName',
      render: (text, record) => {
        return (
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
              }}
            >
              <span
                className="iconfont icon-huancun1"
                style={{
                  fontSize: 18,
                  color: 'var(--Netural-1000, #141617)',
                }}
              />
            </div>
            <div>
              <div
                style={{
                  color: 'var(--Netural-1000, #141617)',
                }}
              >
                mall-monitor-1.0-SNAPSHOTmall-monitor-1.0-SNAPSHOT
              </div>
              <div
                style={{
                  color: 'var(--Netural-600, #90959A)',
                }}
              >
                ID:92
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          {
            0: <StatusDot />,
            1: <StatusDot color="var(--FunctionPositive-300, #2DC396)" />,
          }[text] || '-'
        );
      },
    },
    {
      title: (
        <span>
          隔离方案
          <Tooltip title="222">
            <Icon
              type="info-circle"
              style={{ marginLeft: 8, cursor: 'pointer' }}
            />
          </Tooltip>
        </span>
      ),
      dataIndex: 'plan',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: (
        <span>
          节点总数/探针总数
          <Tooltip title="222">
            <Icon
              type="info-circle"
              style={{ marginLeft: 8, cursor: 'pointer' }}
            />
          </Tooltip>
        </span>
      ),
      dataIndex: '',
      render: (text, record) => {
        return <EditAgentCount record={record} />;
      },
    },
    {
      title: (
        <span>
          是否加入压测范围
          <Tooltip title="222">
            <Icon
              type="info-circle"
              style={{ marginLeft: 8, cursor: 'pointer' }}
            />
          </Tooltip>
        </span>
      ),
      dataIndex: '',
      render: (text, record) => {
        return (
          <Switch
            checked={text}
            onChange={(checked) => toggleInvovled(checked, record)}
          />
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 32px',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input.Search
            placeholder="搜索应用"
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
            入口：
            <Select
              style={{ width: 114 }}
              value={query.entry}
              onChange={(val) =>
                getList({
                  entry: val,
                  current: 0,
                })
              }
              dropdownMatchSelectWidth={false}
              showSearch
              filterOption={false}
              placeholder="搜索入口URL"
              onSearch={debounce(
                (val) => getAppList({ current: 0, applicationName: val }),
                300
              )}
              optionLabelProp="label"
              allowClear
            >
              {appList.map((x) => {
                return (
                  <Option
                    value={x.id}
                    key={x.id}
                    style={{
                      border: '1px solid #F7F8FA',
                    }}
                    label="https://ip:port/uentrance/interf/issue/biopsy-sequence"
                  >
                    <div
                      style={{
                        color: 'var(--Netural-900, #303336)',
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                      className="truncate"
                    >
                      <span style={{ marginRight: 8, fontWeight: 700 }}>
                        GET
                      </span>
                      凭证申领信息查询
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--Netural-600, #90959A)',
                      }}
                    >
                      https://ip:port/uentrance/interf/issue/biopsy-sequence
                    </div>
                  </Option>
                );
              })}
            </Select>
          </span>
          <span style={{ marginRight: 24 }}>
            状态：
            <Select
              style={{ width: 114 }}
              value={query.status}
              onChange={(val) =>
                getList({
                  status: val,
                  current: 0,
                })
              }
            >
              <Option value="">全部</Option>
            </Select>
          </span>
          <span>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={query.type === 1}
              onChange={(e) =>
                getList({
                  type: e.target.checked ? 1 : 0,
                })
              }
            >
              不在压测范围
            </Checkbox>
          </span>
        </div>
        <div>
          <Button type="link" onClick={resetList} disabled={loading}>
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
      <Table
        columns={columns}
        dataSource={list}
        pagination={false}
        loading={loading}
        size="small"
      />
    </>
  );
};
