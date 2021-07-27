import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row, Statistic, Col, Button } from 'antd';
import Link from 'umi/link';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const QuickEntry: React.FC<Props> = props => {
  const { data } = props;
  if (data) {
    return (
      <div className={styles.border}>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <span className={styles.blueline} />
            <span className={`${styles.boldTitle}`}>快捷入口</span>
          </Col>
        </Row>
        <Row type="flex" className={styles.entryWrap}>
          {data.length > 0 &&
            data.map((item, key) => {
              return (
                <Col key={key} span={12} className={styles.iconWrap}>
                  <Link to={item.urlAddress}>
                    <Icon style={{ fontSize: 32 }} type={iconType[item.id]} />
                    <p className={styles.iconText}>{item.quickName}</p>
                  </Link>
                </Col>
              );
            })}
        </Row>
      </div>
    );
  }
  return <Loading />;
};
export default QuickEntry;

export const iconType = {
  1: 'file-add',
  2: 'bank',
  3: 'file-text',
  4: 'copy'
};
