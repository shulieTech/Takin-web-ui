/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';

const getListColumn = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '',
      dataIndex: 'accountName'
    },
    {
      ...customColumnProps,
      title: '',
      dataIndex: 'department'
    }
  ];
};

export default getListColumn;
