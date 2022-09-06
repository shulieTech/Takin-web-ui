import React, { useState, useEffect, useContext } from 'react';
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
  const { defaultList = [] } = props;
  const [list, setList] = useState(defaultList);

  const filterList = (e) => {
    if (e.target.value && e.target.value.trim()) {
      setList(
        list.filter(
          (x) => x.appName.indexOf(e.target.value.trim()) > -1
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
        size="small"
        rowKey="appName"
        dataSource={list}
        columns={[
          {
            title: '应用',
            dataIndex: 'appName',
          },
          {
            title: '是否加入压测范围',
            dataIndex: 'joinPressure',
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

interface Props {
  setEditedDataSource: (record: any) => void;
}
export default (props: Props) => {
  const { setEditedDataSource } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [editShadowTable, setEditShadowTable] = useState<any>(undefined);
  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.datasourceViewMode,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      queryBusinessDataBase: '',
      status: '',
    },
    // isQueryOnMount: false,
  });

  const columns = [
    {
      title: '数据源地址',
      dataIndex: 'businessDatabase',
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
                <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
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
            2: <StatusDot color="var(--FunctionPositive-300, #2DC396)" />
          }[text] || '-'
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'businessUserName',
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
      title: '操作',
      align: 'right',
      render: (text, record) => {
        return (
          <span onClick={(e) => e.stopPropagation()}>
            <a>删除</a>
            {record.appList.length > 0 && <Dropdown overlay={<DropdowTable defaultList={record.appList} />}>
              <a style={{ marginLeft: 32 }}>查看{record.appList.length}个应用</a>
            </Dropdown>}
            <a
              style={{ marginLeft: 32 }}
              onClick={() => setEditedDataSource(record)}
            >
              编辑
            </a>
          </span>
        );
      },
    },
  ];
  if (editShadowTable) {
    // 编辑影子表
    return (
      <TableInfo
        detail={editShadowTable}
        cancelCallback={() => setEditShadowTable(undefined)}
      />
    );
  }

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
              <Option value={0}>未检测</Option>
              <Option value={1}>检测失败</Option>
              <Option value={2}>检测成功</Option>
            </Select>
          </span>
        </div>
        <div>
          <Input.Search
            placeholder="搜索数据源"
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
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          loading={loading}
          size="small"
          onRow={(record) => {
            // 影子表隔离方式时，点击行触发编辑影子表
            return {
              onClick: () => {
                // TODO 判断影子表
                setEditShadowTable(record);
              },
            };
          }}
        />
      </div>
    </>
  );
};
