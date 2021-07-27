/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import styles from './../index.less';

const getOldNodeManageListColumns = (): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: 'Agent ID',
      dataIndex: 'agentId'
    },
    {
      ...customColumnProps,
      title: 'IP',
      dataIndex: 'ip'
    },
    {
      ...customColumnProps,
      title: '进程号',
      dataIndex: 'processNumber'
    },
    {
      ...customColumnProps,
      title: 'Agent 版本',
      dataIndex: 'agentVersion',
      render: text => {
        return <span>V {text} </span>;
      }
    },
    {
      ...customColumnProps,
      title: 'Agent 语言',
      dataIndex: 'agentLang'
    },
    {
      ...customColumnProps,
      title: '更新时间',
      dataIndex: 'updateTime'
    }
  ];
};

export default getOldNodeManageListColumns;
