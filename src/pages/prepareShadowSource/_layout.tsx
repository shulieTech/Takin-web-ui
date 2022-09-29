import React, { useState, useEffect, createContext, useContext } from 'react';
import { Layout } from 'antd';
import List from './components/List';
import EditLinkModal from './modals/EditLinkModal';

export const PrepareContext = createContext(null);

export default (props) => {
  const [prepareState, setFullPrepareState] = useState({
    currentLink: null,
    editLink: undefined,
    refreshListKey: 0,
    stepStatusRefreshKey: 0,
    alertInfo: undefined,
    helpInfo: {
      show: true,
      text: undefined,
      checkTime: undefined,
      userName: undefined
    }
  });
  const [collapsed, setCollapsed] = useState(false);

  const setPrepareState = (particalState) => {
    setFullPrepareState({
      ...prepareState,
      ...particalState,
    });
  };
  return (
    <PrepareContext.Provider value={{ prepareState, setPrepareState }}>
      <Layout>
        <Layout.Sider
          collapsed={collapsed}
          collapsedWidth={40}
          width={260}
          theme="light"
          style={{ borderRight: '1px solid var(--Netural-100, #EEF0F2)' }}
        >
          <List collapsed={collapsed} setCollapsed={setCollapsed}/>
        </Layout.Sider>
        <Layout.Content style={{ background: '#fff' }}>
          {props.children}
        </Layout.Content>
      </Layout>
      <EditLinkModal
        detail={prepareState.editLink}
        okCallback={() => {
          setPrepareState({
            editLink: undefined,
            stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
            refreshListKey: prepareState.refreshListKey + 1,
          });
        }}
        cancelCallback={() => setPrepareState({ editLink: undefined })}
      />
    </PrepareContext.Provider>
  );
};
