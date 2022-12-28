/**
 * @name
 * @author chuxu
 */
import React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge } from 'antd';
 
const getFailOrderColumns = (state, setState): ColumnProps<any>[] => {
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
      title: '订购机器数量',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '规格',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '宽带',
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
      title: '订购时长/月',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '失败原因',
      dataIndex: 'key'
    },
    {
      ...customColumnProps,
      title: '发生时间',
      dataIndex: 'status',
    },
    {
      ...customColumnProps,
      title: '处理时间',
      dataIndex: 'gmtUpdate'
    },
    {
      ...customColumnProps,
      title: '当前状态',
      dataIndex: 'gmtUpdate'
    },
  ];
};
 
export default getFailOrderColumns;
 