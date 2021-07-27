/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import EditPluginModal from '../modals/EditPluginModal';
import moment from 'moment';

const getPluginManageListColumns = (
  state,
  setState,
  id
): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '插件配置项',
      dataIndex: 'configItem'
    },
    {
      ...customColumnProps,
      title: '配置说明',
      dataIndex: 'configDesc'
    },
    {
      ...customColumnProps,
      title: '配置值',
      dataIndex: 'configValueName'
    },
    {
      ...customColumnProps,
      title: '最近修改时间',
      dataIndex: 'modifieTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <EditPluginModal
            btnText="编辑"
            configValue={row.configValue}
            id={row.id}
            appId={id}
            onSuccess={() => {
              setState({
                isReload: !state.isReload
              });
            }}
          />
        );
      }
    }
  ];
};

export default getPluginManageListColumns;
