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
   * @name 确认是否删除
   */
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await AppManageService.deleteDbTable({
      id
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
            {row.isNewPage ? (
              <EditDynamicDbDrawer
                titles="编辑"
                middlewareType={row.middlewareType}
                id={row.id}
                isNewData={row.isNewData}
                applicationId={appId}
                connectionPool={row.connectionPool}
                agentSourceType={row.agentSourceType}
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
                  onConfirm={() => handleDelete(row.id)}
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
