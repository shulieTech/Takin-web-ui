/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import styles from './../index.less';
import TableIndex from 'src/common/table-index/TableIndex';
import { Badge, Divider, Icon, message, Popover, Tag } from 'antd';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import TableMultiRows from 'src/common/table-multi-rows/TableMultiRows';
import TableTwoRows from 'src/common/table-two-rows/TableTwoRows';
import VersionListModal from '../modals/VersionListModal';
import EditMiddlewareModal from '../modals/EditMiddlewareModal';
import moment from 'moment';
import { middlewareStatusColorMap, middlewareStatusMap } from '../enum';

const getMiddlewareManageColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: 'ID',
      dataIndex: 'id',
      render: text => {
        return <TableIndex text={text || '-'} />;
      }
    },
    {
      ...customColumnProps,
      title: '中间件',
      dataIndex: 'artifactId',
      render: (text, row) => {
        return (
          <TableMultiRows
            dataSource={[
              { label: 'Aritifact ID:', value: row.artifactId },
              { label: 'Group ID:', value: row.groupId }
            ]}
            labelWidth={75}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '类型',
      dataIndex: 'type',
      width: 60,
      render: text => {
        return <Tag>{text}</Tag>;
      }
    },
    {
      ...customColumnProps,
      title: '中间件支持情况',
      dataIndex: 'totalNum',
      width: 350,
      render: (text, row) => {
        return (
          <TableTwoRows
            title={
              <Badge
                color={middlewareStatusColorMap[row.status]}
                text={middlewareStatusMap[row.status]}
              />
            }
            secondLineContent={
              row.status !== 3
                ? [
                  {
                    label: '总版本：',
                    value: row.totalNum
                  },
                    { label: '已支持版本：', value: row.supportedNum },
                    { label: '未知：', value: row.unknownNum, isError: true }
                ]
                : [
                  {
                    label: '总版本：',
                    value: '-'
                  }
                ]
            }
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后更新时间',
      dataIndex: 'gmtUpdate',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '-'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render: (text, row) => {
        return (
          <Fragment>
            {row.status !== 3 ? (
              <VersionListModal
                btnText="版本详情"
                artifactId={row.artifactId}
                groupId={row.groupId}
              />
            ) : (
              <a disabled={true}>版本详情</a>
            )}

            <AuthorityBtn isShow={row.canEdit}>
              <span style={{ marginLeft: 8 }}>
                <EditMiddlewareModal
                  btnText="编辑"
                  type="1"
                  details={row}
                  id={row.id}
                  onSuccess={() => {
                    setState({
                      isReload: !state.isReload
                    });
                  }}
                />
              </span>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getMiddlewareManageColumns;
