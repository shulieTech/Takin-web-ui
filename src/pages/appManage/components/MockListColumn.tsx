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
import AppManageService from '../service';
import MockConfigModal from '../modals/MockConfigModal';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

const getMockListColumns = (
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
      title: '接口名称',
      dataIndex: 'interfaceName',
      render: (text, row) => {
        return (
          <span>
            {row.isException && (
              <img
                style={{ width: 18, marginRight: 8 }}
                src={require('./../../../assets/explain_icon.png')}
              />
            )}
            {text}
          </span>
        );
      }
    },
    {
      ...customColumnProps,
      title: '接口类型',
      dataIndex: 'interfaceTypeSelectVO',
      render: text => {
        return <Tag>{text && text.label}</Tag>;
      }
    },
    {
      ...customColumnProps,
      title: '服务端应用',
      dataIndex: 'serverAppNames',
      render: (text, row) => {
        if (row.isException) {
          return (
            <span style={{ color: '#ED6047' }}>
              危险异常：已加入白名单，服务端有异常
            </span>
          );
        }
        if (!row.serverAppNames) {
          return '-';
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.serverAppName}>
              {row.serverAppNames && row.serverAppNames[0]}
            </span>
            <span style={{ marginLeft: 8 }}>{row.count}个</span>
            <Popover
              placement="bottomLeft"
              trigger="click"
              content={
                <div
                  className={styles.agentIds}
                  style={{ width: 280, height: 288, overflow: 'scroll' }}
                >
                  {text &&
                    text.map((item, k) => {
                      return (
                        <p key={k}>
                          {item} <Divider />
                        </p>
                      );
                    })}
                </div>
              }
            >
              <Icon style={{ marginLeft: 16, color: '#11D0C5' }} type="down" />
            </Popover>
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '隔离方案',
      dataIndex: 'typeSelectVO',
      render: text => {
        return <span>{text && text.label}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'gmtModified'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <Fragment>
            <AuthorityBtn isShow={row.canEdit}>
              <MockConfigModal
                action="edit"
                btnText="编辑配置"
                id={row.id}
                applicationId={applicationId}
                interfaceName={row.interfaceName}
                interfaceType={
                  row.interfaceTypeSelectVO && row.interfaceTypeSelectVO.value
                }
                serverAppName={row.serverAppName}
                type={row.typeSelectVO && row.typeSelectVO.value}
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getMockListColumns;
