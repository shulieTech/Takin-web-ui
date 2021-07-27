import React, { useEffect, useState, Fragment } from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';

import { connect } from 'dva';
import OperationLogTable from './components/OperationLogTable';
import OperationLogSearch from './components/OperationLogSearch';

interface OperationLogProps {
  location?: { query?: any };
  dictionaryMap?: any;
}

export interface OperationLogState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const OperationLog: React.FC<OperationLogProps> = props => {
  const [state, setState] = useStateReducer<OperationLogState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  return (
    <Fragment>
      <SearchTable
        key="id"
        commonTableProps={{
          columns: OperationLogTable(state, setState)
        }}
        commonFormProps={{
          formData: OperationLogSearch(),
          rowNum: 4
        }}
        ajaxProps={{ url: '/operation/log/list', method: 'GET' }}
        toggleRoload={state.isReload}
        datekeys={[
          {
            originKey: 'time',
            separateKey: ['startTime', 'endTime']
          }
        ]}
      />
    </Fragment>
  );
};
export default connect(({ common }) => ({ ...common }))(OperationLog);
