/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import {
  Badge,
  Popconfirm,
  Switch,
  Divider,
  message,
  Tag,
  Popover
} from 'antd';
import { InterfaceType } from 'src/pages/appManage/enum';
import styles from './../index.less';

const getAppWhiteListColumns = (state, setState): ColumnProps<any>[] => {
  const handleClick = wlistId => {
    setState({ wlistId });
  };

  return [
    {
      ...customColumnProps,
      title: '应用名称',
      dataIndex: 'appName',
      width: 200
    },
    {
      ...customColumnProps,
      title: '接口名称',
      dataIndex: 'interfaceName',
      width: 320,
      render: (text, row) => {
        return (
          <div>
            <span style={{ marginRight: 8 }}>{text}</span>
            {row.tags &&
              row.tags.map((item, k) => {
                return <Tag key={k}>{item}</Tag>;
              })}
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'useYn',
      render: (text, row) => {
        return (
          <Badge
            text={text === 0 ? '未加入' : '已加入'}
            color={text === 0 ? '#A2A6B1' : '#11BBD5'}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '接口类型',
      dataIndex: 'interfaceType',
      render: text => {
        return (
          <Tag className={styles.tagStyle}>
            {InterfaceType[text] || 'UNKNOWN'}
          </Tag>
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'gmtModified'
    },
    {
      ...customColumnProps,
      title: '生效范围',
      dataIndex: 'isGlobal',
      render: (text, row) => {
        return (
          <div>
            {text ? '全部生效' : '部分生效'}
            {!text && (
              <Popover
                placement="bottom"
                trigger="click"
                title="生效范围列表"
                content={
                  <div className={styles.agentIds}>
                    {row.effectiveAppNames &&
                      row.effectiveAppNames.map((item, k) => {
                        return (
                          <p key={k}>
                            {item} <Divider />
                          </p>
                        );
                      })}
                  </div>}
              >
                <a style={{ marginLeft: 8 }}>查看</a>
              </Popover>
            )}
          </div>
        );
      }
    }
  ];
};

export default getAppWhiteListColumns;
