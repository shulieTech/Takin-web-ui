import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Icon, Button } from 'antd';
import tenantCode from './service';
interface Props { }

const EnvHeader: React.FC<Props> = (props) => {
  const [envList, setEnvList] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    queryTenantList();
  }, []);

  const queryTenantList = async () => {
    const {
      headers,
      data: { success, data }
    } = await tenantCode.tenant({
      tenantCode: localStorage.getItem('tenant_code')
    });
    const takinAuthority = headers['takin-authority'];
    if (takinAuthority === 'false') {
      localStorage.setItem('tenant_code', data[0].tenantCode);
      const arr = data[0].envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      localStorage.setItem('env_code', arr[0].envCode);
    }
    if (success) {
      setTenantList(data);
      setEnvList(data[0].envs);
      const arr = data[0].envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      localStorage.setItem('env_code', arr[0].envCode);
      setDesc(arr[0].desc);
    }
  };

  const changeTenant = async (code) => {
    const {
      data: { success, data }
    } = await tenantCode.tenantSwitch({
      targetTenantCode: code
    });
    if (success) {
      localStorage.setItem('tenant_code', code);
      setEnvList(data.envs);
      const arr = data.envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      localStorage.setItem('env_code', arr[0].envCode);
      setDesc(arr[0].desc);
      if (window.location.hash === '#/dashboard') {
        window.location.reload();
      } else {
        window.location.hash = '#/dashboard';
      }
    }
  };

  const changeCode = async (code, descs) => {
    const {
      data: { success, data }
    } = await tenantCode.envSwitch({
      targetEnvCode: code
    });
    if (success) {
      setDesc(descs);
      localStorage.setItem('env_code', code);
      if (window.location.hash === '#/dashboard') {
        window.location.reload();
      } else {
        window.location.hash = '#/dashboard';
      }
    }
  };
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
        {desc}
      </span>
      <Button.Group>
        <Dropdown
          overlay={
            <Menu>
              {tenantList.map((x) => (
                <Menu.Item
                  key={x.tenantId}
                  onClick={() => changeTenant(x.tenantCode)}
                >
                  {x.tenantName}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button type="primary">
            租户：
            {localStorage.getItem('tenant_code')}
            <Icon type="down" />
          </Button>
        </Dropdown>
        <Dropdown
          overlay={
            <Menu>
              {envList.map((x, ind) => (
                <Menu.Item
                  key={x.ind}
                  onClick={() => changeCode(x.envCode, x.desc)}
                >
                  {x.envName}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button type="primary">
            环境：
            {localStorage.getItem('env_code')}
            <Icon type="down" />
          </Button>
        </Dropdown>
      </Button.Group>
    </div>
  );
};

export default EnvHeader;
