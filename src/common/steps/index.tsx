/**
 *
 * @name 步骤条
 * @author Xunhuan
 *
 */

import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

interface Props {
  columnsData: any;
  active?: any;
}

const StepsComponent: React.FC<Props> = props => {
  return (
    <div className={styles.steps}>
      <Row justify={'center'}>
        {props.columnsData.map((item, index) => (
          <Col
            key={index}
            span={Math.floor(24 / (props.columnsData.length || 1))}
          >
            <div
              className={
                index === props.columnsData.length - 1
                  ? styles.stepsItemLast
                  : styles.stepsItem
              }
            >
              <span className={index === props.active - 1 ? styles.active : ''}>
                {item.label}
              </span>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StepsComponent;
