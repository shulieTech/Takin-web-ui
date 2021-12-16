/**
 * @author chuxu
 */
import React, { Fragment, useContext, useEffect } from 'react';
import styles from './../index.less';
import customStyles from './../../../../custom.less';
import { BusinessFlowContext } from '../indexPage';
import BusinessFlowSearchAndTable from './BusinessFlowSearchAndTable';
interface Props {}

const BusinessFlowBottom: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessFlowContext);

  return (
    <div
      className={styles.borders}
      style={{
        marginTop: 16,
        height: 'calc(100% - 112px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          height: 'calc(100% - 35px)',
          position: 'relative',
          overflow: 'scroll'
        }}
      >
        <BusinessFlowSearchAndTable />
      </div>
    </div>
  );
};
export default BusinessFlowBottom;
