import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getColumns from './components/DemoTable';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import getFormData from './components/DemoSearch';

interface DemoProps {}

export interface DemoState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const Demo: React.FC<DemoProps> = props => {
  const [state, setState] = useStateReducer<DemoState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  return (
    <SearchTable
      commonTableProps={{
        columns: getColumns(state, setState),
        size: 'small'
      }}
      commonFormProps={{ formData: getFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/demo', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
    />
  );
};
export default Demo;
