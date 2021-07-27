import { Tooltip } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  color: string;
  tooltipString?: string;
}
const ColorCircle: React.FC<Props> = props => {
  const { tooltipString, color } = props;
  if (tooltipString) {
    return (
      <Tooltip title={tooltipString}>
        <div className={styles.circleWrap} style={{ background: color }} />
      </Tooltip>
    );
  }
  return <div className={styles.circleWrap} style={{ background: color }} />;
};
export default ColorCircle;
