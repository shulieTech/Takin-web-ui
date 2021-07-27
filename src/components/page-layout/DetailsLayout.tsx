/**
 * @name
 * @author MingShined
 */
import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
interface DetailsLayoutProps {
  siderStyle?: React.CSSProperties;
  sider: React.ReactNode;
}
const DetailsLayout: React.FC<DetailsLayoutProps> = props => {
  return (
    <Row className="flex h-100p">
      <Col style={props.siderStyle} className={styles.detailsSider}>
        {props.sider}
      </Col>
      <Col className="flex-1" style={{ padding: '8px 16px' }}>
        {props.children}
      </Col>
    </Row>
  );
};
export default DetailsLayout;
