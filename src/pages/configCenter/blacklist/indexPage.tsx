import React, { useEffect, useState, Fragment } from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';

import { connect } from 'dva';
import BlacklistTable from './components/BlacklistTable';
import BlacklistSearch from './components/BlacklistSearch';
import BlacklistTableAction from './components/BlacklistTableAction';
import BlacklistFooterAction from './components/BlacklistFooterAction';

interface BlacklistProps {
  location?: { query?: any };
  dictionaryMap?: any;
}

export interface BlacklistState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  checkedKeys: string[];
}

const Blacklist: React.FC<BlacklistProps> = props => {
  const [state, setState] = useStateReducer<BlacklistState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    checkedKeys: []
  });

  const { dictionaryMap } = props;

  const handleCheck = async (keys, selectedRows) => {
    setState({
      checkedKeys: keys
    });
  };

  return (
    <Fragment>
      <SearchTable
        key="blistId"
        commonTableProps={{
          rowKey: 'blistId',
          columns: BlacklistTable(state, setState),
          rowSelectProps: {
            selectedRowKeys: state.checkedKeys
          },
          checkable: true
        }}
        commonFormProps={{
          formData: BlacklistSearch(state, dictionaryMap),
          rowNum: 6
        }}
        ajaxProps={{ url: '/confcenter/query/blist', method: 'GET' }}
        toggleRoload={state.isReload}
        onCheck={(keys, checkedRows) => handleCheck(keys, checkedRows)}
        tableAction={<BlacklistTableAction state={state} setState={setState} />}
        footerAction={
          <BlacklistFooterAction state={state} setState={setState} />}
      />
    </Fragment>
  );
};
export default connect(({ common }) => ({ ...common }))(Blacklist);
