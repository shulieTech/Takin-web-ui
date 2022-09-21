import React, { useState, useEffect } from 'react';
import {
  Table,
  Select,
  Input,
  Pagination,
  Icon,
  Tooltip,
  Checkbox,
} from 'antd';
import service from '../service';
import useListService from 'src/utils/useListService';
import { debounce } from 'lodash';
import styles from '../index.less';

interface Props {
  value?: any;
  onChange?: (val: any) => void;
}

export default (props: Props) => {
  const { value, onChange } = props;
  const [rightPage, setRightPage] = useState({
    current: 1,
    pageSize: 10,
  });

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

  const { list, loading, total, query, getList } = useListService({
    service: service.entryList,
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={
                Array.isArray(value) &&
                value.some((x) => x.value === record.value)
              }
              style={{ margin: '0 16px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex' }}>
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--Netural-900, #303336)',
                    fontWeight: 700,
                    marginRight: 12,
                  }}
                >
                  {record.method}
                </span>
                <div className="truncate" style={{ flex: 1 }}>
                  {record.name || '-'}
                </div>
              </div>
              <Tooltip title={record.serviceName}>
                <div
                  className="truncate"
                  style={{
                    fontSize: 12,
                    color: 'var(--Netural-600, #90959A)',
                    marginRight: 12,
                    cursor: 'pointer',
                    maxWidth: 400,
                  }}
                >
                  {record.serviceName || '-'}
                </div>
              </Tooltip>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon
              type="delete"
              theme="filled"
              style={{
                color: 'var(--BrandPrimary-500, #0FBBD5)',
                marginRight: 18,
                fontSize: 16,
                cursor: 'pointer',
              }}
              onClick={() => {
                const val = Array.isArray(value) ? value.concat() : [];
                const valIndex = val.findIndex((x) => x.value === record.value);
                if (valIndex > -1) {
                  val.splice(valIndex, 1);
                  if (onChange) {
                    onChange(val);
                  }
                }
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--Netural-900, #303336)',
                    fontWeight: 700,
                    marginRight: 12,
                  }}
                >
                  {record.method}
                </span>
                <div className="truncate" style={{ flex: 1 }}>
                  <Input
                    value={record.entranceName}
                    onChange={(e) => {
                      const val = Array.isArray(value) ? value.concat() : [];
                      const valIndex = val.findIndex(
                        (x) => x.value === record.value
                      );
                      if (valIndex > -1) {
                        val[valIndex].entranceName = e.target.value;
                        if (onChange) {
                          onChange(val);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <Tooltip title={record.entranceUrl || record.serviceName}>
                <div
                  className="truncate"
                  style={{
                    fontSize: 12,
                    color: 'var(--Netural-600, #90959A)',
                    marginRight: 12,
                    cursor: 'pointer',
                    maxWidth: 400,
                  }}
                >
                  {record.entranceUrl || record.serviceName}
                </div>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
  ];

  // 左边表格数据转换成右边表格格式
  const transformLeftDataToRight = (arr) => {
    return arr.map((x) => ({
      value: x.value,
      appName: x.appName,
      entranceUrl: x.entranceUrl || x.serviceName,
      entranceName: x.entranceName,
      method: x.method,
      rpcType: x.rpcType,
      extend: x.extend,
    }));
  };

  return (
    <div
      style={{
        display: 'flex',
      }}
      className={styles['link-filter']}
    >
      <div
        style={{
          flex: 1,
          border: '1px solid var(--Netural-300, #DBDFE3)',
          marginRight: 12,
          height: 540,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            应用：
            <Select
              placeholder="请选择"
              style={{ width: 210, marginRight: 24 }}
              allowClear
              onChange={(val) =>
                getList({
                  applicationName: val,
                  current: 0,
                })
              }
              showSearch
              filterOption={false}
              loading={appLoading}
              onSearch={debounce(
                (val) =>
                  getAppList({
                    applicationName: val,
                    current: 0,
                  }),
                300
              )}
            >
              {appList.map((x) => (
                <Select.Option key={x.value} value={x.value}>
                  {x.label}
                </Select.Option>
              ))}
            </Select>
            <Input.Search
              placeholder="搜索接口"
              style={{ width: 210 }}
              onSearch={(val) =>
                getList({
                  serviceName: val,
                  current: 0,
                })
              }
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Table
              size="small"
              showHeader={false}
              columns={leftColmuns}
              rowKey="value"
              loading={loading}
              dataSource={list}
              onRow={(record) => {
                return {
                  onClick: () => {
                    const val = Array.isArray(value) ? value : [];
                    const index = val.findIndex(
                      (x) => x.value === record.value
                    );
                    if (index > -1) {
                      val.splice(index, 1);
                    } else {
                      val.push(record);
                    }
                    if (onChange) {
                      onChange(transformLeftDataToRight(val));
                    }
                  },
                };
              }}
              pagination={false}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid var(--Netural-100, #EEF0F2)',
          }}
        >
          <Pagination
            simple
            current={query.current + 1}
            total={total}
            pageSize={query.pageSize}
            onChange={(current, pageSize) =>
              getList({ pageSize, current: current - 1 })
            }
            style={{ flex: 1 }}
          />
          <span style={{ lineHeight: 1 }}>
            总计: <b>{total || 0}</b> 条
          </span>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          border: '1px solid var(--Netural-300, #DBDFE3)',
          marginLeft: 12,
          height: 540,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 24,
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              paddingBottom: 24,
              color: 'var(--Netural-500, #AEB2B7)',
              fontSize: 16,
            }}
          >
            已选数据
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Table
              size="small"
              columns={rightColumns}
              rowKey="value"
              dataSource={(value || []).slice(
                (rightPage.current - 1) * rightPage.pageSize
              )}
              showHeader={false}
              pagination={false}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid var(--Netural-100, #EEF0F2)',
          }}
        >
          {/* 前端分页 */}
          <Pagination
            simple
            current={rightPage.current}
            total={Array.isArray(value) ? value.length : 0}
            pageSize={rightPage.pageSize}
            onChange={(current, pageSize) =>
              setRightPage({
                current,
                pageSize,
              })
            }
            style={{ flex: 1 }}
          />
          <span style={{ lineHeight: 1 }}>
            总计: <b>{Array.isArray(value) ? value.length : 0}</b> 条
          </span>
        </div>
      </div>
    </div>
  );
};
