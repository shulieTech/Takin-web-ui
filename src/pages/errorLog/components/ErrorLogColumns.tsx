/**
 * @name
 * @author chuxu
 */
import { Button, Modal, Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import React, { Fragment } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';

const getErrorLogColumns = (state, setState): ColumnProps<any>[] => {
  return [
    {
      ...customColumnProps,
      title: 'Agent Id',
      dataIndex: 'agentId'
    },
    {
      ...customColumnProps,
      title: '应用',
      dataIndex: 'projectName'
    },
    {
      ...customColumnProps,
      title: '异常日志',
      dataIndex: 'agentInfo',
      render: text => {
        return (
          <Fragment>
            <div
              style={{
                display: 'inline-block',
                width: 260,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
              }}
            >
              {text}
            </div>
            <Button
              type="link"
              onClick={() => {
                setState({
                  isShow: true,
                  errorMsg: text
                });
              }}
            >
              查看日志
            </Button>
          </Fragment>
        );
      }
    },
    {
      ...customColumnProps,
      title: '发生时间',
      dataIndex: 'agentTimestamp'
    }
  ];
};

export default getErrorLogColumns;
