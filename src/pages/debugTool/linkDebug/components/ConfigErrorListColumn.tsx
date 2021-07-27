/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Divider, Popover, Tag, Tooltip } from 'antd';
import styles from './../index.less';

const getConfigErrorListColumn = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: '应用',
      dataIndex: 'applicationName'
    },
    {
      ...customColumnProps,
      title: 'Agent ID',
      dataIndex: 'agentId',
      width: 130,
      render: text => {
        return text && text.length >= 1 ? (
          <div style={{ display: 'flex' }}>
            <Tag>
              <span
                style={{
                  width: 50,
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {text[0]}
              </span>
            </Tag>
            <Popover
              placement="bottom"
              trigger="click"
              title="异常Agent Id"
              content={
                <div className={styles.agentIds}>
                  {text.map((item, k) => {
                    return (
                      <p key={k}>
                        {item} <Divider />
                      </p>
                    );
                  })}
                </div>}
            >
              <Tag>...</Tag>
            </Popover>
          </div>
        ) : (
          '-'
        );
      }
    },
    {
      ...customColumnProps,
      title: '异常类型',
      dataIndex: 'type'
    },
    {
      ...customColumnProps,
      title: '异常编码',
      dataIndex: 'code'
    },
    {
      ...customColumnProps,
      title: '异常描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            title={
              <div style={{ overflow: 'scroll', maxHeight: 300 }}>{text}</div>}
            placement="bottomLeft"
          >
            <span style={{ color: '#ED5F47' }}>{text}</span>
          </Tooltip>
        );
      }
    },
    {
      ...customColumnProps,
      title: '处理建议',
      dataIndex: 'suggestion',
      width: 200,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            title={
              <div style={{ overflow: 'scroll', maxHeight: 300 }}>{text}</div>}
            placement="bottomLeft"
          >
            <span>{text}</span>
          </Tooltip>
        );
      }
    },
    {
      ...customColumnProps,
      title: '异常时间',
      dataIndex: 'time'
    }
  ];
};

export default getConfigErrorListColumn;
