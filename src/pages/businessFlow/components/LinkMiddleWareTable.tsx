/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';

const getMiddleWareColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '中间件',
      dataIndex: 'middleWareName'
    },
    {
      ...customColumnProps,
      title: '版本',
      dataIndex: 'version'
    },
    {
      ...customColumnProps,
      title: '中间件类型',
      dataIndex: 'middleWareType'
    }
  ];
};

export default getMiddleWareColumns;
