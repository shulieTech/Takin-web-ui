/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import { useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Pagination } from 'antd';
interface Props {
  id?: string;
}
interface State {
  searchParams: {
    current: number;
    pageSize: number;
  };
  data: any;
  total: number;
  loading: boolean;
}
const MockDetailList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    searchParams: {
      current: 0,
      pageSize: 10
    },
    data: null,
    total: 0,
    loading: false
  });

  useEffect(() => {
    const { id } = props;
    queryMockDetailList({ reportId: id, ...state.searchParams });
  }, [state.searchParams, state.searchParams.pageSize]);

  /**
   * @name 获取Mock详情列表
   */
  const queryMockDetailList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await PressureTestReportService.queryMockDetailList({
      ...value
    });
    if (success) {
      setState({
        data,
        total
      });
    }
    setState({
      loading: false
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'mock名称',
        dataIndex: 'mockName'
      },
      {
        ...customColumnProps,
        title: '分类',
        dataIndex: 'mockType'
      },
      {
        ...customColumnProps,
        title: '应用',
        dataIndex: 'appName'
      },
      {
        ...customColumnProps,
        title: '调用次数（失败/成功）',
        dataIndex: 'failureCount',
        render: (text, record) => {
          return <span>{`${text}/${record?.successCount}`}</span>;
        }
      },
      {
        ...customColumnProps,
        title: '状态',
        dataIndex: 'mockStatus'
      },
    ];
  };

  const handleChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
  };
  return (
    <Fragment>
      <CustomTable
        loading={state.loading}
        rowKey={(row, index) => index.toString()}
        columns={getColumns()}
        size="small"
        dataSource={state.data ? state.data : []}
      />
      <Pagination
        style={{ marginTop: 20, textAlign: 'right' }}
        total={state.total}
        current={state.searchParams.current + 1}
        pageSize={state.searchParams.pageSize}
        showTotal={(t, range) =>
          `共 ${state.total} 条数据 第${state.searchParams.current +
            1}页 / 共 ${Math.ceil(
            state.total / (state.searchParams.pageSize || 10)
          )}页`
        }
        showSizeChanger={true}
        onChange={(current, pageSize) => handleChange(current, pageSize)}
        onShowSizeChange={handlePageSizeChange}
      />
    </Fragment>
  );
};
export default MockDetailList;
