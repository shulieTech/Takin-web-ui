import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  title?: string | React.ReactNode;
  extraNode?: React.ReactNode;
  tip?: React.ReactNode;
}
const TableTitle: React.FC<Props> = props => {
  return (
    <div className={styles.title}>
      {props.title}
      {props.tip}
      {props.extraNode}
    </div>
  );
};
export default TableTitle;
