/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import Link from 'umi/link';
import { Badge, Tooltip, Popconfirm, Divider, message, Button } from 'antd';
import AppManageService from '../service';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import AddAndEditDbDrawer from './AddAndEditDbDrawer';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AddEditDbModal from '../modals/AddEditDbModal';
import EditDynamicDbDrawer from './EditDynamicDbDrawer';

const getLinkDbColumns = (
  state,
  setState,
  detailState,
  appId,
  detailData
): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  /**
   * @name 确认是否禁用、启用
   */
  const handleConfirm = async (id, status, isNewData, middlewareType) => {
    const {
      data: { data, success }
    } = await AppManageService.openAndClose({
      id,
      status,
      isNewData,
      middlewareType,
      applicationId: appId
    });
    if (success) {
      const txt = status === 0 ? '启用' : '禁用';
      openNotification(`${txt}成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };
  /**
   * @name 确认是否删除
   */
  const handleDelete = async (id, middlewareType, isNewData) => {
    const {
      data: { data, success }
    } = await AppManageService.deleteDbTable({
      isNewData,
      id,
      middlewareType,
      applicationId: appId
    });
    if (success) {
      openNotification(`删除成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };
  return [
    {
      ...customColumnProps,
      title: '业务数据源',
      dataIndex: 'url',
      width: 400
    },
    {
      ...customColumnProps,
      title: '中间件类型',
      dataIndex: 'middlewareType',
      render: text => {
        return <span>{text || '-'}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '连接池名称',
      dataIndex: 'connectionPool'
    },

    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'status',
      render: (text, row) => {
        return (
          <Badge
            text={text === 0 ? '已启用' : '已禁用'}
            color={
              text === 0
                ? 'var(--BrandPrimary-500)'
                : 'var(--FunctionalError-500)'
            }
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '附加信息',
      dataIndex: 'extMsg'
    },
    {
      ...customColumnProps,
      title: '隔离方案',
      dataIndex: 'dsType',
      render: text => {
        return <span>{text || '-'}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        const txt = row.status === 0 ? '禁用' : '启用';
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
                onConfirm={() =>
                  handleConfirm(
                    row.id,
                    row.status === 0 ? 1 : 0,
                    row.isNewData,
                    row.middlewareType
                  )
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
            {row.isNewPage && row.canEdit ? (
              <EditDynamicDbDrawer
                titles="编辑"
                middlewareType={row.middlewareType}
                id={row.id}
                isNewData={row.isNewData}
                applicationId={appId}
                connectionPool={row.connectionPool}
                agentSourceType={row.agentSourceType}
                cacheType={row.cacheType}
                onSuccess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            ) : detailState.isNewAgent === true ? (
              <AuthorityBtn
                isShow={
                  btnAuthority && btnAuthority.appManage_3_update && row.canEdit
                }
              >
                <AddEditDbModal
                  id={row.id}
                  applicationId={appId}
                  btnText="编辑"
                  detailData={detailData}
                  onSuccess={() => {
                    setState({
                      isReload: !state.isReload
                    });
                  }}
                />
              </AuthorityBtn>
            ) : detailState.isNewAgent === false ? (
              <AuthorityBtn
                isShow={
                  btnAuthority && btnAuthority.appManage_3_update && row.canEdit
                }
              >
                <AddAndEditDbDrawer
                  action="edit"
                  disabled={
                    detailState.switchStatus === 'OPENING' ||
                    detailState.switchStatus === 'CLOSING'
                      ? true
                      : false
                  }
                  titles="编辑"
                  id={row.id}
                  onSccuess={() => {
                    setState({
                      isReload: !state.isReload
                    });
                  }}
                />
              </AuthorityBtn>
            ) : null}

            <AuthorityBtn
              isShow={
                btnAuthority && btnAuthority.appManage_4_delete && row.canRemove
              }
            >
              <Fragment>
                <CustomPopconfirm
                  title="删除后不可恢复，确定要删除吗？"
                  okText="确定删除"
                  okColor="var(--FunctionalError-500)"
                  onConfirm={() =>
                    handleDelete(row.id, row.middlewareType, row.isNewData)
                  }
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
              </Fragment>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getLinkDbColumns;
