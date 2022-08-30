import React, { useState, useEffect, useContext } from 'react';
import {
  Alert,
  Divider,
  Icon,
  Button,
  Tooltip,
  Table,
  Input,
  Select,
  Tag,
  Switch,
  Dropdown,
} from 'antd';
import { PrepareContext } from '../indexPage';
import Help from './Help';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import TableInfo from './TableInfo';
import { debounce } from 'lodash';

const { Option } = Select;

const DropdowTable = (props) => {
  const defaultList = [
    {
      id: 1,
      applicationName: '门店-无清单团单-发版',
      status: 0,
    },
    {
      id: 2,
      applicationName: '门店-无清单团单-发版',
      status: 1,
    },
    {
      id: 3,
      applicationName: '门店-无清单团单-发版',
      status: 2,
    },
  ];
  const [list, setList] = useState(defaultList);

  const filterList = (e) => {
    if (e.target.value && e.target.value.trim()) {
      setList(
        list.filter(
          (x) => x.applicationName.indexOf(e.target.value.trim()) > -1
        )
      );
    } else {
      setList(defaultList);
    }
  };
  return (
    <div
      style={{
        width: 320,
        padding: 8,
        background: '#fff',
        boxShadow:
          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
      }}
    >
      <Input.Search
        placeholder="搜索应用"
        style={{
          marginBottom: 8,
        }}
        onChange={filterList}
      />
      <Table
        size="middle"
        rowKey="id"
        dataSource={list}
        columns={[
          {
            title: '应用',
            dataIndex: 'applicationName',
          },
          {
            title: '是否加入压测范围',
            dataIndex: 'status',
            fixed: 'right',
            align: 'right',
            render: (text) => {
              return <Switch checked={text === 1} size="small" />;
            },
          },
        ]}
        pagination={false}
      />
    </div>
  );
};

export default (props) => {
  const [editedDataSource, setEditDataSource] = useState(undefined);
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

  const columns = [
    {
      title: '数据源地址',
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
      title: '配置状态',
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
      title: '用户名',
      dataIndex: 'username',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record) => {
        return text ? <Tag>{text}</Tag> : '-';
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <a>删除</a>
            <Dropdown overlay={<DropdowTable />}>
              <a style={{ marginLeft: 32 }}>查看24个应用</a>
            </Dropdown>
            <a
              style={{ marginLeft: 32 }}
              onClick={() => setEditDataSource(record)}
            >
              编辑
            </a>
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
          padding: '24px 32px',
        }}
      >
        <div style={{ flex: 1 }}>
          <span style={{ marginRight: 24 }}>
            配置状态：
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
        </div>
        <div>
          <Input.Search
            placeholder="搜索数据源"
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
      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          loading={loading}
        />
      </div>
      <div
        style={{
          padding: '8px 32px',
          borderTop: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <Help showBanner={false} />
          <span>
            识别应用：<b>24</b>
          </span>
          <span style={{ marginLeft: 32 }}>
            正常： <b>24</b>
          </span>
        </div>
        <div>
          <span>检测时间：3 分钟前</span>
          <span style={{ marginLeft: 40 }}>负责人：朱七七</span>
        </div>
      </div>
      <TableInfo
        detail={editedDataSource}
        cancelCallback={() => setEditDataSource(undefined)}
      />
    </>
  );
};
