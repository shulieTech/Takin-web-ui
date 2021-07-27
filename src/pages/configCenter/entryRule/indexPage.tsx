import React, { useEffect, useState, Fragment } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import { connect } from 'dva';
import EntryRuleSearch from './components/EntryRuleSearch';
import EntryRuleTable from './components/EntryRuleTable';
import EntryRuleTableAction from './components/EntryRuleTableAction';

interface EntryRuleProps {
  location?: { query?: any };
  dictionaryMap?: any;
}

export interface EntryRuleState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const EntryRule: React.FC<EntryRuleProps> = props => {
  const [state, setState] = useStateReducer<EntryRuleState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  const { dictionaryMap } = props;

  return (
    <Fragment>
      <SearchTable
        key="id"
        commonFormProps={{
          formData: EntryRuleSearch(state, dictionaryMap),
          rowNum: 6
        }}
        ajaxProps={{ url: '/api/get', method: 'GET' }}
        toggleRoload={state.isReload}
        commonTableProps={{
          columns: EntryRuleTable(state, setState)
        }}
        tableAction={<EntryRuleTableAction state={state} setState={setState} />}
      />
    </Fragment>
  );
};
export default connect(({ common }) => ({ ...common }))(EntryRule);
