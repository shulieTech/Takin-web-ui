import React, { useState, useEffect, useContext, useRef } from 'react';
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
} from 'antd';
import { PrepareContext } from '../indexPage';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import { debounce } from 'lodash';
import EditAgentCount from './EditAgentCount';
import { ISOLATE_TYPE } from '../constants';

const { Option } = Select;

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const inputSearchRef = useRef();

  const {
    list: entryList,
    getList: getEntryList,
    loading: entryLoading,
  } = useListService({
    service: service.entryList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
  });

  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.appCheckList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      resourceId: prepareState.currentLink?.id,
      joinPressure: undefined,
      status: undefined,
      entry: undefined,
    },
    isQueryOnMount: false,
  });

  const toggleInvovled = (checked, record) => {
    // TODO 加入压测范围
  };

  const columns = [
    {
      title: '应用',
      dataIndex: 'appName',
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
                {text}
              </div>
              <div
                style={{
                  color: 'var(--Netural-600, #90959A)',
                }}
              >
                ID:{record.detailId}
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
            0: <StatusDot color="var(--FunctionPositive-300, #2DC396)" />, // 正常
            1: <StatusDot color="var(--FunctionNegative-400, #E8695D)" />, // 不正常
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
      dataIndex: 'isolateType',
      render: (text, record) => {
        return ISOLATE_TYPE[text] || '-';
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
      dataIndex: 'joinPressure',
      align: 'right',
      render: (text, record) => {
        return (
          <Switch
            checked={text === 0} // 0是， 1否
            onChange={(checked) => toggleInvovled(checked, record)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (prepareState.currentLink?.id) {
      getList();
    }
  }, [prepareState.currentLink?.id]);

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
            ref={inputSearchRef}
            placeholder="搜索应用"
            onSearch={(val) =>
              getList({
                appName: val,
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
                (val) => getEntryList({ current: 0, serviceName: val }),
                300
              )}
              loading={entryLoading}
              optionLabelProp="label"
              allowClear
            >
              {entryList.map((x) => {
                return (
                  <Option
                    value={x.value}
                    key={x.value}
                    style={{
                      border: '1px solid #F7F8FA',
                    }}
                    label={x.label}
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
                        {x.label}
                      </span>
                      {x.serviceName}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--Netural-600, #90959A)',
                      }}
                    >
                      {x.serviceName}
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
              allowClear
              placeholder="请选择"
            >
              <Option value={0}>正常</Option>
              <Option value={1}>不正常</Option>
            </Select>
          </span>
          <span>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={query.joinPressure === 0}
              onChange={(e) =>
                getList({
                  joinPressure: e.target.checked ? 0 : 1, // 是否加入压测范围(0-是 1-否)
                })
              }
            >
              不在压测范围
            </Checkbox>
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
      <Table
        rowKey="detailId"
        columns={columns}
        dataSource={list}
        pagination={false}
        loading={loading}
        size="small"
      />
    </>
  );
};
