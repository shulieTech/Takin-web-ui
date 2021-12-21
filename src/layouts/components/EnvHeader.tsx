import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Icon, Button } from 'antd';
import { getTakinTenantAuthority } from 'src/utils/utils';
import _ from 'lodash';
import AddTenantModal from 'src/modals/AddTenantModal';
import tenantCodeService from './service';
interface Props {}
let path = '';
const EnvHeader: React.FC<Props> = props => {
  const userType: string = localStorage.getItem('troweb-role');
  const [envList, setEnvList] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (getTakinTenantAuthority() === 'true') {
      queryTenantList();
    }
  }, []);

  const queryTenantList = async () => {
    const {
      data: { success, data }
    } = await tenantCodeService.tenant({
      tenantCode: localStorage.getItem('tenant-code')
    });
    if (success) {
      setTenantList(data);
      const indexs = _.findIndex(data, [
        'tenantCode',
        localStorage.getItem('tenant-code')
      ]);
      setEnvList(data[indexs]?.envs);
      const arr = data[indexs]?.envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      if (localStorage.getItem('env-code') === null) {
        localStorage.setItem('env-code', arr[indexs]?.envCode);
        setDesc(arr[indexs]?.desc);
      } else {
        const ind = _.findIndex(data[indexs].envs, [
          'envCode',
          localStorage.getItem('env-code')
        ]);
        setDesc(data[indexs].envs[ind]?.desc);
      }
    }
  };

  function getPath(lists) {
    if (lists.length === 0) {
      return;
    }
    if (lists[0].type === 'Item') {
      path = lists[0].path;
    }
    [lists[0]].forEach(list => {
      if (list.children) {
        getPath(list.children);
      }
    });
    return path;
  }

  const changeTenant = async code => {
    const {
      data: { success, data }
    } = await tenantCodeService.tenantSwitch({
      targetTenantCode: code
    });
    if (success) {
      localStorage.setItem('tenant-code', code);
      setEnvList(data.envs);
      const arr = data.envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      localStorage.setItem('env-code', arr[0]?.envCode);
      setDesc(arr[0]?.desc);
      localStorage.removeItem('trowebUserResource');
      localStorage.removeItem('trowebBtnResource');
      localStorage.removeItem('trowebUserMenu');
      if (window.location.hash === '#/dashboard') {
        window.location.reload();
      } else {
        window.location.hash = '#/dashboard';
        window.location.reload();
      }
    }
  };

  const changeCode = async (code, descs) => {
    const {
      data: { success, data }
    } = await tenantCodeService.envSwitch({
      targetEnvCode: code
    });
    if (success) {
      setDesc(descs);
      localStorage.setItem('env-code', code);
      localStorage.removeItem('trowebUserResource');
      localStorage.removeItem('trowebBtnResource');
      localStorage.removeItem('trowebUserMenu');
      if (window.location.hash === '#/dashboard') {
        window.location.reload();
      } else {
        window.location.hash = '#/dashboard';
        window.location.reload();
      }
    }
  };
  const index = _.findIndex(envList, [
    'envCode',
    localStorage.getItem('env-code')
  ]);
  const indexcode = _.findIndex(tenantList, [
    'tenantCode',
    localStorage.getItem('tenant-code')
  ]);

  const isSuper: string = localStorage.getItem('isSuper');
  return (
    <div
      style={{
        lineHeight: '32px',
        padding: '0 8px',
        marginTop: 8,
        display: getTakinTenantAuthority() === 'false' ? 'none' : 'flex',
        justifyContent: 'space-between'
      }}
    >
      <span
        style={{
          marginLeft: '35%',
          color: 'var(--FunctionalAlert-900)',
          fontSize: '20px'
        }}
      >
        {desc}
      </span>

      <Button.Group>
        <Dropdown
          overlay={
            <Menu>
              {tenantList.map(x => (
                <Menu.Item
                  key={x.tenantId}
                  onClick={() => changeTenant(x.tenantCode)}
                >
                  {x.tenantNick}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button
            type="primary"
            style={{
              display: userType === '0' ? 'inline-block' : 'none'
            }}
          >
            租户：
            {tenantList[indexcode]?.tenantNick}
            <Icon type="down" />
          </Button>
        </Dropdown>

        <Dropdown
          overlay={
            <Menu>
              {envList?.map((x, ind) => (
                <Menu.Item
                  key={ind}
                  onClick={() => changeCode(x.envCode, x.desc)}
                >
                  {x.envName}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button
            type="primary"
            style={{
              borderTopLeftRadius: userType === '0' ? '0px' : '4px',
              borderBottomLeftRadius: userType === '0' ? '0px' : '4px'
            }}
          >
            环境：
            {envList[index]?.envName}
            <Icon type="down" />
          </Button>
        </Dropdown>
        {isSuper === '1' && (
          <AddTenantModal
            btnText="新增租户"
            onSuccess={() => {
              queryTenantList();
            }}
          />
        )}
      </Button.Group>
    </div>
  );
};

export default EnvHeader;
