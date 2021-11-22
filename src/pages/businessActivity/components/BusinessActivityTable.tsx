/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Badge, Divider, Popconfirm, Tooltip } from 'antd';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ChangeStatus } from '../enum';
import BusinessActivityService from '../service';
import Link from 'umi/link';

import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import MissingDataScriptModal from '../modals/MissingDataScriptModal';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { getTakinAuthority } from 'src/utils/utils';

const getBusinessActivityColumns = (
  BusinessActivityState,
  setBusinessActivityState
): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const userType: string = localStorage.getItem('isAdmin');
  const expire: string = localStorage.getItem('troweb-expire');

  /**
   * @name 删除
   */
  const handleDelete = async linkId => {
    const {
      data: { success, data }
    } = await BusinessActivityService.deleteBusinessActivity({ linkId });
    if (success) {
      setBusinessActivityState({
        isReload: !BusinessActivityState.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '业务活动名称',
      dataIndex: 'businessActiveName',
      width: 200
    },
    {
      ...customColumnProps,
      title: '业务域',
      dataIndex: 'businessDomain'
    },
    {
      ...customColumnProps,
      title: '系统流程名称',
      dataIndex: 'systemProcessName',
      width: 200
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
      title: '涵盖中间件',
      dataIndex: 'middleWareList',
      render: text => {
        return (
          <span>
            {text && text.length > 0
              ? text.map((item, k) => {
                return (
                    <span key={k}>
                      {item}
                      {text.length !== k + 1 && '、'}
                    </span>
                );
              })
              : '--'}
          </span>
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
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle',
      dataIndex: 'userName'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row, index) => (
        <Fragment>
          {userType === 'true' &&
            expire === 'false' &&
            getTakinAuthority() === 'true' && (
              <span style={{ marginRight: 8 }}>
                <AdminDistributeModal
                  dataId={row.activityId}
                  btnText="分配给"
                  menuCode="BUSINESS_ACTIVITY"
                  onSccuess={() => {
                    setBusinessActivityState({
                      isReload: !BusinessActivityState.isReload
                    });
                  }}
                />
              </span>
            )}
          <span style={{ marginRight: 8 }}>
            <MissingDataScriptModal
              btnText="数据验证脚本"
              businessActivityId={row.activityId}
            />
          </span>

          {row.candelete === '0' ? (
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessActivity_4_delete &&
                row.canRemove
              }
            >
              <Popconfirm
                title="确定要删除吗？"
                okText="确认删除"
                cancelText="取消"
                onConfirm={() => handleDelete(row.businessActiceId)}
              >
                <a href="#" style={{ color: '#21D0F4', marginRight: 8 }}>
                  删除
                </a>
              </Popconfirm>
            </AuthorityBtn>
          ) : (
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessActivity_4_delete &&
                row.canRemove
              }
            >
              <Tooltip title="存在关联业务流程">
                <a style={{ color: 'rgba(33,208,244,0.5)', marginRight: 8 }}>
                  删除
                </a>
              </Tooltip>
            </AuthorityBtn>
          )}
          <AuthorityBtn
            isShow={
              btnAuthority &&
              btnAuthority.businessActivity_3_update &&
              row.canEdit
            }
          >
            <Link
              to={`/businessActivity/addBusinessActivity?action=edit&id=${row.businessActiceId}`}
            >
              编辑
            </Link>
          </AuthorityBtn>
        </Fragment>
      )
    }
  ];
};

export default getBusinessActivityColumns;
