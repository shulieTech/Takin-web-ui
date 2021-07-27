import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';
import getAppTrialManageColumns from './components/AppTrialManageTable';
import AppTrialTableAction from './components/AppTrialTableAction';
import EmptyNode from 'src/common/empty-node';
import { Button } from 'antd';
import AppTrialManageService from './service';

interface AppManageProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

export interface AppManageState {
  isReload?: boolean;
  isEmpty: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}
declare var serverUrl: string;
const AppTrialManage: React.FC<AppManageProps> = props => {
  const [state, setState] = useStateReducer<AppManageState>({
    isReload: false,
    isEmpty: true,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  useEffect(() => {
    queryAppList();
  }, [state.isReload]);

  /**
   * @name 获取应用列表
   */
  const queryAppList = async () => {
    const {
      data: { data, success }
    } = await AppTrialManageService.queryAppList({ ...state.searchParams });
    if (success && data && data.length > 0) {
      setState({
        isEmpty: false
      });
    }
  };

  return state.isEmpty ? (
    <div style={{ marginTop: 200 }}>
      <EmptyNode
        title="暂无接入应用"
        desc={
          <p style={{ width: 228, display: 'inline-block' }}>
            请下载体验文档，根据文档步骤接入应用， 重启应用后刷新查看
          </p>}
        extra={
          <div>
            <Button type="primary" style={{ marginRight: 8 }}>
              <a href={`${serverUrl}/poc/agent/guide/doc`} download>
                下载体验文档
              </a>
            </Button>
            <Button
              onClick={() => {
                setState({
                  isReload: !state.isReload
                });
              }}
            >
              刷新
            </Button>
          </div>
        }
      />
    </div>
  ) : (
    <SearchTable
      commonTableProps={{
        columns: getAppTrialManageColumns(state, setState),
        size: 'small'
      }}
      //   commonFormProps={{ formData: getAppTrialManageFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/application/center/list', method: 'GET' }}
      searchParams={{ ...state.searchParams }}
      toggleRoload={state.isReload}
      tableAction={<AppTrialTableAction />}
    />
  );
};
export default AppTrialManage;
