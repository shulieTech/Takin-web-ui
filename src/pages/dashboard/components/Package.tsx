import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row } from 'antd';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const Package: React.FC<Props> = props => {
  const { data } = props;

  const txt =
    data === '生效中'
      ? '生效中'
      : data === '已失效'
      ? '已失效'
      : '-';

  if (data) {
    return (
      <div className={styles.border}>
        <Row type="flex" align="middle">
          <span className={styles.blueline} />
          <span className={`${styles.boldTitle}`}>套餐余量</span>
        </Row>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#000', marginTop: 8 }}>到期时间:</div>
        <div style={{ fontSize: 20, fontWeight: 500, color: '#000' }}>2023-03-21 11:20:23</div>
      </div>
    );
  }
  return <Loading />;
};
export default Package;
