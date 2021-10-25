/**
 * @name
 * @author chuxu
 */
import { Badge, Button, Dropdown, Icon, Menu, message, Modal, Popconfirm, Row, Switch, Tag } from 'antd';
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
      label: row.serviceAndMethod
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
      label: row.serviceAndMethod
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
          Object.keys(row).map((ites, ind) => {
            return (
              <Menu.Item
                key={ind}
                onClick={() => router.push(`/businessActivity/details?id=${ites}`)}
              >
                {row[ites]}
              </Menu.Item>
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
      width: 200
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
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.rtBottleneckId}`)}
              style={{
                display: text.allTotalRtBottleneckType !== -1 ? 'inline-block' : 'none'
              }}
            >
              卡慢
            </Button>
            <div
              style={{
                display: text.allTotalRtBottleneckType !== -1 ? 'none' : 'inline-block'
              }}
            >
              <Button
                type="primary"
                onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.rtSqlBottleneckId}`)}
                style={{
                  display: text.allSqlTotalRtBottleneckType !== -1 ? 'inline-block' : 'none'
                }}
              >
                卡慢
              </Button>
            </div>
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.successRateBottleneckId}`)}
              style={{
                display: text.allSuccessRateBottleneckType !== -1 ? 'inline-block' : 'none',
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
      render: (text, row) => {
        if (Object.keys(text).length === 0) {
          return;
        }
        return (
          <Fragment>
            <div>
              <Dropdown overlay={menu(text)} trigger={['click']}>
                <Button>
                  关联业务活动 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </Fragment>
        );

      }
    },
    {
      ...customColumnProps,
      title: '关注',
      dataIndex: 'attend',
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
