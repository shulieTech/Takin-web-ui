import { Col, Row, Statistic } from 'antd';
import React from 'react';
import Loading from 'src/common/loading';
import Link from 'umi/link';
import styles from './../index.less';
interface Props {
  data?: any;
}
const MaxTpsNumberAndMaxPressTime: React.FC<Props> = props => {
  const { data } = props;
  const menuAuthority: any =
    localStorage.getItem('trowebUserResource') &&
    JSON.parse(localStorage.getItem('trowebUserResource'));
  if (data) {
    return (
      <Row type="flex" align="middle" style={{ marginLeft: 16 }}>
        {(
          <Col span={12} className={styles.borderWithPadding}>
            <div
              className={styles.border}
              style={{
                // display:
                //   menuAuthority?.appManage ? 'none' : 'block'
              }}
            >
              <span className={styles.blueline} />
              <span className={`${styles.boldTitle}`}>最大并发数量</span>
              <p className={styles.number}>
                <Statistic value={data?.maxVu} precision={0} />
              </p>
            </div>
          </Col>
        )}
        { (
          <Col span={12} className={styles.borderWithPadding}>
           
            <div
              className={styles.border}
              // style={{
              //   display:
              //     menuAuthority?.appManage ? 'none' : 'block'
              // }}
            >
              <span className={styles.blueline} />
              <span className={`${styles.boldTitle}`}>最大压测时长</span>
              <p className={styles.number}>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#000' }}>{data?.packageType === 0 ? '无限制' : data?.packageType === 1 ? '60分钟' : '-'}</span>
              </p>
            </div>
          </Col>
        )}
      </Row>
    );
  }
  return <Loading />;
};
export default MaxTpsNumberAndMaxPressTime;
