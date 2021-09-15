/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { CommonTable } from 'racc';
import { CommonTableProps } from 'racc/dist/common-table/CommonTable';
import styles from './index.less';
import { Row } from 'antd';
interface Props extends CommonTableProps {}
const CustomTable: React.FC<Props> = props => {
  return (
    <CommonTable
      bordered={false}
      size="small"
      {...props}
      className={styles.customTable}
      locale={{
        emptyText: (
          <div>
            <img width={144} src={require('./../../assets/emptyData.png')} />
            <p
              style={{
                fontSize: 20,
                color: 'var(--Netural-14)',
                fontWeight: 600,
                marginTop: 32
              }}
            >
              暂无数据
            </p>
          </div>
        )
      }}
    />
  );
};
export default CustomTable;
