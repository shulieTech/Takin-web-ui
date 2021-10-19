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
const NodeInfoDrawer: React.FC<Props> = (props) => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const { nodeInfo, nodeVisible } = state;
  return (
    <Drawer
      maskClosable
      onClose={() => setState({ nodeVisible: false })}
      width={560}
      style={{
        position: 'absolute',
        height: 'calc(100% - 16px)',
        top: 8,
        right: 10,
      }}
      headerStyle={{ backgroundColor: 'var(--FunctionalNetural-50, #F5F7F9)' }}
      placement="right"
      className={styles.nodeInfoDrawer}
      // drawerStyle={{ margin: 8 }}
      // maskStyle={{ background: 'none' }}
      mask={false}
      visible={nodeVisible}
      getContainer={document.getElementById('detail_graph_box')}
      destroyOnClose={true}
      title="节点详情"
      // closable={false}
    >
      {RenderNodeInfoByType(state, setState)}
    </Drawer>
  );
};
export default NodeInfoDrawer;
