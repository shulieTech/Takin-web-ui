import React, { useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getMissionManageFormData from './components/MissionManageSearch';
import getMissionManageColumns from './components/MissionManageTable';
import MissionManageService from './service';

interface MissionManageProps {}

const getInitState = () => ({
  isReload: false,
  // searchParams: {
  //   current: 0,
  //   pageSize: 10,
  //   renterId: 1
  // },
  PATROL_EXCEPTION_TYPE: null,
  PATROL_EXCEPTION_LEVEL: null
});
export type MissionManageState = ReturnType<typeof getInitState>;

const MissionManage: React.FC<MissionManageProps> = props => {
  const [state, setState] = useStateReducer<MissionManageState>(getInitState());

  useEffect(() => {
    queryPatrolSceneAndDashbordList();
  }, []);

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
        PATROL_EXCEPTION_LEVEL:
          data.PATROL_EXCEPTION_LEVEL &&
          data.PATROL_EXCEPTION_LEVEL.map((item, k) => {
            return {
              label: item.label,
              value: item.value
            };
          })
      });
    }
  };

  return (
    <SearchTable
      commonTableProps={{
        columns: getMissionManageColumns(state, setState)
      }}
      commonFormProps={{ formData: getMissionManageFormData(state), rowNum: 6 }}
      ajaxProps={{ url: '/patrol/manager/exception/query', method: 'POST' }}
      toggleRoload={state.isReload}
    />
  );
};
export default MissionManage;
