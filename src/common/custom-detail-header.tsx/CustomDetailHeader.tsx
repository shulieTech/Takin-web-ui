import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  dataSource: {
    name: string;
    value: string;
    color?: string;
    extra?: string;
  }[];
  title: string | React.ReactNode;
  img?: React.ReactNode;
}
const CustomDetailHeader: React.FC<Props> = props => {
  const { title, dataSource } = props;
  return (
    <Row type="flex">
      <Col>{props.img}</Col>
      <Col style={{ marginLeft: 16 }}>
        <div className={styles.title}>{title}</div>
        <div>
          {dataSource &&
            dataSource.map((item, key) => {
              return (
                <p className={styles.details} key={key}>
                  <span className={styles.detailsLabel}>{item.name}：</span>
                  <span
                    className={styles.detailsValue}
                    style={{ color: item.color }}
                  >
                    {item.value}
                    {item.extra ? (
                      <span style={{ color: '#595959', marginLeft: 4 }}>
                        {item.extra}
                      </span>
                    ) : null}
                  </span>
                </p>
              );
            })}
        </div>
      </Col>
    </Row>
  );
};
export default CustomDetailHeader;
