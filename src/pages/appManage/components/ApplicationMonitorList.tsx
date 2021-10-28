/**
 * @name
 * @author chuxu
 */
import { Button, Icon, Menu, message, Modal, Popconfirm, Popover, Row, Switch, Tag, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import { customColumnProps } from 'src/components/custom-table/utils';
import { router } from 'umi';
import AppManageService from '../service';
import AddAndEditBlacklistDrawer from './AddAndEditBlackListDrawer';

const getBlackListColumns = (
  state,
  setState,
  detailState,
  applicationId,
  action,
  detailData
): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  const cancel = async (row) => {
    const {
      data: { data, success }
    } = await AppManageService.attendService({
      attend: false,
      appName: row.appName,
      serviceName: row.serviceAndMethod
    });
    if (success) {
      message.success('取消关注成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  const heart = async (row) => {
    const {
      data: { data, success }
    } = await AppManageService.attendService({
      attend: true,
      appName: row.appName,
      serviceName: row.serviceAndMethod
    });
    if (success) {
      message.success('关注成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  const menu = row => {
    return (
      <Menu>
        {
          Object.keys(row).splice(1, 1).map((ites, ind) => {
            return (
              <Button
                key={ind}
                onClick={() => router.push(`/businessActivity/details?id=${ites}&hideList=1`)}
              >
                {row[ites]}
              </Button>
            );
          })
        }
      </Menu>
    );
  };

  return [
    {
      ...customColumnProps,
      title: '服务名称',
      dataIndex: 'serviceAndMethod',
      render: (text, row) => {
        return (
          <Tooltip title={text}>
            <span
              style={{
                display: 'inline-block',
                width: 100,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {text}
            </span>
          </Tooltip>
        );
      }
    },
    {
      ...customColumnProps,
      title: '请求量',
      dataIndex: 'requestCount',
      sorter: true,
      key: 'QPS'
    },
    {
      ...customColumnProps,
      title: 'TPS（次/秒）',
      dataIndex: 'tps',
      width: 120,
      sorter: true,
      key: 'TPS'
    },
    {
      ...customColumnProps,
      title: 'RT（ms）',
      dataIndex: 'responseConsuming',
      sorter: true,
      key: 'RT'
    },
    {
      ...customColumnProps,
      title: '成功率',
      dataIndex: 'successRatio',
      sorter: true,
      key: 'SUCCESSRATE',
      render: text => `${text * 100}%`
    },
    {
      ...customColumnProps,
      title: '中间件类型',
      dataIndex: 'middlewareName',
    },
    {
      ...customColumnProps,
      title: '健康度',
      dataIndex: 'response',
      width: 200,
      render: (text, row) => {
        return (
          <Row>
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text?.rtBottleneckId}`)}
              style={{
                display: text?.allTotalRtBottleneckType !== -1 ? 'inline-block' : 'none'
              }}
            >
              卡慢
            </Button>
            <div
              style={{
                display: text?.allTotalRtBottleneckType !== -1 ? 'none' : 'inline-block'
              }}
            >
              <Button
                type="primary"
                onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text?.rtSqlBottleneckId}`)}
                style={{
                  display: text?.allSqlTotalRtBottleneckType !== -1 ? 'inline-block' : 'none'
                }}
              >
                卡慢
              </Button>
            </div>
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text?.successRateBottleneckId}`)}
              style={{
                display: text?.allSuccessRateBottleneckType !== -1 ? 'inline-block' : 'none',
                marginLeft: 10
              }}
            >
              接口异常
            </Button>
          </Row>);
      }
    },
    {
      ...customColumnProps,
      title: '关联业务活动名称',
      dataIndex: 'activeIdAndName',
      width: 250,
      render: (text, row) => {
        if (Object.keys(text).length === 0) {
          return;
        }
        if (Object.keys(text).length < 2) {
          return Object.keys(text).map((ites, ind) => {
            return (
              <Button
                key={ind}
                onClick={() => router.push(`/businessActivity/details?id=${ites}&hideList=1`)}
              >
                {text[ites]}
              </Button>
            );
          });
        }
        return (
          <Fragment>
            {
              Object.keys(text).map((ites, ind) => {
                if (ind === 0) {
                  return (
                    <Button
                      key={ind}
                      onClick={() => router.push(`/businessActivity/details?id=${ites}`)}
                    >
                      {text[ites]}
                    </Button>
                  );
                }
              })
            }
            <span style={{ marginLeft: 10 }} />
            <Popover content={menu(text)}>
              <Icon type="down" />
            </Popover>
          </Fragment>
        );

      }
    },
    {
      ...customColumnProps,
      title: '关注',
      dataIndex: 'attend',
      width: 50,
      render: (text, row) => {
        if (text) {
          return <Icon type="heart" theme="filled" onClick={() => cancel(row)} />;
        }
        return <Icon type="heart" onClick={() => heart(row)} />;
      }
    },
  ];
};

export default getBlackListColumns;
