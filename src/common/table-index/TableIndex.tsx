/**
 * @name 表格内序号、ID等
 * @name chuxu
 */

import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  text: string | number;
}
const TableIndex: React.FC<Props> = props => {
  return <span className={styles.text}>{props.text}</span>;
};
export default TableIndex;
