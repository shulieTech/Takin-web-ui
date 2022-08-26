import React, { useState, useEffect, createContext, useContext } from 'react';
import { Layout } from 'antd';
import Introduce from './components/Introduce';
import List from './components/List';

export const PrepareContext = createContext(null);

export default (props) => {
  const [currentLink, setCurrentLink] = useState(null);
  return (
    <PrepareContext.Provider value={{ currentLink, setCurrentLink }}>
      <Layout>
        <Layout.Sider
          width={260}
          theme="light"
          style={{ borderRight: '1px solid var(--Netural-100, #EEF0F2)' }}
        >
          <List />
        </Layout.Sider>
        <Layout.Content style={{ background: '#fff' }}>
          {!currentLink ? <Introduce /> : <div>11</div>}
        </Layout.Content>
      </Layout>
    </PrepareContext.Provider>
  );
};
