import { Tooltip } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  color: string;
  imgName: string;
  tooltipString?: string;
  imgWidth?: number;
}
const CustomIcon: React.FC<Props> = props => {
  const { color, imgName, imgWidth } = props;

  return (
    <div className={styles.circleWrap} style={{ background: color }}>
      <img
        style={{ width: imgWidth || 15 }}
        src={require(`./../../assets/${imgName}.png`)}
      />
    </div>
  );
};
export default CustomIcon;
