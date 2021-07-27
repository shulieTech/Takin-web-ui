import { Col, Row, Statistic } from 'antd';
import React from 'react';
import Loading from 'src/common/loading';
import Link from 'umi/link';
import styles from './../index.less';
interface Props {
  data?: any;
}
const AppAndFlow: React.FC<Props> = props => {
  const { data } = props;
  if (data) {
    return (
      <Row type="flex" align="middle" style={{ marginLeft: 16 }}>
        {(data.applicationNum || data.applicationNum === 0) && (
          <Col span={12} className={styles.borderWithPadding}>
            <Link to="/appManage">
              <div className={styles.border}>
                <span className={styles.blueline} />
                <span className={`${styles.boldTitle}`}>接入应用</span>
                <p className={styles.number}>
                  <Statistic value={data.applicationNum} precision={0} />
                </p>
              </div>
            </Link>
          </Col>
        )}
        {(data.accessErrorNum || data.accessErrorNum === 0) && (
          <Col span={12} className={styles.borderWithPadding}>
            <Link to="/appManage?accessStatus=3">
              <div className={styles.border}>
                <span className={styles.blueline} />
                <span className={`${styles.boldTitle}`}>异常应用</span>
                <p className={styles.number}>
                  <Statistic
                    valueStyle={{ color: 'var(--FunctionalError-500)' }}
                    value={data.accessErrorNum}
                    precision={0}
                  />
                </p>
              </div>
            </Link>
          </Col>
        )}
      </Row>
    );
  }
  return <Loading />;
};
export default AppAndFlow;
