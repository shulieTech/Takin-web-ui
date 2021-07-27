/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import AddAndEditDbDrawer from 'src/pages/appManage/components/AddAndEditDbDrawer';
import { Divider, message, notification } from 'antd';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import EditPtTableConfigDrawer from './EditPtTableConfigDrawer';
import AppTrialManageService from '../service';
import { openNotification } from 'src/common/custom-notification/CustomNotification';

const getPtTableListColumns = (state, setState): ColumnProps<any>[] => {
  /**
   * @name 确认是否删除
   */
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await AppTrialManageService.deletePtTable({
      id
    });
    if (success) {
      openNotification('删除成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '数据库URL',
      dataIndex: 'url'
    },
    {
      ...customColumnProps,
      title: '表名称',
      dataIndex: 'config'
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
      width: 150,
      render: (text, row) => {
        return (
          <Fragment>
            <EditPtTableConfigDrawer
              titles="编辑"
              id={row.id}
              onSccuess={() => {
                setState({
                  isReload: !state.isReload
                });
              }}
            />
            <Divider type="vertical" />
            <CustomPopconfirm
              title="删除后不可恢复，确定要删除吗？"
              okText="确定删除"
              okColor="var(--FunctionalError-500)"
              onConfirm={() => handleDelete(row.id)}
            >
              <a>删除</a>
            </CustomPopconfirm>
          </Fragment>
        );
      }
    }
  ];
};

export default getPtTableListColumns;
