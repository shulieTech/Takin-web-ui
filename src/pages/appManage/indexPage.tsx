import React, { useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import getColumns from './components/AppManageTable';
import getFormData from './components/AppManageSearch';
import { useStateReducer } from 'racc';
import TableAction from './components/TableAction';
import TableWarning from './components/TableWarning';
import AppManageService from './service';

interface AppManageProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  location?: any;
}

export interface AppManageState {
  switchStatus: string;
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  searchParamss?: any;
  checkedKeys: string[];
}

const AppManage: React.FC<AppManageProps> = props => {
  const [state, setState] = useStateReducer<AppManageState>({
    isReload: false,
    switchStatus: null,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    searchParamss: props.location.query,
    checkedKeys: []
  });

  useEffect(() => {
    querySwitchStatus();
  }, []);

  /**
   * @name 获取压测开关状态
   */
  const querySwitchStatus = async () => {
    const {
      data: { data, success }
    } = await AppManageService.querySwitchStatus({});
    if (success) {
      setState({
        switchStatus: data.switchStatus
      });
    }
  };

  const handleCheck = async (keys, selectedRows) => {
    setState({
      checkedKeys: keys
    });
  };

  return (
    <SearchTable
      commonTableProps={{
        columns: getColumns(state, setState),
        rowKey: 'id',
        rowSelectProps: {
          selectedRowKeys: state.checkedKeys
        },
        checkable: true
      }}
      onCheck={(keys, checkedRows) => handleCheck(keys, checkedRows)}
      commonFormProps={{ formData: getFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/application/center/list', method: 'GET' }}
      searchParams={state.searchParamss}
      toggleRoload={state.isReload}
      tableAction={<TableAction state={state} setState={setState} />}
      tableWarning={
        state.switchStatus !== 'OPENED' && (
          <TableWarning state={state} setState={setState} />
        )
      }
    />
  );
};
export default AppManage;
