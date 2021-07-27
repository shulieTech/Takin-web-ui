import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row } from 'antd';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const PressureTestSwitch: React.FC<Props> = props => {
  const { data } = props;

  const txt =
    data === 'OPENED'
      ? '已开启'
      : data === 'OPENING'
      ? '开启中'
      : data === 'CLOSING'
      ? '关闭中'
      : '已关闭';

  if (data) {
    return (
      <div className={styles.border}>
        <Row type="flex" align="middle">
          <span className={styles.blueline} />
          <span className={`${styles.boldTitle}`}>压测总开关</span>
          <Tooltip
            title="压测开关是控制系统压测配置是否生效的工具。「开启状态」系统所有压测配置生效，可保障线上安全压测；「关闭状态」所有应用接入配置失效，当前状态不能做压测任务，以免出现压测数据写入生产等风险。"
            placement="bottom"
          >
            <Icon type="question-circle" />
          </Tooltip>
        </Row>
        <p className={styles.switchStatus}>{txt}</p>
      </div>
    );
  }
  return <Loading />;
};
export default PressureTestSwitch;
