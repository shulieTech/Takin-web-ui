import React, { Fragment, ReactNode } from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import { Collapse, Empty, Skeleton } from 'antd';
import styles from './index.less';
interface Props {
  dataSource: any[];
  extra?: any | ReactNode;
  style?: React.CSSProperties;
}
const CustomCollapse: React.FC<Props> = props => {
  const { dataSource } = props;
  const { Panel } = Collapse;

  const customPanelStyle = {
    background: '#ffffff',
    borderRadius: 2,
    marginBottom: 8,
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  };
  return dataSource && dataSource.length > 0 ? (
    <div className={styles.collapseWrap} style={props.style || {}}>
      <Collapse
        defaultActiveKey={['0']}
        //   expandIconPosition="right"
        bordered={false}
      >
        {dataSource.map((item, k) => {
          return (
            <Panel
              style={customPanelStyle}
              header={
                <div style={{ position: 'relative' }}>
                  <div className={styles.title}>{item.title}</div>
                  <p className={styles.subTitle}>{item.subTitle}</p>
                  {props.extra}
                </div>}
              key={k}
            >
              {props.children}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  ) : (
    <Empty />
  );
};
export default CustomCollapse;
