/**
 * @name
 * @author MingShined
 */
import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from './index.less';
import { DescriptCardItemProps } from './type';

const DescriptCardItem: React.FC<DescriptCardItemProps> = props => {
  const dataSource = props.dataSource;
  return (
    <Card bodyStyle={{ padding: 0 }} extra={props.extra}>
      <h2 className={styles.title} style={{ padding: '8px 12px' }}>
        {props.header}
      </h2>
      {props.columns.map((item, index) => (
        <Row
          className={styles.cardItem}
          type="flex"
          key={item.dataIndex}
          style={{
            borderBottom: index === props.columns.length - 1 && 'none'
          }}
        >
          <Col className={styles.label}>{item.title}</Col>
          <Col className={styles.text}>
            {dataSource &&
            (dataSource[item.dataIndex] ||
              dataSource[item.dataIndex] === 0 ||
              dataSource[item.dataIndex] === false)
              ? item.render
                ? item.render(dataSource[item.dataIndex], dataSource)
                : dataSource[item.dataIndex]
              : props.emptyNode}
          </Col>
        </Row>
      ))}
    </Card>
  );
};
export default DescriptCardItem;

DescriptCardItem.defaultProps = {
  emptyNode: '-'
};
