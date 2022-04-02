import React, { useState, useEffect } from 'react';
import TreeTable from './TreeTable';
import { Select, Tooltip } from 'antd';
import ServiceCustomTable from 'src/components/service-custom-table';
import service from '../service';
import { Link } from 'umi';

const { Option } = Select;

interface Props {
  id: string | number;
  tabList?: any[];
}

const WaterLevel: React.FC<Props> = (props) => {
  const [defaultQuery, setDefaultQuery] = useState({
    sortKey: 'cpu',
    sortOrder: 'desc',
    current: 0,
    xpathMd5: props.tabList[0]?.xpathMd5,
  });

  const columns = [
    {
      title: '应用名称',
      dataIndex: 'applicationName',
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (text) => {
        return text.map((item, index) => {
          return <span key={index}>{item}</span>;
        });
      },
    },
    {
      title: '节点数',
      dataIndex: 'nodeCount',
      sorter: true,
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      sorter: true,
      sortOrder:
        defaultQuery.sortKey === 'cpu' && defaultQuery.sortOrder
          ? { desc: 'descend', asc: 'ascend' }[defaultQuery.sortOrder]
          : '',
    },
    {
      title: '内存',
      dataIndex: 'ram',
      sorter: true,
    },
    {
      title: '操作',
      render: (text, record) => {
        return <Link to={`/pressureTestManage/trendChart?`}>趋势图</Link>;
      },
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        border: '1px solid #F0F0F0',
        borderRadius: 4,
        padding: 16,
      }}
    >
      <div style={{ width: 320, borderRadius: 4, border: '1px solid #F8F8F8' }}>
        <TreeTable
          tableTreeData={props.tabList}
          selectedKey={defaultQuery.xpathMd5}
          onChange={(key, record) => {
            setDefaultQuery({
              ...defaultQuery,
              xpathMd5: key,
              current: 0,
            });
          }}
          extraColumns={[
            {
              width: 120,
              align: 'right',
              render: (text, record) => {
                return (
                  <Tooltip
                    placement="bottomLeft"
                    title={
                      <div>
                        调用总次数：{record.totalRequest || 0} <br />
                        平均RT：{record.avgRt?.result || 0}ms
                      </div>
                    }
                  >
                    <span
                      style={{
                        color: 'var(--Netural-700, #6F7479)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {record.totalRequest || 0} / {record.avgRt?.result || 0}ms
                    </span>
                  </Tooltip>
                );
              },
            },
          ]}
        />
      </div>
      <div style={{ flex: 1, padding: 16 }}>
        <div
          style={{
            fontSize: 14,
            marginBottom: 16,
            color: '#414548',
          }}
        >
          应用性能
        </div>
        <div>
          <Select
            placeholder="搜索应用"
            showSearch
            optionFilterProp="children"
            style={{ width: 240 }}
            allowClear
            onChange={(appId) => {
              setDefaultQuery({
                ...defaultQuery,
                appId,
                current: 0,
              });
            }}
          >
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
          </Select>
          <Select
            placeholder="选择标签"
            style={{ float: 'right', width: 150 }}
            allowClear
            onChange={(tag) => {
              setDefaultQuery({
                tag,
                current: 0,
              });
            }}
          >
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
          </Select>
        </div>
        <ServiceCustomTable
          size="small"
          service={service.queryWaterLevelList}
          defaultQuery={defaultQuery}
          columns={columns}
          onChange={(pagination, filters, sorter) => {
            setDefaultQuery({
              ...defaultQuery,
              sortKey: sorter.order ? sorter.columnKey : undefined,
              sortOrder: {
                ascend: 'asc',
                descend: 'desc',
              }[sorter.order],
            });
          }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default WaterLevel;
