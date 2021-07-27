/**
 * @name
 * @author chuxu
 */
import React, { Fragment, ReactNode } from 'react';
import { Row, Col, Divider, Tooltip } from 'antd';

import styles from './index.less';
interface Props {
  leftWrapData?: {
    label: string | ReactNode;
    value: string | ReactNode;
    isTooltip?: boolean;
  };
  rightWrapData?: {
    label: string | ReactNode;
    value: string | ReactNode;
    isTooltip?: boolean;
  }[];
  extra?: string | React.ReactNode;
}
const DetailHeader: React.FC<Props> = props => {
  const { leftWrapData, rightWrapData } = props;
  return (
    <Row type="flex" style={{ position: 'relative' }}>
      {leftWrapData && (
        <Col>
          <p className={styles.label}>{leftWrapData.label}</p>
          {leftWrapData.isTooltip ? (
            <Tooltip title={leftWrapData.value}>
              <p className={styles.leftValue}>{leftWrapData.value || '--'}</p>
            </Tooltip>
          ) : (
            <p className={styles.leftValue}>{leftWrapData.value || '--'}</p>
          )}
        </Col>
      )}
      {leftWrapData && rightWrapData && (
        <Col>
          <Divider
            type="vertical"
            style={{ height: '80%', marginLeft: 40, marginRight: 40 }}
          />
        </Col>
      )}
      {rightWrapData && (
        <Col>
          <Row type="flex">
            {rightWrapData.map((item, k) => {
              return (
                <Col
                  key={k}
                  style={{
                    marginTop: 10,
                    marginRight: 40,
                    maxWidth: 240,
                    maxHeight: 40,
                    overflow: 'hidden'
                  }}
                >
                  <p className={styles.label}>{item.label}</p>
                  {/* <Tooltip title={item.value}> */}
                  <p className={styles.rightValue}>{item.value || '--'}</p>
                  {/* </Tooltip> */}
                </Col>
              );
            })}
          </Row>
        </Col>
      )}
      {props.extra}
    </Row>
  );
};
export default DetailHeader;
