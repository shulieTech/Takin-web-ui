import React, { Fragment } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

interface Props {
  defaultActiveKey?: string;
}
const DetailTabs: React.FC<Props> = props => {
  return (
    <Fragment>
      <div className={styles.detailTabs}>
        <Tabs
          animated={false}
          tabBarGutter={2}
          defaultActiveKey={props.defaultActiveKey}
        >
          {props.children}
        </Tabs>
      </div>
    </Fragment>
  );
};
export default DetailTabs;
