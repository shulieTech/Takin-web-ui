import React, { Fragment } from 'react';
import { Collapse, Icon } from 'antd';
import styles from './index.less';

interface Props {
  title: any;
}
const CustomLinkPanel: React.FC<Props> = props => {
  const { Panel } = Collapse;
  return (
    <Collapse
      defaultActiveKey={['1']}
      expandIconPosition="right"
      style={{ marginTop: 16, position: 'relative' }}
      expandIcon={({ isActive }) => (
        <Icon type="caret-right" rotate={isActive ? 90 : -90} />
      )}
    >
      <Panel
        className={styles.linkCard}
        header={<p className={styles.panelTitle}>{props.title}</p>}
        key="1"
      >
        {props.children}
      </Panel>
    </Collapse>
  );
};
export default CustomLinkPanel;
