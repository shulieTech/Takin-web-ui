/**
 * @name
 * @author chuxu
 */
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';

const OperationLogTable = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '操作模块',
      dataIndex: 'modules',
      width: 200,
      render: text => {
        return text && text.length > 0 ? (
          <span>
            {text.map((item, key) => {
              if (key === text.length - 1) {
                return <span key={key}>{item}</span>;
              }
              return <span key={key}>{item} - </span>;
            })}
          </span>
        ) : (
          <span>-</span>
        );
      }
    },
    {
      ...customColumnProps,
      title: '操作类型',
      dataIndex: 'type',
      width: 80
    },
    {
      ...customColumnProps,
      title: '操作描述',
      dataIndex: 'content',
      width: 300
    },
    {
      ...customColumnProps,
      title: '操作人',
      dataIndex: 'userName',
      width: 80
    },
    {
      ...customColumnProps,
      title: '操作时间',
      dataIndex: 'startTime',
      width: 150
    }
  ];
};

export default OperationLogTable;
