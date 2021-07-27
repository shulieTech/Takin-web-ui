import { Pagination } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonTable, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import CustomTable from 'src/components/custom-table';
import { DetailState } from '../detailPage';
import LinkDebugService from '../service';
import getConfigErrorListColumn from './ConfigErrorListColumn';
import getConfigErrorListFormData from './ConfigErrorListFormData';
interface Props {
  // resultId: string;
  traceId?: string;
  state?: DetailState;
}
const getInitState = () => ({
  form: null as WrappedFormUtils,
  configErrorList: [],
  current: 0,
  pageSize: 10,
  total: 0,
  selectData: null,
  loading: false,
  isReload: false
});
export type ConfigErrorListState = ReturnType<typeof getInitState>;
const ConfigErrorList: React.FC<Props> = props => {
  const { traceId } = props;
  const [state, setState] = useStateReducer<ConfigErrorListState>(
    getInitState()
  );

  useEffect(() => {
    if (props.state.tabKey === '0') {
      queryDebugResultErrorList({
        traceId,
        current: state.current,
        pageSize: state.pageSize
      });
    }
  }, [state.pageSize, state.current, state.isReload]);

  useEffect(() => {
    if (props.state.tabKey === '0') {
      queryDebugResultErrorListSelect({
        traceId
      });
    }
  }, []);

  /**
   * @name 获取结果配置异常
   */
  const queryDebugResultErrorList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await LinkDebugService.queryDebugResultErrorList({ ...value });
    if (success) {
      setState({
        total,
        configErrorList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取结果配置异常
   */
  const queryDebugResultErrorListSelect = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryDebugResultErrorListSelect({ ...value });
    if (success) {
      setState({
        selectData: data
      });
    }
  };

  const handleSearch = () => {
    state.form.validateFields(async (err, values) => {
      queryDebugResultErrorList({
        ...values,
        traceId,
        current: state.current,
        pageSize: state.pageSize
      });
    });
  };

  const handleReset = () => {
    state.form.resetFields();

    setState({
      isReload: !state.isReload,
      current: 0,
      pageSize: 10
    });
  };

  const handleChangePage = async (current, pageSize) => {
    setState({
      pageSize,
      current: current - 1
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      pageSize,
      current: 0
    });
  };

  return (
    <Fragment>
      <CommonForm
        getForm={form => setState({ form })}
        formData={getConfigErrorListFormData(state)}
        rowNum={4}
        onSubmit={handleSearch}
        onReset={handleReset}
      />
      <CustomTable
        rowKey="id"
        columns={getConfigErrorListColumn(state, setState)}
        dataSource={state.configErrorList}
        loading={state.loading}
      />
      <Pagination
        style={{ display: 'inline-block', float: 'right' }}
        total={state.total}
        current={state.current + 1}
        pageSize={state.pageSize}
        showTotal={(t, range) =>
          `共 ${state.total} 条数据 第${state.current + 1}页 / 共 ${Math.ceil(
            state.total / (state.pageSize || 10)
          )}页`
        }
        showSizeChanger={true}
        onChange={(current, pageSize) => handleChangePage(current, pageSize)}
        onShowSizeChange={handlePageSizeChange}
      />
    </Fragment>
  );
};
export default ConfigErrorList;
