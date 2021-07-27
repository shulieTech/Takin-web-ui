import React, { Fragment } from 'react';
import styles from './../index.less';
interface Props {}
const Blank: React.FC<Props> = props => {
  return <div className={styles.blank} />;
};
export default Blank;
