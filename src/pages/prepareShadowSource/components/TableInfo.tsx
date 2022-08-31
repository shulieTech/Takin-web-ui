import React, { useState, useEffect } from 'react';
import { Table, Divider, Button, Icon, Switch, Input, Select } from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import { debounce } from 'lodash';
import StatusDot from './StatusDot';

const { Option } = Select;

interface Props {
  detail: any;
  cancelCallback: () => void;
}

export default (props: Props) => {
  const { detail, cancelCallback } = props;
  const [boxStyle, setBoxStyle] = useState({ top: '100%' });
  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.getLinkList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      type: '',
      status: '',
      entry: undefined,
    },
    isQueryOnMount: false,
  });

  useEffect(() => {
    if (detail?.id) {
      setBoxStyle({
        top: 0,
      });
      getList();
    } else {
      setBoxStyle({
        top: '100%',
      });
    }
  }, [detail]);

  const columns = [
    {
      title: '业务表名',
      dataIndex: 'tableName',
      render: (text, record) => {
        return (
          <>
            {record.isManual && (
              <span
                style={{
                  backgroundColor: 'var(--Netural/600, #90959A)',
                  borderTopLeftRadius: 2,
                  borderBottomRightRadius: 4,
                  textAlign: 'center',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: 14,
                  height: 14,
                  marginRight: 8,
                  fontSize: 12,
                }}
              >
                <Icon type="edit" style={{ color: '#fff' }} />
              </span>
            )}
            {text}
          </>
        );
      },
    },
    {
      title: '影子表名',
      dataIndex: 'shadowTableName',
    },
    {
      title: '配置状态',
      dataIndex: 'status',
      render: (text, record) => {
        return <StatusDot />;
      },
    },
    {
      title: '是否加入',
      dataIndex: 'invovled',
      render: (text, record) => {
        return <Switch />;
      },
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record) => {
        return <a>删除</a>;
      },
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#fff',
        overflow: 'auto',
        transition: 'top .3s',
        ...boxStyle,
      }}
    >
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: 16,
              color: 'var(--Netural-1000, #141617)',
              fontWeight: 600,
            }}
          >
            表信息
          </span>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <span>jdbc:mysql://192.168.100.252：3306/easydemo_dbl</span>
          <span style={{ marginLeft: 24 }}>业务库名：easydemo_db</span>
        </div>
        <div>
          <Button type="link">全部加入</Button>
          <Button type="link" style={{ marginLeft: 24 }}>
            全部不加入
          </Button>
          <Button style={{ marginLeft: 24 }}>新增业务表</Button>
          <Icon
            style={{ marginLeft: 24, padding: 8 }}
            type="caret-down"
            onClick={cancelCallback}
          />
        </div>
      </div>
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input.Search
            placeholder="搜索表名"
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
      />
    </div>
  );
};
