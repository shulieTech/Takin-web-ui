/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Button, Col, Collapse, Icon, Input, Row } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import PressureTestReportService from '../service';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
interface Props {
  id?: string;
  isReload?: boolean;
}

interface State {
  data: any[];
}
const MockDetailLive: React.FC<Props> = props => {
  const { id } = props;
  const [state, setState] = useStateReducer<State>({
    data: null,
  });
  useEffect(() => {
    queryMockDetailList({ reportId: id, current: 0, pageSize: 200 });
  }, [props.isReload]);

  /**
   * @name 获取Mock详情列表
   */
  const queryMockDetailList = async value => {
    const {
      data: { success, data }
    } = await PressureTestReportService.queryMockDetailList({
      ...value
    });
    if (success) {
      setState({
        data
      });
    }
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

  return (
    <Fragment>
       <CustomTable
        rowKey={(row, index) => index.toString()}
        columns={getColumns()}
        size="small"
        dataSource={state.data ? state.data : []}
       />
    </Fragment>
  );
};
export default MockDetailLive;
