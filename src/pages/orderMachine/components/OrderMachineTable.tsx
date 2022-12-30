/**
 * @name
 * @author chuxu
 */
import React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge } from 'antd';
import { statusMap } from '../enum';

const getOrderMachineColumns = (state, setState): ColumnProps<any>[] => {
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
      title: '机器ID',
      dataIndex: 'machineId'
    },
    {
      ...customColumnProps,
      title: '机器名称',
      dataIndex: 'machineName'
    },
    {
      ...customColumnProps,
      title: '机器公网IP',
      dataIndex: 'ipPublic'
    },
    {
      ...customColumnProps,
      title: '机器内网IP',
      dataIndex: 'ipPrivate'
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
      title: 'cpu/c',
      dataIndex: 'cpu'
    },
    {
      ...customColumnProps,
      title: 'ram/g',
      dataIndex: 'ram'
    },
    {
      ...customColumnProps,
      title: '宽带/m',
      dataIndex: 'bandwidth',
    },
    {
      ...customColumnProps,
      title: '订购时间',
      dataIndex: 'startTime'
    },
    {
      ...customColumnProps,
      title: '到期时间',
      dataIndex: 'endTime'
    },
    {
      ...customColumnProps,
      title: '订购时长/月',
      dataIndex: 'duration'
    },
    {
      ...customColumnProps,
      title: '订购类型',
      dataIndex: 'buyType',
      render: (text) => {
        return  text === 0 ? '自动订购' : text === 1 ? '人工订购' : '-';
      }
    },
    {
      ...customColumnProps,
      title: '机器状态',
      dataIndex: 'status',
      render: (text) => {
        return statusMap[text];
      }
    },
  ];
};

export default getOrderMachineColumns;
