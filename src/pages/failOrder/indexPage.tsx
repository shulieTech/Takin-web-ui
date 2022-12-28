import React from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';
import getFailOrderFormData from './components/FailOrderSearch';
import getFailOrderColumns from './components/FailOrderTable';

interface FailOrderProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

export interface FailOrderState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const FailOrder: React.FC<FailOrderProps> = (props) => {
  const [state, setState] = useStateReducer<FailOrderState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  return (
    <SearchTable
      commonTableProps={{
        columns: getFailOrderColumns(state, setState),
        size: 'small'
      }}
      commonFormProps={{ formData: getFailOrderFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/user/list', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
    />
  );
};
export default FailOrder;
