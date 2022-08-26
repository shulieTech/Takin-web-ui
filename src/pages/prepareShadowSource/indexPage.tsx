import React, { useState, useEffect, createContext, useContext } from 'react';
import { Layout } from 'antd';
import Introduce from './components/Introduce';
import List from './components/List';

export const PrepareContext = createContext({
  currentId: undefined,
});

export default (props) => {
  const state = useContext(PrepareContext);
  return (
    <PrepareContext.Provider value={{ currentId: undefined }}>
      <Layout>
        <Layout.Sider
          width={260}
          theme="light"
          style={{ borderRight: '1px solid var(--Netural-100, #EEF0F2)' }}
        >
          <List/>
        </Layout.Sider>
        <Layout.Content style={{ background: '#fff' }}>
          {!state.currentId ? <Introduce /> : <div>11</div>}
        </Layout.Content>
      </Layout>
    </PrepareContext.Provider>
  );
};
