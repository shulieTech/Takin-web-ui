/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import Link from 'umi/link';
import { Button, Divider, Badge, message } from 'antd';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import EntryRuleService from '../service';
import AddAndEditEntryRuleDrawer from './AddAndEditEntryRuleDrawer';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

const EntryRuleTable = (state, setState): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  /**
   * @name 删除入口
   */
  const handleDeleteEntryRule = async id => {
    const {
      data: { data, success }
    } = await EntryRuleService.deleteEntryRule({
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
      title: '应用名称',
      dataIndex: 'applicationName'
    },
    {
      ...customColumnProps,
      title: '入口地址',
      dataIndex: 'api'
    },
    {
      ...customColumnProps,
      title: '请求类型',
      dataIndex: 'requestMethod'
    },
    {
      ...customColumnProps,
      title: '最近修改时间',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.configCenter_entryRule_3_update &&
                row.canEdit
              }
            >
              <AddAndEditEntryRuleDrawer
                action="edit"
                titles="编辑"
                id={row.id}
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload,
                    searchParams: {
                      current: 0
                    }
                  });
                }}
              />
            </AuthorityBtn>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.configCenter_entryRule_4_delete &&
                row.canRemove
              }
            >
              <CustomPopconfirm
                title="是否确定删除？"
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDeleteEntryRule(row.id)}
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

export default EntryRuleTable;
