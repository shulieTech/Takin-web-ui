/**
 * @name
 * @author MingShined
 */
import React, { Fragment } from 'react';
import { CommonTable } from 'racc';
import { CommonTableProps } from 'racc/dist/common-table/CommonTable';
import styles from './index.less';
interface Props extends CommonTableProps {}
const CustomTable: React.FC<Props> = props => {
  return (
    <CommonTable
      bordered={false}
      size="small"
      {...props}
      className={styles.customTable}
    />
  );
};
export default CustomTable;
