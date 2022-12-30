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
      dataIndex: 'customerName'
    },
    {
      ...customColumnProps,
      title: '套餐名称',
      dataIndex: 'packageName'
    },
    {
      ...customColumnProps,
      title: '订购机器数量',
      dataIndex: 'numbers'
    },
    {
      ...customColumnProps,
      title: '规格(cpu/ram)',
      dataIndex: 'cpu',
      render: (text, record) => {
        return <span>{`${text}c${record?.ram}g`}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '宽带',
      dataIndex: 'bandwidth'
    },
    {
      ...customColumnProps,
      title: '资源池',
      dataIndex: 'poolName'
    },
    {
      ...customColumnProps,
      title: '可用区',
      dataIndex: 'regionName'
    },
    {
      ...customColumnProps,
      title: '订购时长/月',
      dataIndex: 'duration'
    },
    {
      ...customColumnProps,
      title: '失败原因',
      dataIndex: 'reason'
    },
    {
      ...customColumnProps,
      title: '发生时间',
      dataIndex: 'createDate',
    },
    {
      ...customColumnProps,
      title: '处理时间',
      dataIndex: 'dealDate'
    },
    {
      ...customColumnProps,
      title: '当前状态',
      dataIndex: 'status',
      render: (text) => {
        return text === '0' ? '未处理' : text === '1' ? '已处理' : '-';
      }

    },
  ];
};
 
export default getFailOrderColumns;
 