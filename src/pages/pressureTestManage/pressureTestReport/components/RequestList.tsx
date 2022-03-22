import React, { Fragment, useEffect } from 'react';
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
import RequestFlowQueryForm from './RequestFlowQueryForm';
import moment from 'moment';
import BusinessActivityTree from './BusinessActivityTree';

interface Props {
  id?: string;
  detailData?: any;
  tabList?: any;
}
interface State {
  searchParams: {
    current: number;
    pageSize: number;
    sortField?: string;
    sortType?: 'desc' | 'asc';
    startTime?: number;
    endTime?: number;
  };
  data: any;
  total: number;
  loading: boolean;
  type: string;
}
const RequestList: React.FC<Props> = (props) => {
  // const { TabPane } = Tabs;
  const { id } = props;
  const [state, setState] = useStateReducer<State>({
    searchParams: {
      current: 0,
      pageSize: 10,
      sortField: undefined,
      sortType: undefined,
      startTime: moment(props.detailData?.startTime).valueOf(),
      endTime: moment(props.detailData?.endTime).valueOf(),
    },
    data: null,
    total: 0,
    loading: false,
    type: 'all',
  });

  useEffect(() => {
    queryRequestList({
      reportId: id,
      ...state.searchParams,
      type: state.type === 'all' ? null : state.type,
    });
  }, []);

  /**
   * @name 获取请求流量列表
   */
  const queryRequestList = async (value) => {
    const newSearchParams = {
      ...state.searchParams,
      ...value,
      reportId: id,
    };
    setState({
      loading: true,
      searchParams: newSearchParams,
    });
    const {
      total,
      data: { success, data },
    } = await PressureTestReportService.queryRequestList(newSearchParams);
    if (success) {
      setState({
        data,
        total,
      });
    }
    setState({
      loading: false,
    });
  };

  // const handleChangeTab = value => {
  //   setState({
  //     searchParams: {
  //       pageSize: state.searchParams.pageSize,
  //       current: 0
  //     },
  //     type: value
  //   });

  //   queryRequestList({
  //     reportId: id,
  //     current: 0,
  //     pageSize: state.searchParams.pageSize,
  //     type: value === 'all' ? null : value
  //   });
  // };

  const handleCopy = async (value) => {
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
        dataIndex: 'interfaceName',
      },
      // {
      //   ...customColumnProps,
      //   title: '应用（IP）',
      //   dataIndex: 'applicationName'
      // },
      {
        ...customColumnProps,
        title: '结果',
        dataIndex: 'responseStatusDesc',
      },
      {
        ...customColumnProps,
        title: '请求体',
        dataIndex: 'requestBody',
        ellipsis: true,
        render: (text) => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'scroll' }}>
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
        },
      },
      {
        ...customColumnProps,
        title: '响应体/异常',
        dataIndex: 'responseBody',
        ellipsis: true,
        render: (text) => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'scroll' }}>
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
        },
      },
      {
        ...customColumnProps,
        title: '总耗时（ms）',
        dataIndex: 'totalRt',
        sorter: true,
        sortOrder:
          state?.searchParams?.sortField === 'cost' &&
          state?.searchParams?.sortType
            ? `${state?.searchParams?.sortType}end`
            : false,
      },
      {
        ...customColumnProps,
        title: '开始时间',
        dataIndex: 'startTime',
        sorter: true,
        sortOrder:
          state?.searchParams?.sortField === 'startDate' &&
          state?.searchParams?.sortType
            ? `${state?.searchParams?.sortType}end`
            : false,
      },
      {
        ...customColumnProps,
        title: 'TraceID',
        dataIndex: 'traceId',
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
        },
      },
    ];
  };

  return (
    <div className={styles.tabsBg}>
      <div
        style={{
          display: 'flex',
          marginTop: 16,
        }}
      >
        <div className={styles.leftSelected}>
          <BusinessActivityTree
            tabList={props.tabList}
            // defaultSelectedKey={state.tabKey}
            checkNodeDisabled={(node) => !node.identification}
            onChange={(key, e) => {
              let result = {
                serviceName: undefined,
                methodName: undefined,
              };
              if (e.selected) {
                const [methodName, serviceName] =
                  e?.node?.props?.dataRef?.identification?.split('|') || [];
                result = {
                  methodName,
                  serviceName: encodeURIComponent(serviceName),
                };
              }
              queryRequestList(result);
              // setState({
              //   searchParams: {
              //     ...state.searchParams,
              //     ...result,
              //   },
              // });
            }}
          />
        </div>
        <div
          className={styles.riskMachineList}
          style={{ position: 'relative', paddingLeft: 16 }}
        >
          <RequestFlowQueryForm
            reportId={id}
            defaultQuery={{
              timeRange:
                props.detailData?.startTime && props.detailData?.endTime
                  ? [
                    moment(props.detailData?.startTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                      ),
                    moment(props.detailData?.endTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                      ),
                  ]
                  : undefined,
            }}
            onSubmit={(values) => {
              if (
                values.startTime &&
                values.endTime &&
                props.detailData?.startTime &&
                props.detailData?.endTime &&
                (moment(values.startTime).valueOf() <
                  moment(props.detailData?.startTime).valueOf() ||
                  moment(values.endTime).valueOf() >
                    moment(props.detailData?.endTime).valueOf())
              ) {
                message.warn('只能选择在测试报告时间范围内的时间');
                return;
              }
              queryRequestList({
                ...values,
                current: 0,
              });
            }}
          />
          <CustomTable
            loading={state.loading}
            size="small"
            style={{ marginTop: 8 }}
            columns={getRequestListColumns()}
            dataSource={state.data ? state.data : []}
            onChange={(pagination, filters, sorter) => {
              const sortKeyMap = {
                totalRt: 'cost',
                startTime: 'startDate',
              };
              const sortOrderMap = {
                ascend: 'asc',
                descend: 'desc',
              };
              queryRequestList({
                current: 0,
                sortField:
                  sorter.columnKey && sorter.order
                    ? sortKeyMap[sorter.columnKey]
                    : undefined,
                sortType:
                  sorter.columnKey && sorter.order
                    ? sortOrderMap[sorter.order]
                    : undefined,
              });
            }}
          />
          <Pagination
            style={{ marginTop: 20, textAlign: 'right' }}
            total={state.total}
            current={state.searchParams.current + 1}
            pageSize={state.searchParams.pageSize}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${
                state.searchParams.current + 1
              }页 / 共 ${Math.ceil(
                state.total / (state.searchParams.pageSize || 10)
              )}页`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              queryRequestList({ pageSize, current: current - 1 })
            }
            onShowSizeChange={(current, pageSize) =>
              queryRequestList({ pageSize, current: 0 })
            }
          />
        </div>
      </div>
      {/* <Tabs animated={false} defaultActiveKey="all" onChange={handleChangeTab}>
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
      </Tabs> */}
    </div>
  );
};
export default RequestList;
