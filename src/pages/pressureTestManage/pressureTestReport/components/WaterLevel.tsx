import React, { useState, useEffect, useRef } from 'react';
import TreeTable from './TreeTable';
import { Select, Tooltip, Tag, Dropdown, Button, Icon } from 'antd';
import ServiceCustomTable from 'src/components/service-custom-table';
import service from '../service';
import { Link } from 'umi';
import useListService from 'src/utils/useListService';
import moment from 'moment';

const { Option } = Select;

interface Props {
  detailData: any;
  reportId: string | number;
  tabList?: any[];
}

const WaterLevel: React.FC<Props> = (props) => {
  const { detailData, reportId, tabList } = props;
  const { sceneId } = detailData || {};
  const tableRef = useRef();

  const [tableQuery, setTableQuery] = useState({
    sceneId,
    reportId,
    startTime: detailData?.startTime,
    sortKey: 'cpuRate',
    sortOrder: 'desc',
    current: 0,
    xpathMd5: props.tabList[0]?.xpathMd5,
    tagName: undefined,
    applicationName: undefined,
  });

  const { list: appList, getList: getAppList } = useListService({
    service: service.getAllApplicationsWithSceneId,
    isQueryOnMount: false,
  });

  const { list: tagList, getList: getTagList } = useListService({
    service: service.getApplicationTags,
    defaultQuery: {
      sceneId,
    },
    isQueryOnMount: false,
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
        return Array.isArray(text) && text.length > 0 ? (
          <>
            <Tooltip title={text[0]}>
              <Tag
                style={{
                  maxWidth: 60,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  verticalAlign: 'middle',
                }}
              >
                {text[0]}
              </Tag>
            </Tooltip>
            {text.length > 1 && (
              <Dropdown
                overlay={
                  <div
                    style={{
                      background: '#fff',
                      padding: 8,
                      width: 200,
                      boxShadow: '0 0 8px rgba(0,0,0,.15)',
                    }}
                  >
                    {text.slice(1).map((item, i, arr) => (
                      <div
                        key={item}
                        style={{
                          lineHeight: '32px',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          borderBottom:
                            i < arr.length - 1 ? '1px solid #eee' : 'none',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                }
              >
                <Button
                  size="small"
                  style={{
                    lineHeight: '20px',
                    height: 22,
                    verticalAlign: 'middle',
                  }}
                >
                  <Icon type="down" />
                </Button>
              </Dropdown>
            )}
          </>
        ) : (
          '-'
        );
      },
    },
    {
      title: '节点数',
      dataIndex: 'nodesNumber',
      sorter: true,
      sortOrder:
        tableQuery.sortKey === 'nodesNumber' && tableQuery.sortOrder
          ? { desc: 'descend', asc: 'ascend' }[tableQuery.sortOrder]
          : '',
    },
    {
      title: 'CPU',
      dataIndex: 'cpuRate',
      sorter: true,
      sortOrder:
        tableQuery.sortKey === 'cpuRate' && tableQuery.sortOrder
          ? { desc: 'descend', asc: 'ascend' }[tableQuery.sortOrder]
          : '',
    },
    {
      title: '内存',
      dataIndex: 'memory',
      sorter: true,
      sortOrder:
        tableQuery.sortKey === 'memory' && tableQuery.sortOrder
          ? { desc: 'descend', asc: 'ascend' }[tableQuery.sortOrder]
          : '',
    },
    {
      title: '操作',
      render: (text, record) => {
        let trendLinkUrl = `/pressureTestManage/trendChart?sceneId=${sceneId}&reportId=${reportId}&xpathMd5=${tableQuery.xpathMd5}&applicationName=${record.applicationName}&startTime=${detailData.startTime}`;
        if (detailData.endTime) {
          trendLinkUrl += `&endTime=${moment(detailData.endTime || '').format(
            'YYYY-MM-DD HH:mm:ss'
          )}`;
        }
        return (
          <Link target="_blank" to={trendLinkUrl}>
            趋势图
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    // 获取应用列表
    if (sceneId) {
      getAppList({
        reportId,
        sceneId,
        xpathMd5: tableQuery.xpathMd5,
      });
    }
  }, [sceneId, tableQuery.xpathMd5]);

  useEffect(() => {
    // 获取标签列表
    if (sceneId) {
      getTagList({
        sceneId,
      });
    }
  }, [sceneId]);

  useEffect(() => {
    // 获取表格数据
    if (tableRef.current && tableQuery.sceneId) {
      tableRef.current?.getList(tableQuery);
    }
  }, [JSON.stringify(tableQuery)]);

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
          tableTreeData={tabList}
          selectedKey={tableQuery.xpathMd5}
          onChange={(key, record) => {
            setTableQuery({
              ...tableQuery,
              xpathMd5: key,
              current: 0,
              applicationName: undefined,
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
            value={tableQuery.applicationName}
            onChange={(applicationName) => {
              setTableQuery({
                ...tableQuery,
                applicationName,
                current: 0,
              });
            }}
          >
            {appList.map((x) => (
              <Option key={x} value={x}>
                {x}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="选择标签"
            style={{ float: 'right', width: 150 }}
            allowClear
            value={tableQuery.tagName}
            onChange={(tagName) => {
              setTableQuery({
                ...tableQuery,
                tagName,
                current: 0,
              });
            }}
          >
            {tagList.map((x) => (
              <Option key={x} value={x}>
                {x}
              </Option>
            ))}
          </Select>
        </div>
        <ServiceCustomTable
          ref={tableRef}
          isQueryOnMount={false}
          size="small"
          service={service.getAllApplicationWithMetrics}
          tableQuery={tableQuery}
          columns={columns}
          onChange={(pagination, filters, sorter) => {
            setTableQuery({
              ...tableQuery,
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
