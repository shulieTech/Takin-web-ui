import React, { useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getMissionManageFormData from './components/MissionManageSearch';
import getMissionManageColumns from './components/MissionManageTable';
import MissionManageTableAction from './components/MissionManageTableAction';
import MissionManageService from './service';

interface MissionManageProps { }

const getInitState = () => ({
  isReload: false,
  // searchParams: {
  //   current: 0,
  //   pageSize: 10,
  //   renterId: 1
  // },
  PATROL_EXCEPTION_TYPE: [],
  NOTIFY_CHANNEL: [],
});
export type MissionManageState = ReturnType<typeof getInitState>;

const MissionManage: React.FC<MissionManageProps> = props => {
  const [state, setState] = useStateReducer<MissionManageState>(getInitState());

  useEffect(() => {
    queryPatrolSceneAndDashbordList();
  }, []);

  /**
   * @name 获取巡检场景和看板列表
   */
  const queryPatrolSceneAndDashbordList = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.queryPatrolSceneAndDashbordList({});
    if (success) {
      setState({
        PATROL_EXCEPTION_TYPE:
          data.PATROL_EXCEPTION_TYPE &&
          data.PATROL_EXCEPTION_TYPE.map((item1, k1) => {
            return {
              label: item1.label,
              value: item1.value
            };
          }),
      });
      setState({
        NOTIFY_CHANNEL:
          data.NOTIFY_CHANNEL &&
          data.NOTIFY_CHANNEL.map((item, k1) => {
            return {
              label: item.label,
              value: item.value
            };
          }),
      });
    }
  };

  return (
    <SearchTable
      commonTableProps={{
        columns: getMissionManageColumns(state, setState)
      }}
      commonFormProps={{ formData: getMissionManageFormData(state), rowNum: 6 }}
      ajaxProps={{ url: '/patrol/manager/exception_notice/query', method: 'POST' }}
      toggleRoload={state.isReload}
      tableAction={
        <MissionManageTableAction state={state} setState={setState} />}
    />
  );
};
export default MissionManage;
