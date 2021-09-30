import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Icon } from 'antd';

interface Props {}

const EnvHeader: React.FC<Props> = (props) => {
  const [envList, setEnvList] = useState([
    {
      code: 'test',
      title: '测试环境',
      desc: '',
    },
    {
      code: 'pro',
      title: '生产环境',
      desc: '当前环境为生产环境，请谨慎操作',
    },
  ]);
  const [currentEnv, setCurrentEnv] = useState(
    localStorage.getItem('current-env')
      ? JSON.parse(localStorage.getItem('current-env'))
      : envList[0]
  );

  useEffect(() => {
    localStorage['current-env'] = JSON.stringify(currentEnv);
  }, [currentEnv]);

  return (
    <div
      style={{
        lineHeight: '32px',
        padding: '0 8px',
        marginTop: 8,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <span style={{ marginRight: 16, color: '#D0D5DE' }}>
        {currentEnv.desc}
      </span>
      <Dropdown
        overlay={
          <Menu>
            {envList.map((x) => (
              <Menu.Item
                key={x.code}
                onClick={() => {
                  if (currentEnv?.code !== x.code) {
                    setCurrentEnv(x);
                    if (window.location.hash === '#/dashboard') {
                      window.location.reload();
                    } else {
                      window.location.hash = '#/dashboard';
                    }
                  }
                }}
                style={{
                  fontWeight: currentEnv.code === x.code ? 'bold' : 'normal',
                }}
              >
                {x.title}{' '}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <span
          style={{
            backgroundColor:
              currentEnv.code === 'pro'
                ? 'var(--FunctionalError-500, #ED6047)'
                : '#fff',
            color:
              currentEnv.code === 'pro'
                ? '#fff'
                : 'var(--FunctionalNetural-500, #3D485A)',
            padding: '0 12px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          环境：{currentEnv.title}
          {envList?.length > 0 && (
            <Icon type="caret-down" style={{ marginLeft: 8 }} />
          )}
        </span>
      </Dropdown>
    </div>
  );
};

export default EnvHeader;
