/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Badge, Button, Divider, Popconfirm, Tooltip } from 'antd';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ChangeStatus } from '../enum';
import BusinessFlowService from '../service';
import Link from 'umi/link';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { router } from 'umi';

const getColumns = (
  BusinessFlowState,
  setBusinessFlowState
): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const userType: string = localStorage.getItem('troweb-role');
  const expire: string = localStorage.getItem('troweb-expire');
  /**
   * @name 删除
   */
  const handleDelete = async id => {
    const {
      data: { success, data }
    } = await BusinessFlowService.deleteBusinessFlow({ id });
    if (success) {
      setBusinessFlowState({
        isReload: !BusinessFlowState.isReload
      });
    }
  };

  const handleClick = async id => {
    const {
      data: { success, data }
    } = await BusinessFlowService.queryBusinessActivityDetail({ id });
    if (success) {
      router.push(`/businessFlow/addBusinessFlow?action=edit&id=${id}`);
    }
  };
  return [
    {
      ...customColumnProps,
      title: '业务流程名称',
      dataIndex: 'sceneName'
    },
    {
      ...customColumnProps,
      title: '类型',
      dataIndex: 'businessType',
      render: text => {
        return text === 1 ? '虚拟' : '-';
      }
    },
    {
      ...customColumnProps,
      title: '系统流程数（条）',
      dataIndex: 'techLinkCount'
    },
    {
      ...customColumnProps,
      title: '业务活动数（条）',
      dataIndex: 'businessLinkCount'
    },
    {
      ...customColumnProps,
      title: '变更状态',
      dataIndex: 'ischange',
      render: (text, row) => {
        return (
          <Badge
            text={text === '0' ? '正常' : '已变更'}
            color={ChangeStatus[text]}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      ...customColumnProps,
      title: '负责人',
      dataIndex: 'managerName'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row, index) => (
        <Fragment>
          {userType === '0' && expire === 'false' && (
            <span style={{ marginRight: 8 }}>
              <AdminDistributeModal
                dataId={row.id}
                btnText="分配给"
                menuCode="BUSINESS_FLOW"
                onSccuess={() => {
                  setBusinessFlowState({
                    isReload: !BusinessFlowState.isReload
                  });
                }}
              />
            </span>
          )}

          <AuthorityBtn
            isShow={
              btnAuthority &&
              btnAuthority.businessFlow_4_delete &&
              row.canRemove
            }
          >
            <Popconfirm
              title="确定要删除吗？"
              okText="确认删除"
              cancelText="取消"
              onConfirm={() => handleDelete(row.id)}
            >
              <Button style={{ marginRight: 8 }} type="link">
                删除
              </Button>
            </Popconfirm>
          </AuthorityBtn>
          <AuthorityBtn
            isShow={
              btnAuthority && btnAuthority.businessFlow_3_update && row.canEdit
            }
          >
            <Link to={`/businessFlow/addBusinessFlow?action=edit&id=${row.id}`}>
              编辑
            </Link>
          </AuthorityBtn>
        </Fragment>
      )
    }
  ];
};

export default getColumns;
