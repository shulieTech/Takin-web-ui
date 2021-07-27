import { Affix, Col, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  title: string | React.ReactNode;
  extra?: React.ReactNode;
}
const FixedTopLayout: React.FC<Props> = props => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <Row type="flex" justify="space-between" className={styles.fixedTopWrap}>
        <Col className={styles.fixedTopTitle}>{props.title}</Col>
        <Col>{props.extra}</Col>
      </Row>
      <div style={{ marginTop: 54, height: 'calc(100% - 54px)' }}>
        {props.children}
      </div>
    </div>
  );
};
export default FixedTopLayout;
