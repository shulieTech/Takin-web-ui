import React, { Fragment, useEffect } from 'react';
import { BasePageLayout } from 'src/components/page-layout';

import { useStateReducer } from 'racc';

import CustomSkeleton from 'src/common/custom-skeleton';
import AppTrialManageService from './service';
import AppTrialDetailHeader from './components/AppTrialDetailHeader';
import AppTrialDetailTabs from './components/AppTrialDetailTabs';

interface Props {
  location?: { query?: any };
}
const AppManageDetail: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    detailData: {} as any,
    isReload: false
  });

  const { location } = props;
  const { query } = location;
  const { id } = query;

  useEffect(() => {
    queryAppDetail(id);
  }, [state.isReload]);

  /**
   * @name 获取应用详情
   */
  const queryAppDetail = async value => {
    const {
      data: { data, success }
    } = await AppTrialManageService.queryAppDetail({
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
        <BasePageLayout>
          <AppTrialDetailHeader
            detailData={state.detailData}
            id={id}
            state={state}
            setState={setState}
          />
          <AppTrialDetailTabs detailData={state.detailData} id={id} />
        </BasePageLayout>
      ) : (
        <CustomSkeleton />
      )}
    </Fragment>
  );
};
export default AppManageDetail;
