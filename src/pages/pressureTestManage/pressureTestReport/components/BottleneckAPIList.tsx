import React, { Fragment, useEffect, useState, useRef } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Radio, Tooltip } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import TreeTable from './TreeTable';
import styles from '../index.less';
import ServiceCustomTable from 'src/components/service-custom-table';
import TimeCostChart from './TimeCostChart';
import CopyableTooltip from 'src/components/copyble-tooltip';
import { getSortConfig, getTableSortQuery } from 'src/utils/utils';

interface Props {
  id?: string;
  tabList?: any[];
  detailData?: any;
}

const BottleneckAPIList: React.FC<Props> = (props) => {
  const { id, tabList, detailData } = props;
  const tableRef = useRef();
  const [tableQuery, setTableQuery] = useState({
    reportId: id,
    xpathMd5: tabList?.[0]?.xpathMd5,
    current: 0,
    sortField: undefined,
    sortType: undefined,
    sceneId: detailData?.sceneId,
  });

  const [viewType, setViewType] = useState(1);

  const getBottleneckAPIListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '服务',
        dataIndex: 'serviceName',
        align: 'right',
        ellipsis: true,
        className: styles['direction-rtl'],
        render: (text, record) => {
          return (
            <CopyableTooltip
              title={
                <div style={{ maxWidth: 240, wordBreak: 'break-all' }}>
                  <div>服务：{text}</div>
                  <div>应用：{record.appName}</div>
                </div>}
              placement="bottomRight"
            >
              <span>
                <span style={{ color: 'var(--Netural-900, #303336)' }}>
                  {text}
                </span>
                <div
                  style={{ fontSize: 12, color: 'var(--Netural-700, #6F7479)' }}
                >
                  {record.appName}
                </div>
              </span>
            </CopyableTooltip>
          );
        },
      },
      {
        ...customColumnProps,
        title: '调用总次数',
        dataIndex: 'reqCnt',
        ...getSortConfig(tableQuery, 'reqCnt'),
      },
      {
        ...customColumnProps,
        title: '平均自耗时',
        dataIndex: 'avgCost',
        ...getSortConfig(tableQuery, 'avgCost'),
      },
      {
        ...customColumnProps,
        title: '最大耗时',
        dataIndex: 'maxCost',
        ...getSortConfig(tableQuery, 'maxCost'),
      },
      {
        ...customColumnProps,
        title: '平均耗时占比',
        dataIndex: 'costPercent',
        ...getSortConfig(tableQuery, 'costPercent'),
        render: (text) => {
          return <span>{text}ms</span>;
        },
      },
    ];
  };

  useEffect(() => {
    tableRef.current?.getList(tableQuery);
  }, [JSON.stringify(tableQuery)]);

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        {/* 业务活动树 */}
        <div className={styles.leftSelected}>
          <TreeTable
            tableTreeData={tabList}
            selectedKey={tableQuery.xpathMd5}
            onChange={(key, record) => {
              setTableQuery({
                ...tableQuery,
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
                        {record.totalRequest || 0} / {record.avgRt?.result || 0}
                      </span>
                    </Tooltip>
                  );
                },
              },
            ]}
          />
        </div>
        <div
          className={styles.riskMachineList}
          style={{ position: 'relative', padding: 16 }}
        >
          <Radio.Group
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <Radio.Button value={1}>性能详情</Radio.Button>
            <Radio.Button value={2}>自耗时占比</Radio.Button>
          </Radio.Group>

          {viewType === 1 && (
            <ServiceCustomTable
              ref={tableRef}
              isQueryOnMount={false}
              service={PressureTestReportService.performanceInterfaceList}
              defaultQuery={tableQuery}
              columns={getBottleneckAPIListColumns()}
              onChange={(pagination, filters, sorter) => {
                setTableQuery({
                  ...tableQuery,
                  ...getTableSortQuery(sorter),
                });
              }}
            />
          )}
          {viewType === 2 && <TimeCostChart defaultQuery={tableQuery}/>}
        </div>
      </div>
    </Fragment>
  );
};
export default BottleneckAPIList;
