/**
 * @name
 * @author chuxu
 */
import React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge } from 'antd';

const getUserPackageManageColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '客户名称',
      dataIndex: 'nick'
    },
    {
      ...customColumnProps,
      title: '套餐类型',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '最大vu',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '套餐详细信息',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '生效时间',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '失效时间',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '次数（次）',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '剩余次数',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '购买时长/月',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '套餐状态',
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
      title: '失败原因',
      dataIndex: 'gmtUpdate'
    },
  ];
};

export default getUserPackageManageColumns;
