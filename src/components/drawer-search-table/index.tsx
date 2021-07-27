/**
 * @name
 * @author MingShined
 */
import React, { useEffect, useState } from 'react';
import { useStateReducer, separateArrayToKey } from 'racc';
import { getInitState, SearchTableContext } from './context';
import { SearchTableProps } from './type';
import TitleNode from './components/TitleNode';
import SearchNode from './components/SearchNode';
import TableNode from './components/TableNode';
import { httpGet, httpPost } from 'src/utils/request';
import FooterNode from './components/FooterNode';
import styles from './index.less';
import { filterSearchParams } from 'src/utils/utils';
import _ from 'lodash';

const DrawerSearchTable: React.FC<SearchTableProps> = props => {
  const [state, setState] = useStateReducer(getInitState());
  useEffect(() => {
    if (!state.flag && props.searchParams) {
      return;
    }
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
    if (props.onCheck) {
      const checkedKeys = reload ? [] : state.checkedKeys;
      const checkedRows = reload ? [] : state.checkedRows;
      props.onCheck(checkedKeys, checkedRows);
    }
    setState({ loading: true });
    const { method, url } = props.ajaxProps;
    const getSearchParams = { ...state.searchParams };
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
        : httpPost(url, filterSearchParams(state.searchParams));
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
        checkedKeys: reload ? [] : state.checkedKeys,
        flag: true
      });
    }
  };
  return (
    <SearchTableContext.Provider value={{ state, setState }}>
      <div className={styles.searchTableWrap}>
        <div className={styles.searchWrap}>
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
export default DrawerSearchTable;
