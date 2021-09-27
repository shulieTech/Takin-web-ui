/**
 * @name 表格内双行展示，用于列表内双行展示
 * @author chuxu
 */

import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';

interface Props {
  title?: string | React.ReactNode; // 首行标题
  icon?: React.ReactNode; // 左侧图标
  secondLineContent?: {
    label?: string | React.ReactNode; // 标题
    value?: string | React.ReactNode; // 内容
    isError?: boolean;
  }[]; // 第二行内容，标题：内容
  prefix?: React.ReactNode; // 首行前缀
  suffix?: React.ReactNode; // 首行后缀
}
const TableTwoRows: React.FC<Props> = props => {
  const { icon, title, secondLineContent, prefix, suffix } = props;
  return (
    <Row type="flex" align="middle">
      {icon && <Col>{icon}</Col>}
      <Col>
        <Row>
          <Col className={styles.title}>
            {prefix}
            {title || '-'}
            {suffix}
          </Col>
          <Col>
            <Row type="flex">
              {secondLineContent &&
                secondLineContent.map((item, k) => {
                  return (
                    <Col key={k} style={{ marginLeft: k > 0 ? 24 : 0 }}>
                      <span className={styles.label}>{item.label || '-'}</span>
                      <span
                        className={
                          item.isError ? styles.errorValue : styles.value
                        }
                      >
                        {item.value || '-'}
                      </span>
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
