import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  defaultNoLink: string | React.ReactNode;
  defaultNoMiddleWare: string | React.ReactNode;
  style?: React.CSSProperties;
}
const DefalutExtraNode: React.FC<Props> = props => {
  return (
    <div style={props.style || { marginTop: 8 }}>
      <p className={styles.noLinkInfo}>{props.defaultNoLink || '--'}</p>
      <p className={styles.noMiddleWareInfo}>
        {props.defaultNoMiddleWare || '--'}
      </p>
    </div>
  );
};
export default DefalutExtraNode;
