/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge, Divider, message } from 'antd';
import AppManageService from '../service';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import AddJobDrawer from './AddJobDrawer';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

const getColumns = (
  state,
  setState,
  detailState,
  action
): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  /**
   * @name 确认是否禁用、启用job
   */
  const handleConfirm = async (id, status) => {
    const {
      data: { data, success }
    } = await AppManageService.openAndCloseJob({
      id,
      status
    });
    if (success) {
      const txt = status === 0 ? '启用' : '禁用';
      openNotification(`${txt}成功`, '');
      setState({
        isReload: !state.isReload
      });
    }
  };

  /**
   * @name 删除job
   */
  const handleDeleteJob = async id => {
    const {
      data: { data, success }
    } = await AppManageService.deleteJob({
      id
    });
    if (success) {
      openNotification(`删除成功`, '');
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '任务名称',
      dataIndex: 'name'
    },
    {
      ...customColumnProps,
      title: 'Job类型',
      dataIndex: 'typeName'
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'status',
      render: (text, row) => {
        return (
          <Badge
            text={text === 1 ? '已禁用' : '已启用'}
            color={
              text === 1
                ? 'var(--FunctionalError-500)'
                : 'var(--BrandPrimary-500)'
            }
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 200
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        const txt = row.status === 1 ? '启用' : '禁用';
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
                title={`是否确认${txt}`}
                okText={`确认${txt}`}
                onConfirm={() =>
                  handleConfirm(row.id, row.status === 1 ? 0 : 1)
                }
              >
                <a
                  disabled={
                    detailState.switchStatus === 'OPENING' ||
                    detailState.switchStatus === 'CLOSING'
                      ? true
                      : false
                  }
                  style={{ marginRight: 8 }}
                >
                  {txt}
                </a>
              </CustomPopconfirm>
            </AuthorityBtn>
            <AuthorityBtn
              isShow={
                btnAuthority && btnAuthority.appManage_3_update && row.canEdit
              }
            >
              <AddJobDrawer
                disabled={
                  detailState.switchStatus === 'OPENING' ||
                  detailState.switchStatus === 'CLOSING'
                    ? true
                    : false
                }
                action="edit"
                title="编辑"
                id={row.id}
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
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
                title="删除后不可恢复，确定要删除吗？"
                okText="确定删除"
                okColor="#FE7D61"
                onConfirm={() => handleDeleteJob(row.id)}
              >
                <a
                  disabled={
                    detailState.switchStatus === 'OPENING' ||
                    detailState.switchStatus === 'CLOSING'
                      ? true
                      : false
                  }
                  style={{ marginLeft: 8 }}
                >
                  删除
                </a>
              </CustomPopconfirm>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getColumns;
