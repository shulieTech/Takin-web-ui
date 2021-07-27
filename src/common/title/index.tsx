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
  content?: any;
  extra?: any;
}

const TitleComponent: React.FC<Props> = props => {
  return (
    <div className={styles.title}>
      <span className={styles.fltLt}>{props.content}</span>
      <span className={styles.fltRt}>{props.extra}</span>
    </div>
  );
};

export default TitleComponent;
