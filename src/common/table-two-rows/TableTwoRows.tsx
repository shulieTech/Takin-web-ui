import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  title?: string;
  icon?: React.ReactNode;
  content?: {
    label?: string | React.ReactNode;
    value?: string | React.ReactNode;
  }[];
  extra?: React.ReactNode;
}
const TableTwoRows: React.FC<Props> = props => {
  const { icon, title, content, extra } = props;
  return (
    <Row type="flex">
      {icon && <Col>{icon}</Col>}
      <Col>
        <Row>
          <Col className={styles.title}>
            {extra}
            {title || '-'}
          </Col>
          <Col>
            <Row type="flex">
              {content &&
                content.map((item, k) => {
                  return (
                    <Col key={k} style={{ marginLeft: k > 0 ? 24 : 0 }}>
                      <span className={styles.label}>{item.label || '-'}</span>
                      <span className={styles.value}>{item.value || '-'}</span>
                    </Col>
                  );
                })}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default TableTwoRows;
