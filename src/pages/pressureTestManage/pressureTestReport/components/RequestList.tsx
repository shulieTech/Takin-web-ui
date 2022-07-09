import React, { Fragment, useEffect } from 'react';
import Header from 'src/pages/linkMark/components/Header';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomTable from 'src/components/custom-table';
import { Tabs, Badge, Pagination, Tooltip, message } from 'antd';
import RequestDetailModal from '../modals/RequestDetailModal';
import { useStateReducer } from 'racc';
import PressureTestReportService from '../service';
import styles from './../index.less';
import AssertModal from 'src/pages/scriptManage/modals/AssertModal';
import copy from 'copy-to-clipboard';
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
  type: string;
}
const RequestList: React.FC<Props> = props => {
  const { TabPane } = Tabs;
  const { id } = props;
  const [state, setState] = useStateReducer<State>({
    searchParams: {
      current: 0,
      pageSize: 10
    },
    data: null,
    total: 0,
    loading: false,
    type: 'all'
  });

  useEffect(() => {
    queryRequestList({
      reportId: id,
      ...state.searchParams,
      type: state.type === 'all' ? null : state.type
    });
  }, [state.searchParams.current, state.searchParams.pageSize]);

  /**
   * @name 获取请求流量列表
   */
  const queryRequestList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await PressureTestReportService.queryRequestList({
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

  const handleChangeTab = value => {
    setState({
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      },
      type: value
    });

    queryRequestList({
      reportId: id,
      current: 0,
      pageSize: state.searchParams.pageSize,
      type: value === 'all' ? null : value
    });
  };

  const handleChangePage = async (current, pageSize) => {
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

  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };
  const getRequestListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '请求入口',
        dataIndex: 'interfaceName'
      },
      // {
      //   ...customColumnProps,
      //   title: '应用（IP）',
      //   dataIndex: 'applicationName'
      // },
      {
        ...customColumnProps,
        title: '结果',
        dataIndex: 'responseStatusDesc'
      },
      {
        ...customColumnProps,
        title: '请求体',
        dataIndex: 'requestBody',
        ellipsis: true,
        render: text => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(text)}>复制</a>
                  </div>
                  {text}
                </div>}
            >
              <span>{text}</span>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '响应体/异常',
        dataIndex: 'responseBody',
        ellipsis: true,
        render: text => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(text)}>复制</a>
                  </div>
                  {text}
                </div>}
            >
              <span>{text}</span>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '总耗时（ms）',
        dataIndex: 'totalRt'
      },
      {
        ...customColumnProps,
        title: '开始时间',
        dataIndex: 'startTime'
      },
      {
        ...customColumnProps,
        title: 'TraceID',
        dataIndex: 'traceId'
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <Fragment>
              <RequestDetailModal
                btnText="请求详情"
                traceId={row.traceId}
                totalRt={row.totalRt}
              />
              {row.responseStatus !== 0 && row.responseStatus !== 200 && (
                <span style={{ marginLeft: 8 }}>
                  <AssertModal
                    btnText="断言详情"
                    dataSource={row.assertDetailList}
                  />
                </span>
              )}
            </Fragment>
          );
        }
      }
    ];
  };

  return (
    <div className={styles.tabsBg}>
      <Tabs animated={false} defaultActiveKey="all" onChange={handleChangeTab}>
        <TabPane tab="全部" key="all">
          <CustomTable
            loading={state.loading}
            size="small"
            style={{ marginTop: 8 }}
            columns={getRequestListColumns()}
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
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </TabPane>
        <TabPane tab="响应失败" key="0">
          <CustomTable
            loading={state.loading}
            size="small"
            style={{ marginTop: 8 }}
            columns={getRequestListColumns()}
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
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </TabPane>
        <TabPane tab="断言失败" key="2">
          <CustomTable
            loading={state.loading}
            size="small"
            style={{ marginTop: 8 }}
            columns={getRequestListColumns()}
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
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default RequestList;
