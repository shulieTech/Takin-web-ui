import React, { Fragment, useEffect } from 'react';
import FlowAccountSummary from './components/FlowAccountSummary';
import FlowAccountTable from './components/FlowAccountTable';
import { BasePageLayout } from 'src/components/page-layout';
import { Pagination } from 'antd';
import { useStateReducer } from 'racc';
import FlowAccountService from './service';
interface Props {}
interface State {
  isReload?: boolean;
  searchParams: {
    current: number;
    pageSize: number;
  };
  data: any[];
  total?: number;
  detailInfo: any;
}
const FlowAccount: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    data: null,
    total: 0,
    detailInfo: {} as any
  });

  useEffect(() => {
    queryFlowAccountInfo();
  }, []);

  useEffect(() => {
    queryFlowAccountList();
  }, [state.searchParams.current, state.searchParams.pageSize]);

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

  /**
   * @name 获取流量账户列表
   */
  const queryFlowAccountList = async () => {
    const {
      total,
      data: { success, data }
    } = await FlowAccountService.queryFlowAccountList({
      ...state.searchParams
    });
    if (success) {
      setState({
        total,
        data
      });
    }
  };

  /**
   * @name 获取流量账户信息
   */
  const queryFlowAccountInfo = async () => {
    const {
      total,
      data: { success, data }
    } = await FlowAccountService.queryFlowAccountInfo({});
    if (success) {
      setState({
        detailInfo: data
      });
    }
  };
  return (
    <Fragment>
      <div style={{ padding: 20, paddingBottom: 60 }}>
        <FlowAccountSummary detailInfo={state.detailInfo} />
        <FlowAccountTable dataSource={state.data ? state.data : []} />
        <Pagination
          style={{
            marginTop: 20,
            textAlign: 'right',
            position: 'fixed',
            padding: '8px 40px',
            bottom: 0,
            right: 10,
            width: 'calc(100% - 178px)',
            backgroundColor: '#fff',
            boxShadow:
              '0px 2px 20px 0px rgba(92,80,133,0.15),0px -4px 8px 0px rgba(222,223,233,0.3)'
          }}
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
      </div>
    </Fragment>
  );
};
export default FlowAccount;
