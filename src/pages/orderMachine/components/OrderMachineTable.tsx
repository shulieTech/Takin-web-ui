/**
 * @name
 * @author chuxu
 */
import React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge } from 'antd';

const getOrderMachineColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '客户名称',
      dataIndex: 'nick'
    },
    {
      ...customColumnProps,
      title: '套餐名称',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '机器ID',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '机器名称',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '机器公网IP',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '资源池',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '可用区',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: 'cpu/c',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: 'ram/g',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '宽带/m',
      dataIndex: 'status',
    },
    {
      ...customColumnProps,
      title: '订购时间',
      dataIndex: 'gmtUpdate'
    },
    {
      ...customColumnProps,
      title: '到期时间',
      dataIndex: 'gmtUpdate'
    },
    {
      ...customColumnProps,
      title: '订购时长/月',
      dataIndex: 'gmtUpdate'
    },
    {
      ...customColumnProps,
      title: '订购类型',
      dataIndex: 'gmtUpdate'
    },
    {
      ...customColumnProps,
      title: '机器状态',
      dataIndex: 'gmtUpdate'
    },
  ];
};

export default getOrderMachineColumns;
