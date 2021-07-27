import React, { Fragment } from 'react';
import { Tabs } from 'antd';

import styles from './../index.less';
import AccountManage from './AccountManage';
import FunctionPermission from './FunctionPermission';
import DataPermission from './DataPermission';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const AuthorityConfigTabs: React.FC<Props> = props => {
  const { state, setState } = props;
  const tabsData = [
    {
      title: '账号管理',
      tabNode: <AccountManage state={state} setState={setState} />
    },
    {
      title: '功能权限',
      tabNode: <FunctionPermission state={state} setState={setState} />
    },
    {
      title: '数据权限',
      tabNode: <DataPermission state={state} setState={setState} />
    }
  ];

  return (
    <div style={{ padding: '0px 16px', height: '100%' }}>
      <Tabs
        destroyInactiveTabPane
        defaultActiveKey="0"
        style={{ fontSize: '16px', height: '100%' }}
      >
        {tabsData.map((item, index) => {
          return (
            <Tabs.TabPane
              style={{ height: '100%' }}
              tab={item.title}
              key={`${index}`}
            >
              {item.tabNode}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};
export default AuthorityConfigTabs;
