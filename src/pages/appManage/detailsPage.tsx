import React, { Fragment, useEffect } from 'react';
import { BasePageLayout } from 'src/components/page-layout';

import { useStateReducer } from 'racc';
import AppManageService from './service';
import AppDetailHeader from './components/AppDetailHeader';
import AppDetailTabs from './components/AppDetailTabs';
import CustomSkeleton from 'src/common/custom-skeleton';
import TableWarning from './components/TableWarning';

interface Props {
  location?: { query?: any };
}
const AppManageDetail: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    detailData: {} as any,
    isReload: false,
    switchStatus: null,
    visible: false,
    isNewAgent: null,
    isNewAgentForTabs: null
  });

  const { location } = props;
  const { query } = location;
  const { id, tabKey, action } = query;

  useEffect(() => {
    queryAppDetail(id);
    querySwitchStatus();
    queryAgentStatus();
    queryAgentForTabsStatus();
  }, [state.isReload]);

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

  /**
   * @name 获取agent版本（true新false旧）
   */
  const queryAgentStatus = async () => {
    const {
      data: { data, success }
    } = await AppManageService.queryAgentStatus({});
    if (success) {
      setState({
        isNewAgent: data
      });
    }
  };

  /**
   * @name 获取agent版本（1新0旧）
   */
  const queryAgentForTabsStatus = async () => {
    const {
      data: { data, success }
    } = await AppManageService.queryAgentForTabsStatus({ applicationId: id });
    if (success) {
      setState({
        isNewAgentForTabs: data.isNew
      });
    }
  };

  /**
   * @name 获取应用详情
   */
  const queryAppDetail = async value => {
    const {
      data: { data, success }
    } = await AppManageService.queryAppManageDetail({
      id: value
    });
    if (success) {
      setState({
        detailData: data
      });
    }
  };
  return (
    <Fragment>
      {JSON.stringify(state.detailData) !== '{}' ? (
        <div style={{ height: '100%' }}>
          {/* <BasePageLayout> */}
          <div
            style={{
              padding: 20,
              // height: '100%',
              // border: '1px solid red',
              // overflowY: 'hidden'
            }}
          >
            <AppDetailHeader
              detailData={state.detailData}
              id={id}
              state={state}
              setState={setState}
              action={action}
            />
            {state.switchStatus !== 'OPENED' && (
              <TableWarning state={state} setState={setState} />
            )}
            <AppDetailTabs
              detailState={state}
              detailData={state.detailData}
              tabKey={tabKey}
              id={id}
              action={action}
              isNewAgent={state.isNewAgentForTabs}
            />
          </div>
          {/* </BasePageLayout> */}
        </div>
      ) : (
        <CustomSkeleton />
      )}
    </Fragment>
  );
};
export default AppManageDetail;
