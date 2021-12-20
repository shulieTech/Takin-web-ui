/**
 * @name
 * @author MingShined
 */
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { httpGet, httpPost } from 'src/utils/request';
import { filterSearchParams } from 'src/utils/utils';
import FooterNode from './components/FooterNode';
import SearchNode from './components/SearchNode';
import TableNode from './components/TableNode';
import TitleNode from './components/TitleNode';
import { getInitState, SearchTableContext } from './context';
import styles from './index.less';
import { SearchTableProps } from './type';

const SearchTable: React.FC<SearchTableProps> = props => {
  const [state, setState] = useStateReducer(getInitState());
  useEffect(() => {
    if (!state.flag && props.searchParams) {
      return;
    }
    setState({
      searchParams: { ...state.searchParams },
      checkedKeys: [],
      checkedRows: []
    });
    // setState({ searchParams: { ...state.searchParams, current: 0 } });
    queryList(true);
  }, [props.toggleRoload]);
  useEffect(() => {
    if (!props.searchParams) {
      return;
    }
    const searchParams = {
      ...getInitState().searchParams,
      ...props.searchParams
    };
    setState({
      searchParams,
      flag: true
    });
  }, [props.searchParams]);
  useEffect(() => {
    if (!state.flag) {
      return;
    }
    queryList();
  }, [state.searchParams, state.toggleRoload]);
  const queryList = async (reload: boolean = false) => {
    // return;
    // if (props.onCheck) {
    //   const checkedKeys = reload ? [] : state.checkedKeys;
    //   const checkedRows = reload ? [] : state.checkedRows;
    //   props.onCheck(checkedKeys, checkedRows);
    // }
    setState({ loading: true });
    const { method, url } = props.ajaxProps;
    const getSearchParams = { ...state.searchParams };
    window._search_table_params = getSearchParams; // 某些情况下外部需要获取页码信息
    Object.keys(getSearchParams).forEach(item => {
      if (typeof getSearchParams[item] === 'string') {
        getSearchParams[item] = getSearchParams[item].trim();
      }
    });
    if (method === 'GET') {
      Object.keys(getSearchParams).forEach(item => {
        if (Array.isArray(getSearchParams[item])) {
          getSearchParams[item] = getSearchParams[item].join(',');
        }
      });
    }

    const ajaxEvent =
      method === 'GET'
        ? httpGet(url, filterSearchParams(getSearchParams))
        : httpPost(url, filterSearchParams(getSearchParams));
    const {
      data: { data, success },
      total
    } = await ajaxEvent;
    if (props.onSearch) {
      props.onSearch(state.searchParams, data);
    }
    if (success) {
      setState({
        total,
        dataSource: data,
        loading: false,
        // checkedKeys: reload ? [] : state.checkedKeys,
        flag: true
      });
    }
  };
  return (
    <SearchTableContext.Provider value={{ state, setState }}>
      <div className={styles.searchTableWrap}>
        <div
          className={props.theme === 'dark' && styles.searchWrap}
          style={{ padding: '8px 31px 64px 31px' }}
        >
          {props.title && (
            <h1 className="ft-18 ft-white mg-t1x">{props.title}</h1>
          )}
          {props.filterData && <TitleNode {...props} />}
          {props.commonFormProps && <SearchNode {...props} />}
        </div>
        <TableNode {...props} />
        <FooterNode {...props} />
      </div>
    </SearchTableContext.Provider>
  );
};
export default SearchTable;

SearchTable.defaultProps = {
  theme: 'dark'
};
