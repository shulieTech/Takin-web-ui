import React, { Fragment, useEffect } from 'react';
import { BasePageLayout } from 'src/components/page-layout';

import { useStateReducer } from 'racc';

import CustomSkeleton from 'src/common/custom-skeleton';
import PressureMeasurementRecordService from './service';
import ReportDetailHeader from './components/ReportDetailHeader';
import ReportDetailTabs from './components/ReportDetailTabs';

interface Props {
  location?: { query?: any };
}
const DomainDetail: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    detailData: {} as any
  });

  const { location } = props;
  const { query } = location;
  const { id } = query;

  useEffect(() => {
    // queryReportDetail(id);
  }, []);

  /**
   * @name 获取压测报告详情
   */
  const queryReportDetail = async value => {
    const {
      data: { data, success }
    } = await PressureMeasurementRecordService.queryReportDetail({
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
      {/* {JSON.stringify(state.detailData) !== '{}' ? ( */}
      <BasePageLayout>
        <ReportDetailHeader detailData={state.detailData} />
        <ReportDetailTabs detailData={state.detailData} />
      </BasePageLayout>
      {/* ) : (
        <CustomSkeleton />
      )} */}
    </Fragment>
  );
};
export default DomainDetail;
