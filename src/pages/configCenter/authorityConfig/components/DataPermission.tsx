import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import AuthorityConfigService from '../service';
import DataPermissionList from './DataPermissionList';
import RoleList from './RoleList';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const DataPermission: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    searchValue: '',
    roleList: [],
    isReload: false,
    dataPermissionList: [],
    roleId: null
  });

  useEffect(() => {
    queryRoleList({});
  }, [state.isReload]);

  useEffect(() => {
    queryFuncPermissonList();
  }, [state.roleId]);
  /**
   * @name 获取角色列表
   */
  const queryRoleList = async value => {
    const {
      total,
      data: { data, success }
    } = await AuthorityConfigService.queryRoleList({
      ...value
    });
    if (success) {
      setState({
        roleList: data,
        roleId: data && data[0] && data[0].id
      });
    }
  };
  /**
   * @name 获取数据权限列表
   */
  const queryFuncPermissonList = async () => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.queryDataPermission({
      roleId: state.roleId
    });
    if (success) {
      setState({
        dataPermissionList: data
      });
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        overflow: 'scroll'
      }}
    >
      <RoleList state={state} setState={setState} type="data" />
      <DataPermissionList state={state} setState={setState} />
    </div>
  );
};
export default DataPermission;
