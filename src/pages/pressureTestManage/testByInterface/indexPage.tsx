import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import SenceList from './components/list';
import EditSence from './components/edit';
import IntroduceSence from './components/introduce';

interface Props {}

const TestByInterface: React.FC<Props> = (props) => {
  const [currentSence, setCurrentSence] = useState({});

  return (
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
  );
};

export default TestByInterface;
