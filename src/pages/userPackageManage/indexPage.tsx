import React from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getUserPackageManageFormData from './components/UserPackageManageSearch';
import getUserPackageManageColumns from './components/UserPackageManageTable';
import UserPackageTableManageAction from './components/UserPackageManageTableAction';

interface UserPackageManageProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

export interface UserPackageManageState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const UserPackageManage: React.FC<UserPackageManageProps> = props => {
  const [state, setState] = useStateReducer<UserPackageManageState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  return (
    <SearchTable
      commonTableProps={{
        columns: getUserPackageManageColumns(state, setState),
        size: 'small'
      }}
      commonFormProps={{ formData: getUserPackageManageFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/user/list', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
      tableAction={<UserPackageTableManageAction state={state} setState={setState} />}
    />
  );
};
export default UserPackageManage;
