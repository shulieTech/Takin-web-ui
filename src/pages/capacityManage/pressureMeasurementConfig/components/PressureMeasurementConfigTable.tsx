/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';

const getColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '压测任务名称',
      dataIndex: 'projectName'
    },
    {
      ...customColumnProps,
      title: '任务类型',
      dataIndex: 'methodInfo'
    },
    {
      ...customColumnProps,
      title: '压测引擎',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '最新压测时间',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '当前压测状态',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        return <Fragment>1</Fragment>;
      }
    }
  ];
};

export default getColumns;
