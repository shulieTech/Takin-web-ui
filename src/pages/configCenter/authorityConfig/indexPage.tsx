import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import AuthorityConfigTabs from './components/AuthorityConfigTabs';
import styles from './index.less';
import AuthorityConfigService from './service';

interface Props {}
const AuthorityConfig: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    expandedKeys: [],
    searchValue: null,
    selectedDept: null,
    selectedDeptName: null,
    treeData: null,
    selectedRowKeys: [],
    accountList: [],
    roleList: [],
    total: null,
    isReload: false,
    depReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    accountSearchValues: {
      accountName: null,
      roleId: null
    },
    loading: false
  });

  useEffect(() => {
    queryDepartmentList({});
  }, [state.depReload]);
  
  useEffect(() => {
    queryRoleList({});
  }, []);

  useEffect(() => {
    queryAccountList({
      ...state.searchParams,
      ...state.accountSearchValues,
      departmentId: state.selectedDept
    });
  }, [
    state.isReload,
    state.searchParams.pageSize,
    state.searchParams.current,
    state.selectedDept,
    state.accountSearchValues.accountName,
    state.accountSearchValues.roleId
  ]);

  /**
   * @name 获取部门列表
   */
  const queryDepartmentList = async value => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.queryDepartmentList({
      ...value
    });
    if (success) {
      setState({
        treeData: data
      });
    }
  };

  /**
   * @name 获取账号列表
   */
  const queryAccountList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { data, success }
    } = await AuthorityConfigService.queryAccountList({
      ...value
    });
    if (success) {
      setState({
        total,
        accountList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };
  /**
   * @name 获取角色列表
   */
  const queryRoleList = async value => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.queryRoleList({
      ...value
    });
    if (success) {
      setState({
        roleList:
          data &&
          data.map(item => {
            return {
              label: item.roleName,
              value: item.id
            };
          })
      });
    }
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.title}>权限配置中心</div>
      <div style={{ height: 'calc(100% - 84px)' }}>
        <AuthorityConfigTabs state={state} setState={setState} />
      </div>
    </div>
  );
};
export default AuthorityConfig;
