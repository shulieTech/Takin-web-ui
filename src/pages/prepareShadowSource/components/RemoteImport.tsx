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
  Checkbox,
} from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import { debounce } from 'lodash';
import EditMockModal from '../modals/EditMock';

const { Option } = Select;

export default (props) => {
  const inputSearchRef = useRef();
  const [editItem, setEditItem] = useState();

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
    service: service.datasourceViewMode,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      queryBusinessDataBase: undefined,
      status: '',
    },
    // isQueryOnMount: false,
  });

  const columns = [
    {
      title: '接口名称',
      dataIndex: 'interfaceName',
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
                className="iconfont icon-shujuku"
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
                ID:{record.id}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '配置状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          {
            0: <StatusDot />,
            1: (
              <>
                <StatusDot color="var(--FunctionPositive-300, #2DC396)" />
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
            ),
            2: <StatusDot color="var(--FunctionPositive-300, #2DC396)" />,
          }[text] || '-'
        );
      },
    },
    {
      title: '调用依赖',
      dataIndex: 'dependency',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'middlewareType',
      render: (text, record) => {
        return text ? <Tag>{text}</Tag> : '-';
      },
    },
    {
      title: '是否放行',
      align: 'right',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" onClick={() => setEditItem(record)}>
              配置mock
            </Button>
            <Switch style={{ marginLeft: 24 }} />
          </span>
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
            ref={inputSearchRef}
            placeholder="搜索接口"
            onSearch={(val) =>
              getList({
                queryBusinessDataBase: val,
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
            类型：
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
              <Option value={0}>未检测</Option>
              <Option value={1}>检测失败</Option>
              <Option value={2}>检测成功</Option>
            </Select>
          </span>
          <span>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={query.joinPressure === 0}
              onChange={(e) =>
                getList({
                  joinPressure: e.target.checked ? 0 : 1,
                })
              }
            >
              已放行
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
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          loading={loading}
          size="small"
        />
      </div>
      {!!editItem && (
        <EditMockModal
          detail={editItem}
          cancelCallback={() => setEditItem(undefined)}
          okCallback={() => {
            setEditItem(undefined);
            getList();
          }}
        />
      )}
    </>
  );
};
