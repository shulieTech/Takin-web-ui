import React, { useState, useEffect, createContext } from 'react';
import { Layout } from 'antd';
import SenceList from './components/List';
import EditSence from './components/Edit';
import IntroduceSence from './components/Introduce';

interface Props {}
export const SenceContext = createContext(null);

const TestByInterface: React.FC<Props> = (props) => {
  const id = props?.location?.query?.id;

  const [currentSence, setCurrentSence] = useState(id ? { id } : null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [editSaveKey, setEditSaveKey] = useState(0);

  return (
    <SenceContext.Provider
      value={{
        currentSence,
        setCurrentSence,
        hasUnsaved,
        setHasUnsaved,
        listRefreshKey,
        setListRefreshKey,
        editSaveKey,
        setEditSaveKey,
      }}
    >
      <Layout>
        <Layout.Sider
          width={287}
          theme="light"
          style={{
            borderRight: '1px solid var(--Netural-100, #EEF0F2)',
          }}
        >
          <SenceList
            currentSence={currentSence}
            setCurrentSence={setCurrentSence}
          />
        </Layout.Sider>
        <Layout.Content
          style={{
            background: '#fff',
          }}
        >
          {currentSence ? (
            <EditSence currentSence={currentSence} />
          ) : (
            <IntroduceSence onCreate={() => setCurrentSence({})} />
          )}
        </Layout.Content>
      </Layout>
    </SenceContext.Provider>
  );
};

export default TestByInterface;
