/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge, Button, message, Popover, Tooltip } from 'antd';
import TableTwoRows from 'src/common/table-two-rows/TableTwoRows';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import {
  agentStatusColorMap,
  agentStatusMap,
  probeStatusColorMap,
  probeStatusMap
} from '../enum';
import MiddlewareModal from '../modals/MiddlewareModal';
import ErrorLogModal from '../modals/ErrorLogModal';

const getAgentManageColumns = (state, setState): ColumnProps<any>[] => {
  /**
   * @name 复制
   */
  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };
  return [
    {
      ...customColumnProps,
      title: '应用',
      dataIndex: 'projectName',
      width: 350,
      render: (text, row) => {
        return (
          <TableTwoRows
            icon={
              <img
                style={{ marginRight: 8 }}
                width={56}
                src={require('./../../../assets/agent_app_icon.png')}
              />
            }
            title={
              text && text.length > 25 ? (
                <Tooltip trigger="hover" title={text}>
                  {`${text.slice(0, 23)}...`}
                </Tooltip>
              ) : (
                text
              )
            }
            secondLineContent={[
              {
                label: 'IP：',
                value: row.ipAddress
              },
              { label: '进程号：', value: row.progressId }
            ]}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: 'AgentId',
      dataIndex: 'agentId'
    },
    {
      ...customColumnProps,
      title: 'Agent版本',
      dataIndex: 'agentVersion',
      width: 100
    },
    {
      ...customColumnProps,
      title: 'agent状态',
      dataIndex: 'agentStatus',
      width: 120,
      render: (text, row) => {
        if (text) {
          return (
            <Fragment>
              <Badge
                text={agentStatusMap[text]}
                color={agentStatusColorMap[text]}
              />
              {text === '4' && (
                <Popover
                  title="详情"
                  content={
                    <div
                      style={{ width: 360, height: 280, overflowY: 'scroll' }}
                    >
                      <Button
                        type="link"
                        style={{ marginBottom: 16 }}
                        onClick={() => handleCopy(row.agentErrorMsg)}
                      >
                        复制
                      </Button>
                      <p>{row.agentErrorMsg}</p>
                    </div>
                  }
                  trigger="click"
                >
                  <Button type="link" style={{ marginLeft: 8 }}>
                    详情
                  </Button>
                </Popover>
              )}
            </Fragment>
          );
        }
        return '-';
      }
    },
    {
      ...customColumnProps,
      title: '探针版本',
      dataIndex: 'probeVersion',
      width: 100
    },
    {
      ...customColumnProps,
      title: '探针状态',
      dataIndex: 'probeStatus',
      width: 120,
      render: (text, row) => {
        if (text) {
          return (
            <Fragment>
              <Badge
                text={probeStatusMap[text]}
                color={probeStatusColorMap[text]}
              />
              {text === '4' && (
                <Popover
                  title="详情"
                  content={
                    <div
                      style={{ width: 360, height: 280, overflowY: 'scroll' }}
                    >
                      <Button
                        type="link"
                        style={{ marginBottom: 16 }}
                        onClick={() => handleCopy(row.probeErrorMsg)}
                      >
                        复制
                      </Button>
                      <p>{row.probeErrorMsg}</p>
                    </div>
                  }
                  trigger="click"
                >
                  <Button type="link" style={{ marginLeft: 8 }}>
                    详情
                  </Button>
                </Popover>
              )}
            </Fragment>
          );
        }
        return '-';
      }
    },

    {
      ...customColumnProps,
      title: '心跳时间',
      dataIndex: 'agentUpdateTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '-',
      width: 100
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (text, row) => {
        return (
          <Fragment>
            <span style={{ marginRight: 8 }}>
              <ErrorLogModal
                agentId={row.agentId}
                btnText="异常日志"
                progressId={row.progressId}
                projectName={row.projectName}
                ip={row.ipAddress}
              />
            </span>

            <MiddlewareModal
              agentId={row.agentId}
              btnText="查看插件"
              progressId={row.progressId}
              projectName={row.projectName}
              ip={row.ipAddress}
            />
          </Fragment>
        );
      }
    }
  ];
};

export default getAgentManageColumns;
