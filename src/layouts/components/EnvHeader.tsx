/* eslint-disable react-hooks/exhaustive-deps */
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
  const [envList, setStateEnvList] = useState([]);
  const [projectList, setStateProjectList] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [desc, setDesc] = useState('');
  const [envEdit, setEnvEdit] = useState<any>();

  const setEnvList = (data) => {
    setStateEnvList(data);
    window.g_app._store.dispatch({
      type: 'common/setEnvList',
      payload: data,
    });
  };

  useEffect(() => {
    if (getTakinTenantAuthority() === 'true') {
      queryTenantList();
    }
    // queryDepartmentList();
    queryProjectList();
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

  // /**
  //  * @name 获取部门列表
  //  */
  // const queryDepartmentList = async () => {
  //   const {
  //     data: { data, success }
  //   } = await tenantCodeService.queryDepartmentList({});
  //   if (success) {
  //     setStateProjectList(data);
  //   }
  // };

  /**
   * @name 获取项目列表
   */
  const queryProjectList = async () => {
    const {
      data: { data, success }
    } = await tenantCodeService.queryProjectList({ userId: localStorage.getItem('troweb-userId') });
    if (success) {
      setStateProjectList(data);
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

  const changeProject = async (project) => {
    const { id } = project;
    const res = await tenantCodeService.changeProject({ projectId: id });
    if (res?.data?.success) {
      if (res?.data?.data) {
        localStorage.setItem('deptId', id);
        if (window.location.hash === '#/dashboard') {
          window.location.reload();
        } else {
          window.location.hash = '#/dashboard';
          window.location.reload();
        }
      }
    }
  };

  const index = _.findIndex(envList, [
    'envCode',
    localStorage.getItem('env-code'),
  ]);

  const indexProject = _.findIndex(projectList, [
    'id',
    Number(localStorage.getItem('deptId')),
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
      message.success('操作成功');
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
      message.warn('不能删除当前环境');
      return;
    }
    Modal.confirm({
      title: '提示',
      content: '确定要删除该环境吗？',
      onOk: async () => {
        const {
          data: { success },
        } = await tenantCodeService.deleteEnv({ envCode: env.envCode });
        if (success) {
          message.success('操作成功');
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
      <Tooltip title={desc}>
        <span
          style={{
            color: 'var(--FunctionalAlert-900)',
            fontSize: 20,
            flex: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 30px',
          }}
        >
          {desc}
        </span>
      </Tooltip>
      <span>
        <Button.Group>
          { projectList && projectList?.length > 0 && <Dropdown
            overlayStyle={{
              maxWidth: 130,
            }}
            overlay={
              <Menu>
                {projectList?.map((x, ind) => {
                  return (
                    <Menu.Item
                      key={ind}
                      onClick={() => changeProject(x)}
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
                            projectList[indexProject]?.id === x.id
                                ? 'bold'
                                : 'normal',
                          }}
                          className="truncate"
                        >
                          {x.name}
                        </div>
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
                marginLeft: 8
              }}
            >
              项目：
              {projectList[indexProject]?.name}
              <Icon type="down" />
            </Button>
          </Dropdown>}
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
