import React, { useState, useEffect } from 'react';
import { Table, Select, Input } from 'antd';
import service from '../service';
import useListService from 'src/utils/useListService';

interface Props {
  value: any;
  onChange: (val: any) => void;
}

export default (props: Props) => {
  const { value, onChange } = props;

  const { list: appList } = useListService({
    service: service.getLinkList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
  });

  const { list, loading, total, query, getList } = useListService({
    service: service.getLinkList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
    // isQueryOnMount: false,
  });

  const leftColmuns = [
    {
      render: (text, record) => {
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--Netural-900, #303336)',
                  fontWeight: 700,
                  marginRight: 12,
                }}
              >
                GET
              </span>
              <div className="truncate" style={{ flex: 1 }}>
                撤回消息
              </div>
            </div>
            <div
              className="truncate"
              style={{
                fontSize: 12,
                color: 'var(--Netural-600, #90959A)',
                fontWeight: 700,
                marginRight: 12,
                cursor: 'pointer',
              }}
            >
              https://ip:port/uentrance/interf/issue/query
            </div>
          </div>
        );
      },
    },
  ];

  const rightColumns = [
    {
      render: (text, record, index) => {
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--Netural-900, #303336)',
                  fontWeight: 700,
                  marginRight: 12,
                }}
              >
                GET
              </span>
              <div className="truncate" style={{ flex: 1 }}>
                <Input
                  value={record.name}
                  onChange={(e) => {
                    const val = Array.isArray(value) ? value.concat() : [];
                    val[index].name = e.target.value;
                    onChange(val);
                  }}
                />
              </div>
            </div>
            <div
              className="truncate"
              style={{
                fontSize: 12,
                color: 'var(--Netural-600, #90959A)',
                fontWeight: 700,
                marginRight: 12,
                cursor: 'pointer',
              }}
            >
              https://ip:port/uentrance/interf/issue/query
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          flex: 1,
          border: '1px solid var(--Netural-300, #DBDFE3)',
          marginRight: 12,
          padding: 24,
        }}
      >
        <div>
          应用：
          <Select
            placeholder="请选择"
            style={{ width: 210, marginRight: 24 }}
            allowClear
            onChange={(val) =>
              getList({
                appId: val,
                current: 0,
              })
            }
          >
            {appList.map((x) => (
              <Select.Option key={x.id} value={x.id}>
                {x.name}
              </Select.Option>
            ))}
          </Select>
          <Input.Search
            placeholder="搜索接口"
            style={{ width: 228 }}
            onSearch={(val) =>
              getList({
                name: val,
                current: 0,
              })
            }
          />
        </div>
        <Table
          showHeader={false}
          columns={leftColmuns}
          rowKey="id"
          loading={loading}
          dataSource={list}
          rowSelection={{
            getCheckboxProps: (record) => {
              return {
                checked:
                  Array.isArray(value) && value.some((x) => x.id === record.id),
              };
            },
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                const val = Array.isArray(value) ? value : [];
                if (!val.some((x) => x.id === record.id)) {
                  val.push(record);
                  onChange(val);
                }
              },
            };
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          border: '1px solid var(--Netural-300, #DBDFE3)',
          marginLeft: 12,
          padding: 24,
        }}
      >
        <Table
          columns={rightColumns}
          rowKey="id"
          dataSource={value}
          showHeader={false}
        />
      </div>
    </div>
  );
};
