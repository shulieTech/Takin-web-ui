/**
 * @name
 * @author chuxu
 */
import { Button, Divider, message, Popover, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import { customColumnProps } from 'src/components/custom-table/utils';
import { MapBtnAuthority } from 'src/utils/utils';
import AddAccountModal from '../modals/AddAccountModal';
import AddRoleModal from '../modals/AddRoleModal';
import AuthorityConfigService from '../service';
import styles from './../index.less';
import DeleteAccountBtn from './DeleteAccountBtn';

const getAccountListColumn = (state, setState): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  /**
   * @name 重置账号角色
   */
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.handleDelete({
      accountIds: id
    });
    if (success) {
      message.success(`重置成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '账号名称',
      dataIndex: 'accountName'
    },
    {
      ...customColumnProps,
      title: '所在部门',
      dataIndex: 'department'
    },
    {
      ...customColumnProps,
      title: '账号角色',
      dataIndex: 'accountRole',
      render: text => {
        return text && text.length > 0 ? (
          <div>
            <Tag>{text[0] && text[0].roleName}</Tag>
            <Popover
              placement="bottom"
              trigger="click"
              title="账号角色"
              content={
                <div className={styles.roles}>
                  {text.map((item, k) => {
                    return (
                      <p key={k}>
                        {item.roleName}
                        <Divider />
                      </p>
                    );
                  })}
                </div>}
            >
              <Tag>...</Tag>
            </Popover>
          </div>
        ) : (
          '-'
        );
      }
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <Fragment>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.configCenter_authorityConfig_3_update
              }
            >
              <AddRoleModal
                accountIds={[row.id]}
                roles={row.accountRole}
                btnText="分配角色"
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
                btnAuthority.configCenter_authorityConfig_3_update
              }
            >
              <Divider type="vertical" />
              <CustomPopconfirm
                title="重置后不可恢复，确定要重置吗？"
                okText="确定重置"
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDelete([row.id])}
              >
                <a>重置</a>
              </CustomPopconfirm>
            </AuthorityBtn>
            <AuthorityBtn
              isShow={MapBtnAuthority('configCenter_authorityConfig_3_update')}
            >
              <Divider type="vertical" />
              <AddAccountModal
                onSuccess={() => setState({ isReload: !state.isReload })}
                treeData={state.treeData}
                id={row.id}
              />
            </AuthorityBtn>
            <AuthorityBtn
              isShow={MapBtnAuthority('configCenter_authorityConfig_4_delete')}
            >
              <Divider type="vertical" />
              <DeleteAccountBtn
                ids={row.id}
                onSuccess={() => setState({ isReload: !state.isReload })}
              >
                <Button type="link">删除</Button>
              </DeleteAccountBtn>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getAccountListColumn;
