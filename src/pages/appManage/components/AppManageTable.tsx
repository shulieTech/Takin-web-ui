/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import Link from 'umi/link';
import { Badge } from 'antd';
import { appConfigStatusMap, appConfigStatusColorMap } from '../enum';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { getTakinAuthority } from 'src/utils/utils';

const getColumns = (state, setState): ColumnProps<any>[] => {
  const userType: string = localStorage.getItem('troweb-role');
  const expire: string = localStorage.getItem('troweb-expire');

  return [
    {
      ...customColumnProps,
      title: '应用名称',
      dataIndex: 'applicationName'
    },
    {
      ...customColumnProps,
      title: '接入状态',
      dataIndex: 'accessStatus',
      render: (text, row) => {
        return (
          <Badge
            text={appConfigStatusMap[`${text}`]}
            color={appConfigStatusColorMap[`${text}`]}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '负责人',
      dataIndex: 'managerName',
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            {userType === '0' &&
              expire === 'false' &&
              getTakinAuthority() === 'true' && (
                <span style={{ marginRight: 8 }}>
                  <AdminDistributeModal
                    dataId={row.id}
                    btnText="分配给"
                    menuCode="APPLICATION_MNT"
                    onSccuess={() => {
                      setState({
                        isReload: !state.isReload
                      });
                    }}
                  />
                </span>
              )}

            <Link to={`/appManage/details?tabKey=0&id=${row.id}`}>
              应用详情
            </Link>
          </Fragment>
        );
      }
    }
  ];
};

export default getColumns;
