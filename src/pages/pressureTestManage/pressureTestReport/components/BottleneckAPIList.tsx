import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import BusinessActivityTree from './BusinessActivityTree';
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
    // tabelKey: tabList?.[0]?.xpathMd5,
  });

  const getBottleneckAPIListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '排名',
        dataIndex: 'rank',
      },
      {
        ...customColumnProps,
        title: '应用',
        dataIndex: 'applicationName',
      },
      {
        ...customColumnProps,
        title: '接口',
        dataIndex: 'interfaceName',
      },
      {
        ...customColumnProps,
        title: 'TPS',
        dataIndex: 'tps',
      },
      {
        ...customColumnProps,
        title: 'RT',
        dataIndex: 'rt',
        render: (text) => {
          return <span>{text}ms</span>;
        },
      },
      {
        ...customColumnProps,
        title: '成功率',
        dataIndex: 'successRate',
        render: (text) => {
          return <span>{text}%</span>;
        },
      },
    ];
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        {/* TODO 业务活动树 */}
        {/* <div className={styles.leftSelected}>
          <BusinessActivityTree
            tabList={props.tabList}
            onChange={val => setTableQuery({tabelKey: val})}
          />
        </div> */}
        <div
          className={styles.riskMachineList}
          style={{ position: 'relative' }}
        >
          <ServiceCustomTable
            service={PressureTestReportService.queryBottleneckAPIList}
            defaultQuery={tableQuery}
            columns={getBottleneckAPIListColumns()}
          />
        </div>
      </div>
    </Fragment>
  );
};
export default BottleneckAPIList;
