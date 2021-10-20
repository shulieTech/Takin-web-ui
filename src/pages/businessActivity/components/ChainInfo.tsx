/**
 * @name
 * @author MingShined
 */
import { CommonTabs } from 'racc';
import React, { Fragment } from 'react';
import Header from 'src/pages/linkMark/components/Header';
import ChainDetails from './ChainDetails';
import ChainGraph from './ChainGraph';

interface Props {}
const ChainInfo: React.FC<Props> = props => {
  const dataSource = [
    {
      tab: '链路拓扑',
      component: <ChainGraph />
    },
    {
      tab: '链路详情',
      component: <ChainDetails />
    },
    // {
    //   tab: '中间件列表',
    //   component: <MiddlewareList />
    // },
  ];
  return (
    <Fragment>
      <Header title="链路信息" />
      <CommonTabs
        dataSource={dataSource}
        tabsProps={{ defaultActiveKey: '0' }}
        onRender={(item, index) => (
          <CommonTabs.TabPane key={index.toString()} tab={item.tab}>
            {item.component}
          </CommonTabs.TabPane>
        )}
      />
    </Fragment>
  );
};
export default ChainInfo;
