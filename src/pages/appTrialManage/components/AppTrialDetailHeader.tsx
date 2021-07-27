/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import DetailHeader from 'src/common/detail-header';

interface Props {
  id?: string | number;
  detailData?: any;
  state?: any;
  setState?: (value) => void;
}
const AppTrialDetailHeader: React.FC<Props> = props => {
  const { detailData } = props;

  const leftData = {
    label: '应用名称',
    value: detailData && detailData.applicationName,
    isTooltip: true
  };
  const rightData = [
    { label: '最后修改时间', value: detailData && detailData.updateTime }
  ];
  return <DetailHeader leftWrapData={leftData} rightWrapData={rightData} />;
};
export default AppTrialDetailHeader;
