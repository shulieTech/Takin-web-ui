/**
 * @name
 * @author chuxu
 */
import { Badge, Button, message, Modal, Popconfirm, Switch, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import { customColumnProps } from 'src/components/custom-table/utils';
import AppManageService from '../service';
import AddAndEditBlacklistDrawer from './AddAndEditBlackListDrawer';

const getBlackListColumns = (
  state,
  setState,
  detailState,
  applicationId,
  action,
  detailData
): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  /**
   * @name 确认是否禁用、启用
   */
  const handleConfirm = async (id, status) => {
    const {
      data: { data, success }
    } = await AppManageService.openAndCloseBlacklist({
      blistId: id,
      useYn: status
    });
    if (success) {
      const txt = status === 1 ? '启用' : '禁用';
      message.success(`${txt}成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };
  /**
   * @name 删除黑名单(单个)
   */
  const handleDeleteBlacklist = async id => {
    const {
      data: { data, success }
    } = await AppManageService.deleteBlacklist({
      id
    });
    if (success) {
      message.success(`删除成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: 'redis key',
      dataIndex: 'redisKey'
    },
    {
      ...customColumnProps,
      title: '最近修改时间',
      dataIndex: 'gmtModified'
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'useYn',
      render: text => {
        return (
          <Badge
            color={
              text === 1
                ? 'var(--BrandPrimary-500)'
                : 'var(--FunctionalError-500)'
            }
            text={text === 1 ? '启用' : '禁用'}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        const btnTxt = row.useYn === 0 ? '启用' : '禁用';
        const txt = row.useYn === 0 ? '是否确定启用' : '是否确认禁用';
        return (
          <Fragment>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.appManage_6_enable_disable &&
                row.canEnableDisable
              }
            >
              <CustomPopconfirm
                title={txt}
                okColor="var(--FunctionalError-500)"
                okText={`确定${btnTxt}`}
                onConfirm={() =>
                  handleConfirm(row.blistId, row.useYn === 1 ? 0 : 1)
                }
              >
                <Button type="link" style={{ marginRight: 8 }}>
                  {btnTxt}
                </Button>
              </CustomPopconfirm>
            </AuthorityBtn>
            <AuthorityBtn
              isShow={
                btnAuthority && btnAuthority.appManage_3_update && row.canEdit
              }
            >
              <AddAndEditBlacklistDrawer
                detailData={detailData}
                action="edit"
                titles="编辑"
                blistId={row.blistId}
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload,
                    searchParams: {
                      current: 0,
                      pageSize: 10
                    }
                  });
                }}
              />
            </AuthorityBtn>
            <AuthorityBtn
              isShow={
                btnAuthority && btnAuthority.appManage_4_delete && row.canRemove
              }
            >
              <CustomPopconfirm
                title="是否确定删除？"
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDeleteBlacklist(row.blistId)}
              >
                <Button type="link" style={{ marginLeft: 8 }}>
                  删除
                </Button>
              </CustomPopconfirm>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getBlackListColumns;
