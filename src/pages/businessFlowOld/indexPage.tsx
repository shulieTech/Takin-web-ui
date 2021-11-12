import { connect } from 'dva';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import BusinessActivityService from '../businessActivity/service';
import getFormData from './components/BusinessFlowSearch';
import getColumns from './components/BusinessFlowTable';
import TableAction from './components/TableAction';

interface BusinessFlowProps {}

export interface BusinessFlowState {
  isReload?: boolean;
  middleware?: any;
  middlewareCascade?: any;
  searchParams?: any;
}

const BusinessFlow: React.FC<BusinessFlowProps> = props => {
  const [state, setState] = useStateReducer<BusinessFlowState>({
    isReload: false,
    middleware: null,
    middlewareCascade: null,
    searchParams: {}
  });

  useEffect(() => {
    queryMiddleware();
  }, [state.isReload]);

  useEffect(() => {
    queryMiddlewareCascade(state.searchParams.middleWareType);
  }, [state.isReload, state.searchParams.middleWareType]);

  /**
   * @name 获取中间件类型，中间件，中间件版本
   */
  const queryMiddleware = async () => {
    const {
      data: { success, data }
    } = await BusinessActivityService.queryMiddleware({});
    if (success) {
      setState({
        middleware: data
      });
    }
  };

  /**
   * @name 中间件，中间件版本
   */
  const queryMiddlewareCascade = async value => {
    const {
      data: { success, data }
    } = await BusinessActivityService.queryMiddlewareCascade({
      middleWareType: value
    });
    if (success) {
      setState({
        middlewareCascade: data
      });
    }
  };

  const filterData: any = [
    {
      dataSource:
        state.middleware && state.middleware.length > 0
          ? state.middleware.map((item, k) => {
            return { label: item.middleWareType, value: item.middleWareType };
          })
          : [],
      key: 'middleWareType',
      label: '中间件类型'
    },
    {
      dataSource: [
        { label: '正常', value: '0' },
        { label: '变更', value: '1' }
      ],
      key: 'ischange',
      label: '变更状态',
      type: 'radio'
    }
  ];

  return (
    <SearchTable
      commonTableProps={{
        columns: getColumns(state, setState),
        size: 'small'
      }}
      ajaxProps={{ url: '/link/scene/manage', method: 'GET' }}
      commonFormProps={{ formData: getFormData(state), rowNum: 6 }}
      filterData={filterData}
      tableAction={<TableAction state={state} setState={setState} />}
      toggleRoload={state.isReload}
      onSearch={searchParams => setState({ searchParams })}
      cascaderKeys={[
        {
          originKey: 'middleWareArr',
          separateKey: ['middleWareName', 'middleWareVersion']
        }
      ]}
    />
  );
};
export default connect(({ common }) => ({ ...common }))(BusinessFlow);
