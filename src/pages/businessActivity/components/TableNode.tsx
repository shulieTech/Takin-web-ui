/**
 * @name
 * @author chuxu
 */
import { Badge, Button, Popconfirm, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { customColumnProps } from 'src/components/custom-table/utils';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { CommonModelState } from 'src/models/common';
import { getTakinAuthority } from 'src/utils/utils';
import Link from 'umi/link';
import { ChangeStatus } from '../enum';
import AddEditActivityModal from '../modals/AddEditActivityModal';
import MissingDataScriptModal from '../modals/MissingDataScriptModal';
import BusinessActivityService from '../service';

const getColumns = (
  systemFlowState,
  setSystemFlowState,
  props: CommonModelState
): ColumnProps<any>[] => {
  const userType: string = localStorage.getItem('isAdmin');
  const expire: string = localStorage.getItem('troweb-expire');
  /**
   * @name 删除,刷新列表
   */
  const handleDelete = async (activityId) => {
    const {
      data: { success, data },
    } = await BusinessActivityService.deleteSystemFlow(activityId);
    if (success) {
      setSystemFlowState({
        isReload: !systemFlowState.isReload,
      });
    }
  };

  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  return [
    {
      ...customColumnProps,
      title: '业务活动名称',
      dataIndex: 'activityName',
      width: 350,
    },
    {
      ...customColumnProps,
      title: '类型',
      dataIndex: 'businessType',
      render: (text) => {
        return text === 1 ? '虚拟' : '-';
      },
    },
    {
      ...customColumnProps,
      title: '级别',
      dataIndex: 'link_level',
      render: (text) => {
        return text || '-';
      },
    },
    {
      ...customColumnProps,
      title: '业务域',
      dataIndex: 'businessDomain',
      render: (text) =>
        text ? (props.domains?.find((item) => +item.value === +text) || {})
            .label || '-'
          : '-',
    },
    {
      ...customColumnProps,
      title: '变更状态',
      dataIndex: 'isChange',
      render: (text, row) => {
        return (
          <Badge
            text={
              +text === 0
                ? '正常'
                : row.changeType === '1'
                  ? '已变更(入口)'
                  : '已变更(关联链路)'
            }
            color={ChangeStatus[text]}
          />
        );
      },
    },
    {
      ...customColumnProps,
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--',
    },
    {
      ...customColumnProps,
      title: '负责人',
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle',
      dataIndex: 'userName',
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
                    setSystemFlowState({
                      isReload: !systemFlowState.isReload
                    });
                  }}
                />
              </span>
            )}
          {row.canDelete === 0 ? (
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
                onConfirm={() => handleDelete(row.activityId)}
              >
                <Button style={{ marginRight: 8 }} type="link">
                  删除
                </Button>
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
                <Button disabled style={{ marginRight: 8 }} type="link">
                  删除
                </Button>
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
            <AddEditActivityModal
              isVirtual={row.businessType === 1 ? true : false}
              id={row.activityId}
              onSuccess={() =>
                setSystemFlowState({ isReload: !systemFlowState.isReload })
              }
            />
          </AuthorityBtn>
          {row.businessType !== 1 && (
            <Link
              to={`/businessActivity/details?id=${row.activityId}&pageIndex=${window?._search_table_params?.current}`}
            >
              <Button type="link" className="mg-l1x">
                详情
              </Button>
            </Link>
          )}
          <span style={{ marginLeft: 8 }}>
            <MissingDataScriptModal
              btnText="数据验证脚本"
              businessActivityId={row.activityId}
            />
          </span>
        </Fragment>
      ),
    },
  ];
};

export default getColumns;
