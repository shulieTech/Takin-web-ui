/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';

const getBusinessTableListColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '数据库名称',
      dataIndex: 'url'
    },
    {
      ...customColumnProps,
      title: '表名称',
      dataIndex: 'tableName'
    },

    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'updateTime'
    }
  ];
};

export default getBusinessTableListColumns;
