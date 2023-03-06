import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row } from 'antd';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const PackageStatus: React.FC<Props> = props => {
  const { data } = props;

  const txt =
    data?.packageStatus === 0
      ? '开通中'
      : data?.packageStatus === 1
      ? '开通成功' : data?.packageStatus === 2
      ? '停用或退订' : data?.packageStatus === 3
  ? '失效' : '-';

  if (data) {
    return (
      <div className={styles.border}>
        <Row type="flex" align="middle">
          <span className={styles.blueline} />
          <span className={`${styles.boldTitle}`}>套餐状态</span>
        </Row>
        <p className={styles.switchStatus}>{txt}</p>
      </div>
    );
  }
  return <Loading />;
};
export default PackageStatus;
