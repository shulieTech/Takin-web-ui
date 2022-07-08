import { connect } from 'dva';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import { CommonModelState } from 'src/models/common';
import getFormData from './components/SearchNode';
import TableAction from './components/TableAction';
import getColumns from './components/TableNode';
import BusinessActivityService from './service';
import CategoryTreeSelect from './components/CategoryTreeSelect';
import styles from './index.less';

interface SystemFlowProps extends CommonModelState {
  location?: any;
}

declare var window: any;

export interface SystemFlowState {
  isReload?: boolean;
  middleware?: any;
  searchParamss?: any;
  middlewareCascade?: any;
  searchParams?: any;
  showModal: boolean;
}

const SystemFlow: React.FC<SystemFlowProps> = (props) => {
  const [state, setState] = useStateReducer<SystemFlowState>({
    isReload: false,
    middleware: null,
    searchParamss: props.location.query,
    middlewareCascade: null,
    searchParams: {
      type: '0',
      category: 0,
    },
    showModal: false,
  });

  // useEffect(() => {
  //   // queryMiddleware();
  // }, [state.isReload]);

  // useEffect(() => {
  //   // queryMiddlewareCascade(state.searchParams.middleWareType);
  // }, [state.isReload, state.searchParams.middleWareType]);

  /**
   * @name 获取中间件类型，中间件，中间件版本
   */
  const queryMiddleware = async () => {
    const {
      data: { success, data },
    } = await BusinessActivityService.queryMiddleware({});
    if (success) {
      setState({
        middleware: data,
      });
    }
  };

  /**
   * @name 获取中间件、中间件版本的级联数据
   */
  const queryMiddlewareCascade = async (value) => {
    const {
      data: { success, data },
    } = await BusinessActivityService.queryMiddlewareCascade({
      middleWareType: value,
    });
    if (success) {
      setState({
        middlewareCascade: data,
      });
    }
  };

  const filterData: any = [
    {
      dataSource: props.dictionaryMap.link_level,
      key: 'linkLevel',
      label: '级别',
    },
    {
      // dataSource: props.dictionaryMap.domain,
      dataSource: props.domains,
      key: 'domain',
      label: '业务域',
    },
    {
      key: 'type',
      label: '类型',
      dataSource: [
        { label: '普通', value: 0 },
        { label: '虚拟', value: 1 },
      ],
    },
    {
      key: 'category',
      label: '分类',
      renderNode: (prop) => {
        return (
          <CategoryTreeSelect
            canEdit
            className={styles['no-border-tree-select']}
            value={prop.value}
            onChange={prop.onChange}
            style={{ width: 240 }}
            dropdownStyle={{
              overflowY: 'auto',
              width: 240,
              zIndex: 10,
            }}
          />
        );
      },
    },
    // {
    //   dataSource: [
    //     { label: '正常', value: '0' },
    //     { label: '变更', value: '1' },
    //   ],
    //   key: 'isChange',
    //   label: '变更状态',
    //   type: 'radio',
    // },
  ];

  useEffect(() => {
    // 获取业务域列表
    window.g_app._store.dispatch({
      type: 'common/getDomains',
    });
  }, []);

  return (
    <SearchTable
      commonTableProps={{
        columns: getColumns(state, setState, props),
        size: 'small',
      }}
      searchParams={state.searchParams}
      ajaxProps={{ url: '/activities', method: 'GET' }}
      commonFormProps={{ formData: getFormData(state, setState), rowNum: 6 }}
      filterData={filterData}
      tableAction={<TableAction state={state} setState={setState} />}
      toggleRoload={state.isReload}
    />
  );
};
export default connect(({ common }) => ({ ...common }))(SystemFlow);
