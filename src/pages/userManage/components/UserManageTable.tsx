/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import Link from 'umi/link';
import { Badge, Popconfirm, Switch, Divider, message } from 'antd';
import AddAndEditUserDrawer from './AddAndEditUserDrawer';
// import { appConfigStatusMap, appConfigStatusColorMap } from '../enum';

const getUserManageColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '客户名称',
      dataIndex: 'nick'
    },
    {
      ...customColumnProps,
      title: '客户key',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'status',
      render: (text, row) => {
        return (
          <Badge
            text={text === 0 ? '正常' : '禁用'}
            color={text === 0 ? '#11BBD5' : '#FE7D61'}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '使用模式',
      dataIndex: 'model',
      render: (text, row) => {
        return (
          <Badge
            text={text === 0 ? '体验模式' : '正式模式'}
            color={text === 0 ? '#A2A6B1' : '#11BBD5'}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '账号',
      dataIndex: 'name'
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'gmtUpdate'
    },

    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <AddAndEditUserDrawer
              titles="编辑"
              action="edit"
              id={row.id}
              onSccuess={() => {
                setState({
                  isReload: !state.id
                });
              }}
            />
          </Fragment>
        );
      }
    }
  ];
};

export default getUserManageColumns;
