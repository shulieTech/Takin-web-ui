import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Icon, Button, message, Tooltip, Modal } from 'antd';
import { getTakinTenantAuthority } from 'src/utils/utils';
import _ from 'lodash';
import AddTenantModal from 'src/modals/AddTenantModal';
import tenantCodeService from './service';
import EnvEditModal from '../modals/EnvEditModal';

interface Props {}
let path = '';
const EnvHeader: React.FC<Props> = (props) => {
  const userType: string = localStorage.getItem('troweb-role');
  const [envList, setEnvList] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [desc, setDesc] = useState('');
  const [envEdit, setEnvEdit] = useState<any>();

  useEffect(() => {
    if (getTakinTenantAuthority() === 'true') {
      queryTenantList();
    }
  }, []);

  const queryTenantList = async () => {
    const {
      data: { success, data },
    } = await tenantCodeService.tenant({
      tenantCode: localStorage.getItem('tenant-code'),
    });
    if (success) {
      setTenantList(data);
      const indexs = _.findIndex(data, [
        'tenantCode',
        localStorage.getItem('tenant-code'),
      ]);
      setEnvList(data[indexs]?.envs);
      const arr = data[indexs]?.envs.filter((item) => {
        if (item.isDefault) {
          return item;
        }
      });
      if (localStorage.getItem('env-code') === null) {
        localStorage.setItem('env-code', arr[indexs]?.envCode);
        localStorage.setItem(
          'securityCenterDomain',
          arr[indexs]?.securityCenterDomain || ''
        );
        setDesc(arr[indexs]?.desc);
      } else {
        const ind = _.findIndex(data[indexs].envs, [
          'envCode',
          localStorage.getItem('env-code'),
        ]);
        setDesc(data[indexs].envs[ind]?.desc);
        localStorage.setItem(
          'securityCenterDomain',
          data[indexs].envs[ind]?.securityCenterDomain || ''
        );
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
    [lists[0]].forEach((list) => {
      if (list.children) {
        getPath(list.children);
      }
    });
    return path;
  }

  const changeTenant = async (code) => {
    const {
      data: { success, data },
    } = await tenantCodeService.tenantSwitch({
      targetTenantCode: code,
    });
    if (success) {
      localStorage.setItem('tenant-code', code);
      setEnvList(data.envs);
      const arr = data.envs.filter((item) => {
        if (item.isDefault) {
          return item;
        }
      });
      localStorage.setItem('env-code', arr[0]?.envCode);
      localStorage.setItem(
        'securityCenterDomain',
        arr[0]?.securityCenterDomain || ''
      );
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

  const changeEnv = async (env) => {
    const { envCode: code, descs, securityCenterDomain } = env;
    const {
      data: { success, data },
    } = await tenantCodeService.envSwitch({
      targetEnvCode: code,
    });
    if (success) {
      setDesc(descs);
      localStorage.setItem('env-code', code);
      localStorage.setItem('securityCenterDomain', securityCenterDomain || '');
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
    localStorage.getItem('env-code'),
  ]);
  const indexcode = _.findIndex(tenantList, [
    'tenantCode',
    localStorage.getItem('tenant-code'),
  ]);

  const isSuper: string = localStorage.getItem('isSuper');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const setDefaultEnv = async (event, env) => {
    event.stopPropagation();
    const {
      data: { success },
    } = await tenantCodeService.setDefaultEnv({ envCode: env.envCode });
    if (success) {
      message.success('????????????');
      queryTenantList();
    }
  };

  const editEnv = async (event, env) => {
    event.stopPropagation();
    setEnvEdit(env);
  };

  const deleteEnv = (event, env) => {
    event.stopPropagation();
    if (localStorage.getItem('env-code') === env.envCode) {
      message.warn('????????????????????????');
      return;
    }
    Modal.confirm({
      title: '??????',
      content: '??????????????????????????????',
      onOk: async () => {
        const {
          data: { success },
        } = await tenantCodeService.deleteEnv({ envCode: env.envCode });
        if (success) {
          message.success('????????????');
          queryTenantList();
        }
      },
    });
  };

  return (
    <div
      style={{
        lineHeight: '32px',
        padding: '0 8px',
        marginTop: 8,
        display: getTakinTenantAuthority() === 'false' ? 'none' : 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          marginLeft: '35%',
          color: 'var(--FunctionalAlert-900)',
          fontSize: '20px',
        }}
      >
        {desc}
      </span>
      <span>
        {isAdmin && (
          <Button style={{ marginRight: 8 }} onClick={() => setEnvEdit({})}>
            ????????????
          </Button>
        )}
        <Button.Group>
          <Dropdown
            overlay={
              <Menu>
                {tenantList.map((x) => (
                  <Menu.Item
                    key={x.tenantId}
                    onClick={() => changeTenant(x.tenantCode)}
                  >
                    <span
                      style={{
                        fontWeight:
                          tenantList[indexcode]?.tenantCode === x.tenantCode
                            ? 'bold'
                            : 'normal',
                      }}
                    >
                      {x.tenantNick}
                    </span>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button
              type="primary"
              style={{
                display: userType === '0' ? 'inline-block' : 'none',
              }}
            >
              ?????????
              {tenantList[indexcode]?.tenantNick}
              <Icon type="down" />
            </Button>
          </Dropdown>

          <Dropdown
            overlayStyle={{
              maxWidth: 130,
            }}
            overlay={
              <Menu>
                {envList?.map((x, ind) => {
                  const isSystemEnv = x?.source === 0;
                  return (
                    <Menu.Item
                      key={ind}
                      onClick={() => changeEnv(x)}
                      className="hover-group"
                    >
                      <div
                        style={{
                          display: 'flex',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            fontWeight:
                              envList[index]?.envCode === x.envCode
                                ? 'bold'
                                : 'normal',
                          }}
                          className="truncate"
                        >
                          {x.envName}
                        </div>
                        <span
                          style={{
                            alignSelf: 'end',
                            marginLeft: 8,
                          }}
                        >
                          <span className="hover-inline-block">
                            {/* ?????????????????????????????? */}
                            {isAdmin && !isSystemEnv && (
                              <>
                                <Tooltip title="??????">
                                  <Icon
                                    type="edit"
                                    style={{
                                      fontSize: 12,
                                      // marginRight: 8,
                                      cursor: 'pointer',
                                      display: 'inline-block',
                                      padding: 4,
                                    }}
                                    onClick={(e) => editEnv(e, x)}
                                  />
                                </Tooltip>
                                <Tooltip title="??????">
                                  <Icon
                                    type="delete"
                                    style={{
                                      fontSize: 12,
                                      // marginRight: 8,
                                      cursor: 'pointer',
                                      display: 'inline-block',
                                      padding: 4,
                                    }}
                                    onClick={(e) => deleteEnv(e, x)}
                                  />
                                </Tooltip>
                              </>
                            )}
                            {!x.isDefault && (
                              <Tooltip title="????????????">
                                <Icon
                                  type="star"
                                  style={{
                                    fontSize: 12,
                                    // marginRight: 8,
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                    padding: 4,
                                  }}
                                  onClick={(e) => setDefaultEnv(e, x)}
                                />
                              </Tooltip>
                            )}
                          </span>
                          {x.isDefault && (
                            <Tooltip title="??????????????????">
                              <Icon
                                type="star"
                                style={{
                                  fontSize: 12,
                                  // marginRight: 8,
                                  color: 'var(--BrandPrimary-500)',
                                  display: 'inline-block',
                                  padding: 4,
                                }}
                              />
                            </Tooltip>
                          )}
                        </span>
                      </div>
                    </Menu.Item>
                  );
                })}
              </Menu>
            }
          >
            <Button
              type="primary"
              style={{
                borderTopLeftRadius: userType === '0' ? '0px' : '4px',
                borderBottomLeftRadius: userType === '0' ? '0px' : '4px',
              }}
            >
              ?????????
              {envList[index]?.envName}
              <Icon type="down" />
            </Button>
          </Dropdown>
          {isSuper === '1' && (
            <AddTenantModal
              btnText="????????????"
              onSuccess={() => {
                queryTenantList();
              }}
            />
          )}
        </Button.Group>
      </span>
      {envEdit && (
        <EnvEditModal
          envList={envList}
          detail={envEdit}
          okCallback={() => {
            setEnvEdit(null);
            queryTenantList();
          }}
          cancelCallback={() => {
            setEnvEdit(null);
          }}
        />
      )}
    </div>
  );
};

export default EnvHeader;
