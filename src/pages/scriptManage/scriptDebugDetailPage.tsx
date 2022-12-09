/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Icon, message, Pagination, Tabs, Tooltip } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps } from 'antd/lib/table';
import { CommonForm, CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment, useEffect } from 'react';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { BasePageLayout } from 'src/components/page-layout';
import MissingDataListModal from '../pressureTestManage/pressureTestReport/modals/MissingDataListModal';
import AssertModal from './modals/AssertModal';
import ScriptManageService from './service';
import copy from 'copy-to-clipboard';
import RequestDetailModal from '../pressureTestManage/pressureTestReport/modals/RequestDetailModal';
interface Props {
  location?: { query?: any };
}
const getInitState = () => ({
  form: null as WrappedFormUtils,
  searchValues: {
    pageSize: 10,
    current: 0,
    businessActivityId: undefined,
    type: null
  },

  list: null,
  detail: {} as any,
  resFailTotal: 0,
  assertFailTotal: 0,
  total: 0,
  loading: false
});

export type State = ReturnType<typeof getInitState>;
const scriptDebugDetail: React.FC<Props> = props => {
  const { location } = props;
  const { query } = location;
  const { id, reportId, tabKey, action } = query;
  const [state, setState] = useStateReducer<State>(getInitState());
  useEffect(() => {
    queryScriptDebugDetail();
  }, []);

  useEffect(() => {
    queryScriptDebugList(state.searchValues);
  }, [state.searchValues]);

  useEffect(() => {
    queryResFailTotal(state.searchValues);
    queryAssertFailTotal(state.searchValues);
  }, [state.searchValues.businessActivityId]);

  const getFormData = (): FormDataType[] => {
    const { detail } = state;

    return [
      {
        key: 'businessActivityId',
        label: '',
        node: (
          <CommonSelect
            placeholder="请搜索业务活动"
            dataSource={(detail && detail.businessActivities) || []}
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          />
        )
      }
    ];
  };
  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '入口',
        dataIndex: 'entry',
        ellipsis: true
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
        title: '响应体',
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
        title: '结果',
        dataIndex: 'responseStatusDesc'
      },
      {
        ...customColumnProps,
        title: '请求时间',
        dataIndex: 'requestAt'
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          if (row.responseStatus !== 0) {
            return (
              <Fragment>
                <AssertModal btnText="详情" dataSource={row.assertDetailList} />
                <span style={{ marginLeft: 8 }}>
                <RequestDetailModal
                  btnText="请求详情"
                  traceId={row.traceId}
                  totalRt={row.totalRt}
                />
                </span>
               
              </Fragment>
             
            );
          }
          return '-';
        }
      }
    ];
  };

  const handleChangePage = (current, pageSize) => {
    setState({
      searchValues: {
        ...state.searchValues,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchValues: {
        ...state.searchValues,
        pageSize,
        current: 0
      }
    });
  };

  const tabs = [
    {
      title: '全部',
      key: '',
      node: (
        <Fragment>
          <CustomTable
            loading={state.loading}
            rowKey={(row, index) => index.toString()}
            columns={getColumns()}
            dataSource={state.list || []}
          />
          <Pagination
            style={{ display: 'inline-block', float: 'right', marginTop: 10 }}
            total={state.total}
            current={state.searchValues.current + 1}
            pageSize={state.searchValues.pageSize}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${state.searchValues.current +
                1}页 / 共 ${Math.ceil(
                state.total / (state.searchValues.pageSize || 10)
              )}页`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </Fragment>
      )
    },
    {
      title: '响应失败',
      key: '2',
      node: (
        <Fragment>
          <CustomTable
            loading={state.loading}
            rowKey={(row, index) => index.toString()}
            columns={getColumns()}
            dataSource={state.list || []}
          />
          <Pagination
            style={{ display: 'inline-block', float: 'right', marginTop: 10 }}
            total={state.total}
            current={state.searchValues.current + 1}
            pageSize={state.searchValues.pageSize}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${state.searchValues.current +
                1}页 / 共 ${Math.ceil(
                state.total / (state.searchValues.pageSize || 10)
              )}页`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </Fragment>
      )
    },
    {
      title: '断言失败',
      key: '3',
      node: (
        <Fragment>
          <CustomTable
            loading={state.loading}
            rowKey={(row, index) => index.toString()}
            columns={getColumns()}
            dataSource={state.list || []}
          />
          <Pagination
            style={{ display: 'inline-block', float: 'right', marginTop: 10 }}
            total={state.total}
            current={state.searchValues.current + 1}
            pageSize={state.searchValues.pageSize}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${state.searchValues.current +
                1}页 / 共 ${Math.ceil(
                state.total / (state.searchValues.pageSize || 10)
              )}页`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </Fragment>
      )
    }
  ];

  /**
   * @name 获取调试详情
   */
  const queryScriptDebugDetail = async () => {
    const {
      data: { success, data }
    } = await ScriptManageService.queryScriptDebugDetail({ scriptDebugId: id });
    if (success) {
      setState({
        detail: data
      });
    }
  };

  /**
   * @name 获取所有调试详情列表
   */
  const queryScriptDebugList = async searchValues => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await ScriptManageService.queryDebugScriptList({
      ...searchValues,
      scriptDebugId: id
    });
    if (success) {
      setState({
        total,
        list: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取响应失败total
   */
  const queryResFailTotal = async searchValues => {
    const {
      total,
      data: { success }
    } = await ScriptManageService.queryDebugScriptList({
      ...searchValues,
      scriptDebugId: id,
      type: 2
    });
    if (success) {
      setState({
        resFailTotal: total
      });
    }
  };

  /**
   * @name 获取断言失败total
   */
  const queryAssertFailTotal = async searchValues => {
    const {
      total,
      data: { success }
    } = await ScriptManageService.queryDebugScriptList({
      ...searchValues,
      scriptDebugId: id,
      type: 3
    });
    if (success) {
      setState({
        assertFailTotal: total
      });
    }
  };

  const handleSearch = () => {
    state.form.validateFields(async (err, values) => {
      setState({
        searchValues: { ...state.searchValues, ...values }
      });
    });
  };

  /**
   * @name 重置
   */
  const handleReset = () => {
    state.form.validateFields(async (err, values) => {
      setState({ searchValues: { ...state.searchValues, ...values } });
    });
  };

  const handleChange = value => {
    setState({
      searchValues: {
        ...state.searchValues,
        current: 0,
        type: value === 1 ? null : value
      }
    });
  };

  return (
    <BasePageLayout
      title={
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: 20 }}>脚本调试详情</span>
          {state.detail.leakStatus === 0 && (
            <span
              style={{
                display: 'inline-block',
                color: '#666666',
                padding: '6px 8px',
                background: '#F2F2F2',
                borderRadius: '4px',
                float: 'right'
              }}
            >
              <Icon type="exclamation-circle" />
              <span style={{ marginRight: 16, marginLeft: 8 }}>无漏数</span>
              <MissingDataListModal
                reportId={state.detail && state.detail.cloudReportId}
                hasMissingData={0}
                btnText="查看详情"
              />
            </span>
          )}
        </div>}
    >
      {state.detail && state.detail.leakStatus === 1 && (
        <div style={{ padding: '16px 0px', position: 'relative' }}>
          <Alert
            message={<p>本次压测存在数据泄露，请尽快确认 </p>}
            type="error"
            showIcon
          />
          <div style={{ position: 'absolute', top: 25, left: 250 }}>
            <MissingDataListModal
              reportId={state.detail && state.detail.cloudReportId}
              hasMissingData={1}
              btnText="查看详情"
            />
          </div>
        </div>
      )}
      {
        <div style={{ padding: '16px 0px', position: 'relative' }}>
          {((state.detail && state.detail.leakStatus === 2) ||
            state.detail.leakStatus === 3) && (
            <Alert
              message={<p>数据验证存在执行异常，请尽快查看 </p>}
              type="warning"
              showIcon
            />
          )}
          {((state.detail && state.detail.leakStatus === 2) ||
            state.detail.leakStatus === 3) && (
            <div style={{ position: 'absolute', top: 25, left: 250 }}>
              <MissingDataListModal
                reportId={state.detail && state.detail.cloudReportId}
                hasMissingData={1}
                btnText="查看详情"
              />
            </div>
          )}
          <CommonForm
            getForm={form => setState({ form })}
            formData={getFormData()}
            rowNum={4}
            onSubmit={handleSearch}
            onReset={handleReset}
          />
          <Tabs defaultActiveKey="" onChange={handleChange}>
            {tabs.map((item, k) => {
              return (
                <Tabs.TabPane
                  tab={
                    <div>
                      {item.title}
                      {item.key === '2' && (
                        <span style={{ color: 'red', marginLeft: 4 }}>
                          {state.resFailTotal}
                        </span>
                      )}
                      {item.key === '3' && (
                        <span style={{ color: 'red', marginLeft: 4 }}>
                          {state.assertFailTotal}
                        </span>
                      )}
                    </div>
                  }
                  key={item.key}
                >
                  {item.node}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </div>}
    </BasePageLayout>
  );
};
export default scriptDebugDetail;
