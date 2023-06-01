/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, createRef } from 'react';
import SearchTable from 'src/components/search-table';
import getColumns from './components/AppManageTable';
import getFormData from './components/AppManageSearch';
import { useStateReducer } from 'racc';
import TableAction from './components/TableAction';
import TableWarning from './components/TableWarning';
import AppManageService from './service';

interface AppManageProps {
  isReload?: boolean;
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

const AppManage: React.FC<AppManageProps> = (props) => {
  const [state, setState] = useStateReducer<AppManageState>({
    isReload: false,
    switchStatus: null,
    searchParams: {
      current: 0,
      pageSize: 10,
      ...props.location.query,
    },
    checkedKeys: [],
  });
  const searchTableRef = createRef();

  useEffect(() => {
    querySwitchStatus();
  }, []);

  useEffect(() => {
    // 将url中的筛选参数赋给searchTable
    const refCurrent = searchTableRef?.current as any;
    if (
      refCurrent?.tableState?.form &&
      Object.keys(props.location.query)?.length > 0
    ) {
      refCurrent?.tableState?.form.setFieldsValue(
        props.location.query
      );
    }
  }, [searchTableRef]);

  /**
   * @name 获取压测开关状态
   */
  const querySwitchStatus = async () => {
    const {
      data: { data, success },
    } = await AppManageService.querySwitchStatus({});
    if (success) {
      setState({
        switchStatus: data.switchStatus,
      });
    }
  };

  const handleCheck = async (keys, selectedRows) => {
    setState({
      checkedKeys: keys,
    });
  };

  return (
    <SearchTable
      ref={searchTableRef}
      commonTableProps={{
        columns: getColumns(state, setState),
        rowKey: 'id',
        // rowSelectProps: {
        //   selectedRowKeys: state.checkedKeys
        // },
        // checkable: true
      }}
      // onCheck={(keys, checkedRows) => handleCheck(keys, checkedRows)}
      commonFormProps={{ formData: getFormData(state), rowNum: 6 }}
      ajaxProps={{ url: '/application/center/list', method: 'GET' }}
      searchParams={state.searchParams}
      toggleRoload={state.isReload}
      tableAction={<TableAction state={state} setState={setState} />}
      tableWarning={
        state.switchStatus !== 'OPENED' &&
        state.switchStatus !== null && (
          <TableWarning state={state} setState={setState} />
        )
      }
    />
  );
};
export default AppManage;
