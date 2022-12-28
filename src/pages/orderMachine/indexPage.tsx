import React from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';
import getOrderMachineFormData from './components/OrderMachineSearch';
import getOrderMachineColumns from './components/OrderMachineTable';
import OrderMachineAction from './components/OrderMachineTableAction';

interface OrderMachineProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

export interface OrderMachineState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const OrderMachine: React.FC<OrderMachineProps> = (props) => {
  const [state, setState] = useStateReducer<OrderMachineState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  return (
    <SearchTable
      commonTableProps={{
        columns: getOrderMachineColumns(state, setState),
        size: 'small'
      }}
      commonFormProps={{ formData: getOrderMachineFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/user/list', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
      tableAction={<OrderMachineAction state={state} setState={setState} />}
    />
  );
};
export default OrderMachine;
