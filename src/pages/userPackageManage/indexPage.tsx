/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getUserPackageManageFormData from './components/UserPackageManageSearch';
import getUserPackageManageColumns from './components/UserPackageManageTable';
import UserPackageTableManageAction from './components/UserPackageManageTableAction';
import UserPackageManageService from './service';

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
  tenantList: any;
}

const UserPackageManage: React.FC<UserPackageManageProps> = props => {
  const [state, setState] = useStateReducer<UserPackageManageState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    tenantList: []
  });

  useEffect(() => {
    queryTenantList();
  }, []);

  /**
   * @name 获取租户列表
   */
  const queryTenantList = async () => {
    const {
              data: { data, success }
            } = await UserPackageManageService.queryTenantList({});
    if (success) {
      setState({
        tenantList: data
      });
    }
  };

  return (
    <SearchTable
      commonTableProps={{
        columns: getUserPackageManageColumns(state, setState),
        size: 'small'
      }}
      commonFormProps={{ formData: getUserPackageManageFormData(state), rowNum: 6 }}
      ajaxProps={{ url: '/ecloud/package/list', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
      tableAction={<UserPackageTableManageAction state={state} setState={setState} />}
    />
  );
};
export default UserPackageManage;
