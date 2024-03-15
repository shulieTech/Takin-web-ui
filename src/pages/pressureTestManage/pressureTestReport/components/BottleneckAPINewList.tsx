import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import BusinessActivityTree from './BusinessActivityTree';
import styles from '../index.less';
import ServiceCustomTable from 'src/components/service-custom-table';

interface Props {
  id?: string;
  sceneId?: string;
  tabList?: any[];
}

const BottleneckAPINewList: React.FC<Props> = (props) => {
  const { id, tabList, sceneId } = props;
  const [tableQuery, setTableQuery] = useState({
    reportId: id,
    
    // tabelKey: tabList?.[0]?.xpathMd5,
  });

  const getBottleneckAPIListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '业务活动名称',
        dataIndex: 'activityName',
      },
      {
        ...customColumnProps,
        title: '请求路径',
        dataIndex: 'serviceName',
      },
      {
        ...customColumnProps,
        title: '业务活动平均rt',
        dataIndex: 'rt',
      },
      {
        ...customColumnProps,
        title: '业务活动成功率',
        dataIndex: 'successRate',
        render: (text) => {
          return <span>{text}%</span>;
        },
      },
      {
        ...customColumnProps,
        title: '存在问题节点',
        dataIndex: 'rt',
        render: (text) => {
          return <span>{text}ms</span>;
        },
      },
      {
        ...customColumnProps,
        title: '问题节点rt',
        dataIndex: 'successRate',
       
      },
      {
        ...customColumnProps,
        title: '基线rt',
        dataIndex: 'baseRt',
      },
      {
        ...customColumnProps,
        title: '节点成功率',
        dataIndex: 'baseSuccessRate',
        render: (text) => {
          return <span>{text}%</span>;
        },
      },
      {
        ...customColumnProps,
        title: '节点问题原因',
        dataIndex: 'reason',
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'tps',
        
      },
    ];
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <div
          className={styles.riskMachineList}
          style={{ position: 'relative' }}
        >
          <ServiceCustomTable
            service={PressureTestReportService.queryBottleneckAPINewList}
            defaultQuery={tableQuery}
            columns={getBottleneckAPIListColumns()}
            pagination={false}
          />
        </div>
      </div>
    </Fragment>
  );
};
export default BottleneckAPINewList;
