import React, { Fragment } from 'react';
import Header from 'src/pages/linkMark/components/Header';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomTable from 'src/components/custom-table';
interface Props {
  dataSource: any[];
  id?: string;
}
const WarningList: React.FC<Props> = props => {
  const { dataSource } = props;
  const getWarningListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'SLA名称',
        dataIndex: 'slaName'
      },
      {
        ...customColumnProps,
        title: '警告对象',
        dataIndex: 'businessActivityName'
      },
      {
        ...customColumnProps,
        title: '警告次数',
        dataIndex: 'total'
      },
      {
        ...customColumnProps,
        title: '规则明细',
        dataIndex: 'content'
      },
      {
        ...customColumnProps,
        title: '最新警告时间',
        dataIndex: 'lastWarnTime'
      }
    ];
  };
  return (
    <div style={{ marginBottom: 24 }}>
      <CustomTable
        size="small"
        style={{ marginTop: 8 }}
        columns={getWarningListColumns()}
        dataSource={dataSource}
      />
    </div>
  );
};
export default WarningList;
