import { Card, Col, Icon, Popover, Row, Typography } from 'antd';
import React, { Fragment } from 'react';
import styles from './../index.less';
interface Props {
  dataSource: any[];
  title?: string | React.ReactNode;
  renderNode?: React.ReactNode;
}
const InfoCard: React.FC<Props> = props => {
  const { dataSource, title } = props;

  return (
    <div className={styles.infoCardWrap}>
      <Card>
        {title && <div className={styles.title}>{title}</div>}
        {dataSource &&
          dataSource.map((item, key) => {
            return (
              <Row
                type="flex"
                justify="start"
                key={key}
                className={styles.contentItem}
              >
                <Col className={styles.labelItem}>{item.label}</Col>
                <Col className={styles.valueItem}>{item.value}</Col>

                <Popover content={props.renderNode} trigger="click">
                  <Icon
                    style={{ position: 'absolute', right: 0, top: 15 }}
                    type="caret-down"
                  />
                </Popover>
              </Row>
            );
          })}
      </Card>
    </div>
  );
};
export default InfoCard;
