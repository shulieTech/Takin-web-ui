import { Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';
interface MainPageLayoutProps {
  title?: string | React.ReactNode;
  extra?: string | React.ReactNode;
}
const MainPageLayout: React.FC<MainPageLayoutProps> = props => {
  return (
    <div className="pd-2x">
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <h1 className={styles.title}>{props.title}</h1>
        </Col>
        <Col>{props.extra}</Col>
      </Row>
      {props.children}
    </div>
  );
};
export default MainPageLayout;
