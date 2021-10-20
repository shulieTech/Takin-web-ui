import { Col, Row, Typography } from 'antd';
import React, { Fragment } from 'react';
import styles from './../index.less';
interface Props {
  time: string;
  version: string;
  feature: string;
}
const { Paragraph } = Typography;
const AgentVersionWrap: React.FC<Props> = props => {
  return (
    <Row type="flex" className={styles.agentVersionWrap}>
      <Col
        style={{
          display: 'inline-block',
          width: 56,
          height: 56,
          backgroundColor: 'var(--BrandPrimary-500)',
          borderRadius: 8,
          textAlign: 'center',
          lineHeight: '56px'
        }}
      >
        <img src={require('./../../../assets/app_access_redis_icon.png')} />
      </Col>
      <Col className={styles.versionWrap}>
        <p className={styles.version}>{props.version}</p>
        <p style={{ lineHeight: '22px' }}>
          <span style={{ color: 'var(--Netural-10)' }}>更新时间</span>：
          <span style={{ color: 'var(--Netural-14)', fontWeight: 600 }}>
            {props.time}
          </span>
        </p>
      </Col>
      <Col style={{ width: 200, marginLeft: 100 }}>
        <p
          style={{
            color: 'var(--Netural-14)',
            fontWeight: 600,
            marginBottom: 8
          }}
        >
          版本特性
        </p>
        <Paragraph ellipsis={{ rows: 1, expandable: true }}>
          {props.feature}
        </Paragraph>
      </Col>
    </Row>
  );
};
export default AgentVersionWrap;
