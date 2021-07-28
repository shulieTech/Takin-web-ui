import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  dataSource?: {
    name: string;
    value: string;
    color?: string;
    extra?: string;
  }[];
  title: string | React.ReactNode;
  img?: React.ReactNode;
  description?: string | React.ReactNode;
  extra?: React.ReactNode;
}
const CustomDetailHeader: React.FC<Props> = props => {
  const { title, dataSource, description, extra } = props;
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <Col>{props.img}</Col>
      <Col style={{ marginLeft: 16 }}>
        <div className={styles.title}>{title}</div>
        {description && <p className={styles.description}>{description}</p>}
        {dataSource && (
          <div>
            {dataSource.map((item, key) => {
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
        )}
      </Col>
      {extra && <div style={{ position: 'absolute', right: 0 }}>{extra}</div>}
    </div>
  );
};
export default CustomDetailHeader;
