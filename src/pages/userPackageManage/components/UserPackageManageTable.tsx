/**
 * @name
 * @author chuxu
 */
import React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge } from 'antd';
import { statusMap } from '../enum';

const getUserPackageManageColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '客户名称',
      dataIndex: 'customerName'
    },
    {
      ...customColumnProps,
      title: '套餐类型',
      dataIndex: 'packageType',
      render: (text) => {
        return text === 1 ? '次卡' : text === 0 ? '月卡' : '-';
      }
    },
    {
      ...customColumnProps,
      title: '最大vu',
      dataIndex: 'maxVu'
    },
    {
      ...customColumnProps,
      title: '套餐详细信息',
      dataIndex: 'packageDesc'
    },
    {
      ...customColumnProps,
      title: '生效时间',
      dataIndex: 'startDate'
    },
    {
      ...customColumnProps,
      title: '失效时间',
      dataIndex: 'endDate'
    },
    {
      ...customColumnProps,
      title: '次数（次）',
      dataIndex: 'times'
    },
    {
      ...customColumnProps,
      title: '剩余次数',
      dataIndex: 'timesCurrent'
    },
    {
      ...customColumnProps,
      title: '购买时长/月',
      dataIndex: 'duration'
    },
    {
      ...customColumnProps,
      title: '套餐状态',
      dataIndex: 'status',
      render: (text) => {
        return statusMap[text];
      }
    },
    {
      ...customColumnProps,
      title: '失败原因',
      dataIndex: 'reason'
    },
  ];
};

export default getUserPackageManageColumns;
