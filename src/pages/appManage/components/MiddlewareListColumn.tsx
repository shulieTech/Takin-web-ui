/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import TableIndex from 'src/common/table-index/TableIndex';
import { Badge, Tag } from 'antd';
import { middlewareStatusColorMap } from '../enum';
import { isEmpty } from 'src/utils/utils';

const getMiddlewareListColumns = (
  state,
  setState,
  applicationId
): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '序号',
      dataIndex: 'id',
      render: text => {
        return <TableIndex text={text || '-'} />;
      }
    },
    {
      ...customColumnProps,
      title: 'Artifact ID',
      dataIndex: 'artifactId'
    },
    {
      ...customColumnProps,
      title: 'Group ID',
      dataIndex: 'groupId',
      render: text => {
        return (
          <span style={{ color: text === 'Unknown' ? '#ED6047' : '' }}>
            {text}
          </span>
        );
      }
    },
    {
      ...customColumnProps,
      title: '类型',
      dataIndex: 'type',
      render: text => {
        if (isEmpty(text)) {
          return '-';
        }
        return (
          <Tag style={{ background: '#f8f8f8', border: 'none' }}>{text}</Tag>
        );
      }
    },
    {
      ...customColumnProps,
      title: '版本号',
      dataIndex: 'version',
      render: text => {
        if (isEmpty(text)) {
          return '-';
        }
        return (
          <Tag style={{ background: '#f8f8f8', border: 'none' }}>{text}</Tag>
        );
      }
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'statusDesc',
      render: (text, row) => {
        if (row.status === 0) {
          return '-';
        }
        return (
          <Badge text={text} color={middlewareStatusColorMap[row.status]} />
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后更新时间',
      dataIndex: 'gmtUpdate'
    }
  ];
};

export default getMiddlewareListColumns;
