import React, { Fragment } from 'react';
import TableTitle from 'src/common/table-title/TableTitle';
import { Divider } from 'antd';
import styles from './../index.less';
import CustomTable from 'src/components/custom-table';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
interface Props {
  dataSource?: any;
}
const FlowAccountTable: React.FC<Props> = props => {
  const { dataSource } = props;
  const getFlowAccountColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '更新时间',
        dataIndex: 'gmtCreate'
      },
      {
        ...customColumnProps,
        title: '更新结果',
        dataIndex: 'flowAmount',
        render: (text, row) => {
          return (
            <span style={{ color: row.sceneCode === '充值' ? '#11BBD5' : '' }}>
              {text}
            </span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '当前剩余流量（vum）',
        dataIndex: 'leftAmount'
      },
      {
        ...customColumnProps,
        title: '类型',
        dataIndex: 'sceneCode'
      },
      {
        ...customColumnProps,
        title: '备注',
        dataIndex: 'remark'
      }
    ];
  };
  return (
    <div style={{ marginTop: 30 }}>
      <TableTitle title="流量记录" />
      <div className={styles.line}>
        <Divider />
      </div>
      <CustomTable dataSource={dataSource} columns={getFlowAccountColumns()} />
    </div>
  );
};
export default FlowAccountTable;
