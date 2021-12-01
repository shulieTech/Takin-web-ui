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

  const hrefClick = async (row) => {
    const {
      data: { data, success }
    } = await AppManageService.goActivityInfo({
      applicationName: detailData.applicationName,
      label: row.serviceAndMethod,
      serviceName: row.service,
      method: row.method,
      type: 'HTTP',
      rpcType: row.rpcType,
      activityName: row.appName,
      activityNameAndId: null,
      businessDomain: '0',
      entranceName: '',
      extend: '',
      isCore: '0',
      linkId: '',
      link_level: '1',
      value: '',
      persistence: false
    });
    if (success) {
      const tempActivity = data[Object.keys(data)[0]];
      router.push(`/businessActivity/details?id=${
        Object.keys(data)[0]}&pageIndex=0&hideList=1${tempActivity ? 
          `&jsonParam=${encodeURIComponent(JSON.stringify({
            tempActivity,
            startTime: row.startTime,
            endTime: row.endTime,
            timeGap: row.timeGap
          }))}` : ''}`);
    }
  };

  const menu = row => {
    return (
      <div>
        {
          Object.keys(row).slice(1).map((ites, ind) => {
            return (
              <div key={ind} style={{ marginBottom: 8, lineHeight: '20px' }}>
                <a
                  onClick={() => router.push(`/businessActivity/details?id=${ites}&hideList=1`)}
                >
                  {row[ites]}
                </a>
              </div>
            );
          })
        }
      </div>
    );
  };

  return [
    {
      ...customColumnProps,
      title: '服务名称',
      dataIndex: 'serviceAndMethod',
      width: 200,
      render: (text, row) => {
        return (
          <Tooltip title={text}>
            <a
              style={{
                display: 'inline-block',
                width: 200,
                cursor: 'pointer'
              }}
              onClick={() => hrefClick(row)}
            >
              {text}
            </a>
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
        const btns = [];
        if (text?.allTotalRtBottleneckType !== -1) {
          btns.push(
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text?.rtBottleneckId}`)}
            >
              卡慢
            </Button>
          );
        }
        if (text?.allTotalRtBottleneckType === -1 && text?.allSqlTotalRtBottleneckType !== -1) {
          btns.push(
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text?.rtSqlBottleneckId}`)}
            >
              卡慢
            </Button>
          );
        }
        if (text?.allSuccessRateBottleneckType !== -1) {
          btns.push(
            <Button
              type="primary"
              onClick={() => router.push(`/pro/bottleneckTable/bottleneckDetails?exceptionId=${text?.successRateBottleneckId}`)}
              style={{
                marginLeft: 10
              }}
            >
              接口异常
            </Button>
          );
        }

        return btns.length > 0 ? <span>{btns}</span> : '正常';
      }
    },
    {
      ...customColumnProps,
      title: '健康度设置',
      dataIndex: 'requestCount',
      width: 100,
      render: text => <span>设置</span>
    },
    {
      ...customColumnProps,
      title: '关联业务活动名称',
      dataIndex: 'activeIdAndName',
      width: 200,
      render: (text, row) => {
        if (Object.keys(text).length === 0) {
          return '-';
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
