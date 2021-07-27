import React, { Fragment, useEffect } from 'react';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import { Button, message, Pagination } from 'antd';
import AppManageService from '../service';
import { useStateReducer } from 'racc';
import styles from './../index.less';
interface Props {
  dataSource: any;
}

const FunctionJurisdictionList: React.FC<Props> = props => {
  const { dataSource } = props;

  const getRoleMemberColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '权限名称',
        dataIndex: 'name'
      }
    ];
  };

  return (
    <CustomTable
      rowKey={(row, index) => index.toString()}
      rowSelection={{
        selectedRowKeys: ['0', '1', '2', '3', '4', '5', '6'],
        getCheckboxProps: record => ({
          disabled: true
        })
      }}
      columns={getRoleMemberColumns()}
      dataSource={dataSource}
    />
  );
};
export default FunctionJurisdictionList;
