/**
 * @name
 * @author MingShined
 */
import { Drawer } from 'antd';
import React, { useContext } from 'react';
import { BusinessActivityDetailsContext } from '../detailsPage';
import styles from '../index.less';
import { RenderNodeInfoByType } from './RenderNodeInfoByType';
interface Props {}
const NodeInfoDrawer: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  return (
    <Drawer
      maskClosable
      onClose={() => setState({ nodeVisible: false })}
      width={640}
      style={{ position: 'absolute', height: 'calc(100% - 16px)', top: 8, right: state.nodeVisible ? 8 : 0 }}
      placement="right"
      className={styles.nodeInfoDrawer}
      // drawerStyle={{ margin: 8 }}
      // maskStyle={{ background: 'none' }}
      mask={false}
      visible={state.nodeVisible}
      getContainer={document.getElementById('activity_detail')}
      destroyOnClose={true}
      closable={false}
    >
      {RenderNodeInfoByType(state, setState)}
    </Drawer>
  );
};
export default NodeInfoDrawer;
