/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge } from 'antd';

const getMiddleWareListColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '中间件类型',
      dataIndex: 'jarType'
    },
    {
      ...customColumnProps,
      title: '中间件',
      dataIndex: 'jarName'
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'active',
      render: (text, row) => {
        return (
          <Badge
            text={text ? '生效' : '未生效'}
            color={text ? '#11BBD5' : '#FE7D61'}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '信息',
      dataIndex: 'pluginName'
    },
    {
      ...customColumnProps,
      title: '更新时间',
      dataIndex: 'updateTime'
    }
  ];
};

export default getMiddleWareListColumns;
