/**
 *
 * @name 处理中
 * @author Xunhuan
 *
 */

import React, { Fragment } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

interface Props {}

const ProcessComponent: React.FC<Props> = props => {
  return (
    <Fragment>
      <div className={styles.process}>
        <div className={styles.processItem}>
          <Icon type="audit" />
          <div className={styles.processTit}>消息校验中</div>
        </div>
        <div className={styles.processItem}>
          <Icon type="folder" />
          <div className={styles.processTit}>注册商业能力</div>
        </div>
        <div className={styles.processItem}>
          <Icon type="github" />
          <div className={styles.processTit}>创建GIT</div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessComponent;
