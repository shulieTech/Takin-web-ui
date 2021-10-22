/**
 * @name
 * @author chuxu
 */
import { Badge, Button, Icon, message, Modal, Popconfirm, Switch, Tag } from 'antd';
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
      appName: detailData.appName,
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
      appName: detailData.appName,
      label: row.serviceAndMethod
    });
    if (success) {
      message.success('关注成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '服务名称',
      dataIndex: 'serviceAndMethod'
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
      key: 'SUCCESSRATE'
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
      render: (text, row) => {
        if (text.allTotalRtBottleneckType !== -1) {
          return (
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.rtBottleneckId}`)}
            >
              卡慢
            </Button>);
        }
        if (text.allSqlTotalRtBottleneckType !== -1) {
          return (
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.rtSqlBottleneckId}`)}
            >
              卡慢
            </Button>);
        }
        if (text.allSuccessRateBottleneckType !== -1) {
          return (
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.successRateBottleneckId}`)}
            >
              接口异常
            </Button>);
        }
      }
    },
    {
      ...customColumnProps,
      title: '关联业务活动名称',
      dataIndex: 'activeList',
      render: (text, row) => {
        return text.map((ite, index) => {
          return (
            <Button
              type="primary"
              key={index}
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text.successRateBottleneckId}`)}
            >
              接口异常
            </Button>
          );
        });
      }
    },
    {
      ...customColumnProps,
      title: '关注',
      dataIndex: 'isAttend',
      render: (text, row) => {
        if (text) {
          return <Icon type="heart" theme="filled" onClick={() => cancel(row)} />;
        }
        return <Icon type="heart" onClick={() => heart(row)}/>;
      }
    },
  ];
};

export default getBlackListColumns;
