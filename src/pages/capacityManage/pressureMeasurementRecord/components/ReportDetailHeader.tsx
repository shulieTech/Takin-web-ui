/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { Row, Col, Divider, Badge } from 'antd';

import styles from './../index.less';
import DetailHeader from 'src/common/detail-header';
interface Props {
  detailData?: any;
}
const ReportDetailHeader: React.FC<Props> = props => {
  const { detailData } = props;
  const leftData = {
    label: detailData && (
      <Badge
        className={styles.popMsg}
        color={
          detailData.status === 1
            ? '#11BBD5'
            : detailData.status === 0
            ? '#f50'
            : '-'
        }
        text={
          detailData.status === 1
            ? '压测通过'
            : detailData.status === 0
            ? '压测不通过'
            : '-'
        }
      />
    ),
    value: detailData && detailData.extName
  };
  const rightData = [
    { label: '任务名称', value: detailData && detailData.a },
    { label: '压测时长', value: detailData && detailData.a },
    { label: '压测开始时间', value: detailData && detailData.a },
    { label: '压测结束时间', value: detailData && detailData.a }
  ];
  return <DetailHeader leftWrapData={leftData} rightWrapData={rightData} />;
};
export default ReportDetailHeader;
