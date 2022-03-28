import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Radio } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import TreeTable from './TreeTable';
import styles from '../index.less';
import ServiceCustomTable from 'src/components/service-custom-table';

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
        render: (text, record) => {
          return (
            <div>
              <div>
                /provider/conver#convertAndSend3/provider/conver#convertAndSend3/provider/conver#convertAndSend3
              </div>
              <div>mall-monitor-1.0-SNAPSHOT</div>
            </div>
          );
        },
      },
      {
        ...customColumnProps,
        title: '调用总次数',
        dataIndex: 'applicationName',
      },
      {
        ...customColumnProps,
        title: '平均自耗时',
        dataIndex: 'interfaceName',
      },
      {
        ...customColumnProps,
        title: '最大耗时',
        dataIndex: 'tps',
      },
      {
        ...customColumnProps,
        title: '平均耗时占比',
        dataIndex: 'rt',
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
              dataSource={[{ serviceName: 'aaaa' }]}
              defaultQuery={tableQuery}
              columns={getBottleneckAPIListColumns()}
            />
          )}
          {viewType === 2 && <div />}
        </div>
      </div>
    </Fragment>
  );
};
export default BottleneckAPIList;
