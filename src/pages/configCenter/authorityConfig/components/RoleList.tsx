import { Button, Icon, message } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import AddAndEditRoleModal from '../modals/AddAndEditRoleModal';
import AuthorityConfigService from '../service';
import styles from './../index.less';
interface Props {
  state: any;
  setState: (value: any) => void;
  type?: string;
}
const RoleList: React.FC<Props> = props => {
  const { state, setState, type } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  /**
   * @name 删除角色
   */
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.deleteRole({
      ids: [id]
    });
    if (success) {
      message.success(`删除成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };
  const handleSearch = async () => {
    const {
      total,
      data: { data, success }
    } = await AuthorityConfigService.queryRoleList({
      roleName: state.searchValue
    });
    if (success) {
      setState({
        roleList: data
      });
    }
  };
  const handleChange = async e => {
    setState({
      searchValue: e.target.value
    });
  };

  const handleCheckRole = async id => {
    setState({
      roleId: id
    });
  };
  return (
    <div className={styles.roleLeftWrap}>
      <div style={{ margin: 16 }}>
        <Search
          placeholder="搜索角色名称"
          onChange={handleChange}
          onSearch={handleSearch}
        />
      </div>

      {type !== 'data' && (
        <AuthorityBtn
          isShow={
            btnAuthority && btnAuthority.configCenter_authorityConfig_2_create
          }
        >
          <AddAndEditRoleModal
            action="add"
            btnText={
              <Button type="link">
                <Icon type="plus" />
                新增角色
              </Button>
            }
            onSccuess={() => {
              setState({
                isReload: !state.isReload
              });
            }}
          />
        </AuthorityBtn>
      )}
      <div style={{ marginTop: 16 }}>
        {state.roleList &&
          state.roleList.map((item, k) => {
            return (
              <div
                key={k}
                className={`${styles.roleCard} ${item.id === state.roleId &&
                  styles.activeRoleCard}`}
                onClick={() => handleCheckRole(item.id)}
              >
                <div className={styles.roleName}>
                  <span className={styles.name}>{item.roleName}</span>
                  {type !== 'data' && (
                    <Fragment>
                      <AuthorityBtn
                        isShow={
                          btnAuthority &&
                          btnAuthority.configCenter_authorityConfig_3_update
                        }
                      >
                        <AddAndEditRoleModal
                          roleId={item.id}
                          action="edit"
                          btnText={
                            <Icon
                              type="edit"
                              style={{ marginRight: 16, fontSize: 16 }}
                            />
                          }
                          onSccuess={() => {
                            setState({
                              isReload: !state.isReload
                            });
                          }}
                        />
                      </AuthorityBtn>
                      <AuthorityBtn
                        isShow={
                          btnAuthority &&
                          btnAuthority.configCenter_authorityConfig_4_delete
                        }
                      >
                        <CustomPopconfirm
                          title="删除后不可恢复，确定要删除吗？"
                          okText="确定删除"
                          okColor="var(--FunctionalError-500)"
                          onConfirm={() => handleDelete(item.id)}
                        >
                          <Button type="link">
                            <Icon type="delete" />
                          </Button>
                        </CustomPopconfirm>
                      </AuthorityBtn>
                    </Fragment>
                  )}
                </div>
                <div className={styles.roleDesc}>{item.roleDesc}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default RoleList;
