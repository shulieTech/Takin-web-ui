import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import AuthorityConfigService from '../service';
import FuncPermissionList from './FuncPermissionList';
import RoleList from './RoleList';
interface Props {
  state: any;
  setState: (value: any) => void;
}
const FunctionPermission: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    searchValue: '',
    roleList: [],
    isReload: false,
    funcPermissionList: [],
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
   * @name 获取功能权限列表
   */
  const queryFuncPermissonList = async () => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.queryFuncPermission({
      roleId: state.roleId
    });
    if (success) {
      setState({
        funcPermissionList: data
      });
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex'
      }}
    >
      <RoleList state={state} setState={setState} />
      <FuncPermissionList state={state} setState={setState} />
    </div>
  );
};
export default FunctionPermission;
