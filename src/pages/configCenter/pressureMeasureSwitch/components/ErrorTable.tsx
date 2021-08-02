import React, { Fragment } from 'react';
import { CommonTable } from 'racc';
import { Pagination } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import Header from 'src/common/header/Header';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const ErrorTable: React.FC<Props> = props => {
  const { state, setState } = props;

  const getErrorListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '应用名称',
        dataIndex: 'applicationName'
      },
      {
        ...customColumnProps,
        title: '异常描述',
        dataIndex: 'exceptionInfo'
      }
    ];
  };

  const handleChange = (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current
      }
    });
  };

  return (
    <Fragment>
      <Header title="问题列表" />
      <CommonTable
        style={{ marginTop: 10 }}
        rowKey="middleWareId"
        columns={getErrorListColumns()}
        size="small"
        dataSource={state.dataSource}
        pageProps={{
          total: state.dataSource && state.dataSource.length,
          current: state.searchParams.current
        }}
        onPageChange={(current, pageSize) => handleChange(current, pageSize)}
      />
    </Fragment>
  );
};
export default ErrorTable;
