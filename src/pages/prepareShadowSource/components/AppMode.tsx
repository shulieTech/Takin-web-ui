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
  Dropdown,
} from 'antd';
import { PrepareContext } from '../indexPage';
import Help from './Help';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import { debounce, filter } from 'lodash';

const { Option } = Select;

const DropdowTable = (props) => {
  const defaultList = [
    {
      id: 1,
      interface: 'jdbc:mysql://192.168.100.252：3306/easydemo_dbl',
      status: 0,
    },
    {
      id: 2,
      interface: 'jdbc:mysql://192.168.100.252：3306/easydemo_dbl',
      status: 1,
    },
    {
      id: 3,
      interface: 'jdbc:mysql://192.168.100.252：3306/easydemo_dbl',
      status: 2,
    },
  ];
  const [list, setList] = useState(defaultList);

  const filterList = (e) => {
    if (e.target.value && e.target.value.trim()) {
      setList(
        list.filter((x) => x.interface.indexOf(e.target.value.trim()) > -1)
      );
    } else {
      setList(defaultList);
    }
  };
  return (
    <div
      style={{
        width: 475,
        padding: 8,
        background: '#fff',
        boxShadow:
          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
      }}
    >
      <Input.Search
        placeholder="搜索数据源"
        style={{
          marginBottom: 8,
        }}
        onChange={filterList}
      />
      <Table
        size="middle"
        showHeader={false}
        rowKey="id"
        dataSource={list}
        columns={[
          {
            dataIndex: 'interface',
          },
          {
            dataIndex: 'status',
            width: 20,
            fixed: 'right',
            render: (text) => {
              return {
                0: <StatusDot />,
                1: <StatusDot color="var(--FunctionPositive-300, #2DC396)" />,
                2: <StatusDot color="var(--FunctionNegative-500, #D24D40)" />,
              }[text];
            },
          },
        ]}
        pagination={false}
      />
    </div>
  );
};

export default (props) => {
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
      title: '所属数据源',
      align: 'right',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'right' }}>
            divjdbc:mysql://192.168.100.252：3306/
            <div style={{ marginTop: 8 }}>
              <Dropdown overlay={<DropdowTable />}>
                <a>共3个</a>
              </Dropdown>
            </div>
          </div>
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
    </>
  );
};
