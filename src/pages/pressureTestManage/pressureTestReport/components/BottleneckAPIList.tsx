import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Radio, Tooltip } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import TreeTable from './TreeTable';
import styles from '../index.less';
import ServiceCustomTable from 'src/components/service-custom-table';
import TimeCostChart from './TimeCostChart';
import CopyableTooltip from 'src/components/copyble-tooltip';

interface Props {
  id?: string;
  tabList?: any[];
}

const BottleneckAPIList: React.FC<Props> = (props) => {
  const { id, tabList } = props;
  const [tableQuery, setTableQuery] = useState({
    reportId: id,
    xpathMd5: tabList?.[0]?.xpathMd5,
    current: 0,
    sorter: undefined,
    order: undefined,
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
                  <div>
                    服务：/provider/conver#convertAndSend3/provider/conver#convertAndSend3/provider/conver#convertAndSend3
                  </div>
                  <div>应用：mall-monitor-1.0-SNAPSHOT</div>
                </div>}
              placement="bottomRight"
            >
              <span>
                <span style={{ color: 'var(--Netural-900, #303336)' }}>
                  /provider/conver#convertAndSend3/provider/conver#convertAndSend3/provider/conver#convertAndSend3
                </span>
                <div
                  style={{ fontSize: 12, color: 'var(--Netural-700, #6F7479)' }}
                >
                  mall-monitor-1.0-SNAPSHOT
                </div>
              </span>
            </CopyableTooltip>
          );
        },
      },
      {
        ...customColumnProps,
        title: '调用总次数',
        dataIndex: 'applicationName',
        sorter: true,
      },
      {
        ...customColumnProps,
        title: '平均自耗时',
        dataIndex: 'interfaceName',
        sorter: true,
      },
      {
        ...customColumnProps,
        title: '最大耗时',
        dataIndex: 'tps',
        sorter: true,
      },
      {
        ...customColumnProps,
        title: '平均耗时占比',
        dataIndex: 'rt',
        sorter: true,
        render: (text) => {
          return <span>{text}ms</span>;
        },
      },
    ];
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        {/* 业务活动树 */}
        <div className={styles.leftSelected}>
          <TreeTable
            service={PressureTestReportService.queryBusinessActivityTree}
            defaultQuery={{
              reportId: id,
            }}
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
                dataIndex: 'num',
                width: 100,
                align: 'right',
                render: (text) => {
                  return (
                    <span
                      style={{
                        color: 'var(--Netural-700, #6F7479)',
                      }}
                    >
                      {text || '3000/1112'}
                    </span>
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
              service={PressureTestReportService.queryBottleneckAPIList}
              defaultQuery={tableQuery}
              columns={getBottleneckAPIListColumns()}
              onChange={(pagination, filters, sorter) => {
                setTableQuery({
                  ...tableQuery,
                  current: 0,
                  sorter: sorter.order ? sorter.field : undefined,
                  order: sorter.order,
                });
              }}
              pagination={false}
            />
          )}
          {viewType === 2 && <TimeCostChart />}
        </div>
      </div>
    </Fragment>
  );
};
export default BottleneckAPIList;
