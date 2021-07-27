import React, { Fragment } from 'react';
import { Row, Col, Statistic, Icon, Tooltip } from 'antd';
import styles from './../index.less';
interface Props {
  detailInfo?: any;
}
const FlowAccountSummary: React.FC<Props> = props => {
  const { detailInfo } = props;
  return (
    <Row
      type="flex"
      style={{
        padding: '24px 40px',
        background: 'rgba(244,246,250,1)',
        borderRadius: 6,
        position: 'relative'
      }}
    >
      <Col style={{ marginRight: 53 }}>
        <p className={styles.title}>可用压测流量</p>
        <p className={styles.content}>
          <Statistic value={detailInfo.balance} precision={2} suffix="vum" />
        </p>
      </Col>
      <Col>
        <p className={styles.title}>冻结流量</p>
        <p className={styles.content}>
          <Statistic
            value={detailInfo.lockBalance}
            precision={2}
            suffix="vum"
          />
        </p>
      </Col>
      <span className={styles.rule}>
        <Tooltip
          title={
            <div className={styles.tooltipTitle}>
              <p>计费说明：</p>
              <p>
                消耗流量=平均并发（VU）*实际压测时长（M），压测时长小于1分钟时，按1分钟计费。
              </p>
              <p>余额不足时无法发起压测，请联系数列人员进行充值。</p>
            </div>}
          placement="bottom"
          overlayStyle={{ width: 183 }}
          style={{ backgroundColor: 'rgba(15,16,17,0.5)' }}
        >
          <Icon type="question-circle" style={{ marginRight: 8 }} />
        </Tooltip>
        计费规则
      </span>
    </Row>
  );
};
export default FlowAccountSummary;
