/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { Button } from 'antd';
import styles from './../index.less';

interface Props {
  state?: any;
  setState?: (value) => void;
}
declare var serverUrl: string;
const AppTrialTableAction: React.FC<Props> = props => {
  return (
    <Fragment>
      <span className={styles.tip}>体验模式暂时只支持3个应用</span>
      <Button type="primary">
        <a href={`${serverUrl}/poc/agent/guide/doc`} download>
          下载体验文档
        </a>
      </Button>
    </Fragment>
  );
};
export default AppTrialTableAction;
