import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row, Statistic, Col, Button } from 'antd';
import Link from 'umi/link';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const FlowBalance: React.FC<Props> = props => {
  const { data } = props;

  if (data) {
    return (
      <div className={styles.border}>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <span className={styles.blueline} />
            <span className={`${styles.boldTitle}`}>流量余额</span>
          </Col>
          <Col>
            <Link to="/flowAccount" className={styles.more}>
              明细 <Icon type="right" />
            </Link>
          </Col>
        </Row>
        <p className={styles.flowNum}>
          <span className={styles.number}>
            <Statistic
              value={data.balance || data.balance === 0 ? data.balance : '-'}
              precision={2}
            />
          </span>
          <span style={{ marginLeft: 8 }}>vum</span>
        </p>
        <Row type="flex" align="middle" style={{ marginTop: 16 }}>
          <Col>
            <Tooltip title="请联系数列对接人员充值" placement="bottom">
              <Button type="primary">充值</Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip
              placement="bottom"
              title={
                <div>
                  <p>计费说明：</p>
                  <p>
                    消耗流量=平均并发（VU）*实际压测时长（M），压测时长小于1分钟时，按1分钟计费。
                  </p>
                  <p>余额不足时无法发起压测，请联系数列人员进行充值。</p>
                </div>
              }
            >
              <Button type="link" style={{ marginLeft: 16 }}>
                计费规则
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </div>
    );
  }
  return <Loading />;
};
export default FlowBalance;
