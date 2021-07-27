/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import Link from 'umi/link';

const getAppTrialManageColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '应用名称',
      dataIndex: 'applicationName'
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
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <Link to={`/appTrialManage/details?id=${row.id}`}>配置管理</Link>
          </Fragment>
        );
      }
    }
  ];
};

export default getAppTrialManageColumns;
