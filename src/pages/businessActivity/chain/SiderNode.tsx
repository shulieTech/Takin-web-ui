/**
 * @name
 * @author MingShined
 */
import React, { useContext } from 'react';
import { BusinessActivityDetailsContext } from '../detailsPage';
import styles from '../index.less';
import SiderBasicInfo from './SiderBasicInfo';
import SiderCollectInfo from './SiderCollectInfo';
interface Props {}
const SiderNode: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const isShow = state.details.topology.exceptions.length;
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 0px 12px 0px rgba(177, 192, 192, 0.45)'
      }}
    >
      <div className={styles.siderBg} style={{ marginBottom: isShow && 8 }}>
        <SiderCollectInfo />
      </div>
      <div className={styles.siderBg} style={{ flex: 1, padding: 16 }}>
        <SiderBasicInfo />
      </div>
    </div>
  );
};
export default SiderNode;
