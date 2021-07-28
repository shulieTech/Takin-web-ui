/**
 * @name 表格内多行垂直展示
 * @author chuxu
 */

import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';

interface Props {
  dataSource: {
    label: string | React.ReactNode; // 标题
    value: string | React.ReactNode; // 内容
  }[];
  labelWidth: number;
}
const TableMultiRows: React.FC<Props> = props => {
  const { dataSource, labelWidth } = props;
  return (
    <Row type="flex">
      {dataSource &&
        dataSource.map((item, k) => {
          return (
            <Col span={24} key={k}>
              <span className={styles.label} style={{ width: labelWidth }}>
                {item.label || '-'}
              </span>
              <span className={styles.value}>{item.value || '-'}</span>
            </Col>
          );
        })}
    </Row>
  );
};
export default TableMultiRows;
