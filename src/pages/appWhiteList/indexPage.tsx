import React, { useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getAppWhiteListFormData from './components/AppWhiteListSearch';
import getAppWhiteListColumns from './components/AppWhiteListTable';
import AppManageService from '../appManage/service';

interface Props {
  btnText?: string | React.ReactDOM;
}
const getInitState = () => ({
  isReload: false,
  switchStatus: null,
  searchParams: {
    current: 0,
    pageSize: 10
  },
  wlistId: null,
  appNames: null
});

export type AppWhiteListState = ReturnType<typeof getInitState>;
const AppWhiteList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<AppWhiteListState>(getInitState());

  useEffect(() => {
    if (state.wlistId) {
      queryAppList();
    }
  }, [state.wlistId]);

  /**
   * @name 获取应用列表
   */
  const queryAppList = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryAppList({
      wlistId: state.wlistId
    });
    if (success) {
      setState({
        appNames: data.effectiveAppNames
      });
    }
  };

  return (
    <SearchTable
      commonTableProps={{
        columns: getAppWhiteListColumns(state, setState)
      }}
      commonFormProps={{ formData: getAppWhiteListFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/whitelist/list', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
    />
  );
};
export default AppWhiteList;
