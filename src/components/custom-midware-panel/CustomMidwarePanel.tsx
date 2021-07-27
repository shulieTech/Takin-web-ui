import React, { Fragment } from 'react';
import { Collapse, Icon } from 'antd';
import styles from './index.less';

interface Props {
  title: any;
}
const CustomMidwarePanel: React.FC<Props> = props => {
  const { Panel } = Collapse;
  return (
    <Collapse
      defaultActiveKey={['2']}
      expandIconPosition="right"
      style={{ marginTop: 16 }}
      expandIcon={({ isActive }) => (
        <Icon type="caret-right" rotate={isActive ? 90 : -90} />
      )}
    >
      <Panel
        header={<p className={styles.panelTitle}>{props.title}</p>}
        key="2"
      >
        {props.children}
      </Panel>
    </Collapse>
  );
};
export default CustomMidwarePanel;
