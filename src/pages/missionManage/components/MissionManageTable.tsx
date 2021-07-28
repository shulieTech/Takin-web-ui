/**
 * @name
 * @author chuxu
 */
import React, { Fragment, useState } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { message, Button, Switch, Badge, Modal } from 'antd';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import MissionManageService from '../service';
import { router } from 'umi';
import ExceptionDetailsModal from '../modals/ExceptionDetailsModal';
import moment from 'moment';
let numbers = 0;
const getMissionManageColumns = (state, setState): ColumnProps<any>[] => {
  const { confirm } = Modal;
  const showModal = (patrolSceneId, text, sceneId) => {
    confirm({
      title: text === 0 ? '是否确认开启任务？' : '是否确认关闭任务？',
      okText: text === 0 ? '确认开启' : '确认关闭',
      onOk() {
        text === 0
          ? startMission(patrolSceneId)
          : closeMission(patrolSceneId, sceneId);
      }
    });
  };
  /**
   * @name 删除巡检任务
   */
  const handleDelete = async patrolSceneId => {
    const {
      data: { data, success }
    } = await MissionManageService.deleteMission({ patrolSceneId });
    if (success) {
      message.success('删除成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  const startMission = async patrolSceneId => {
    setState({
      visible: true,
      configStatus: 'loading',
      startStatus: 'ready',
      status: '启动'
    });
    const {
      data: { data, success, error }
    } = await MissionManageService.startMission({ sceneId: patrolSceneId });
    if (success) {
      setState({
        configStatus: 'success'
      });
      handleStart(patrolSceneId, data.sceneId);
    } else {
      setState({
        startStatus: 'fail',
        configStatus: 'fail',
        startErrorList: error && error.msg
      });
    }
  };

  const handleStart = async (patrolSceneId, sceneId) => {
    setState({
      startStatus: 'loading'
    });
    const {
      data: { data, success, error }
    } = await MissionManageService.checkStartStatus({ patrolSceneId, sceneId });
    if (success && data.patrolStatus !== 0) {
      if (data.patrolStatus === 2) {
        setState({
          startStatus: 'success'
        });
        message.success('开启巡检任务成功！');
        setState({
          isReload: !state.isReload,
          visible: false
        });
      } else if (data.patrolStatus === 5) {
        setTimeout(() => {
          handleStart(patrolSceneId, sceneId);
        }, 500);
      }
    } else {
      setState({
        startStatus: 'fail',
        startErrorList: error && error.msg
      });
    }
  };

  const closeMission = async (patrolSceneId, sceneId) => {
    setState({
      visible: true,
      configStatus: 'loading',
      startStatus: 'ready',
      status: '关闭'
    });
    const {
      data: { data, success, error }
    } = await MissionManageService.closeMission({ sceneId: patrolSceneId });
    if (success) {
      setState({
        configStatus: 'success'
      });
      handleClone(patrolSceneId, sceneId);
    } else {
      setState({
        startStatus: 'fail',
        configStatus: 'fail',
        startErrorList: error && error.msg
      });
    }
  };

  const handleClone = async (patrolSceneId, sceneId) => {
    setState({
      startStatus: 'loading'
    });
    numbers = numbers + 5;
    const {
      data: { data, success, error }
    } = await MissionManageService.checkStopStatus({ patrolSceneId, sceneId });
    if (success) {
      if (data.patrolStatus === 0) {
        setState({
          startStatus: 'success'
        });
        message.success('关闭巡检任务成功！');
        numbers = 0;
        setState({
          isReload: !state.isReload,
          visible: false
        });
      } else {
        if (numbers <= 300) {
          setTimeout(() => {
            handleClone(patrolSceneId, sceneId);
          }, 500);
        } else {
          message.error('巡检任务关闭超时，继续后台关闭中...');
          numbers = 0;
          setState({
            isReload: !state.isReload,
            visible: false
          });
        }
      }
    } else {
      setState({
        startStatus: 'fail',
        startErrorList: error && error.msg
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: 'ID',
      dataIndex: 'patrolSceneId'
    },
    {
      ...customColumnProps,
      title: '巡检场景',
      dataIndex: 'patrolSceneName'
    },
    {
      ...customColumnProps,
      title: '巡检看板',
      dataIndex: 'patrolBoardName'
    },
    {
      ...customColumnProps,
      title: '巡检数量',
      dataIndex: 'refNum'
    },
    {
      ...customColumnProps,
      title: '巡检任务状态',
      dataIndex: 'patrolStatus',
      render: text => {
        return (
          <Badge
            color={
              {
                0: '#A2A6B1',
                1: '#EA5B3C',
                2: '#11BBD5',
                3: '#EA5B3C',
                4: '#EA5B3C',
                5: 'yellow',
                6: 'yellow'
              }[text]
            }
            text={
              {
                0: '未启动',
                1: '巡检配置异常',
                2: '正常巡检',
                3: '巡检启动异常',
                4: '巡检运行异常',
                5: '巡检启动中',
                6: '巡检停止中'
              }[text]
            }
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '任务启用状态',
      dataIndex: 'taskStatus',
      render: (text, row) => {
        return (
          <Switch
            checked={text === 1 ? true : text === 0 ? false : null}
            onClick={() => showModal(row.patrolSceneId, text, row.sceneId)}
            disabled={!row.canStartStop}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'modifyTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <span
              style={{
                display:
                  row.patrolStatus === 1 ||
                  row.patrolStatus === 3 ||
                  row.patrolStatus === 4
                    ? 'inline-block'
                    : 'none',
                marginRight: 9
              }}
            >
              <ExceptionDetailsModal
                btnText="查看异常详情"
                id={row.patrolSceneId}
              />
            </span>
            {row.canEdit && (
              <a
                onClick={() =>
                  router.push(
                    `/missionManage/sceneDetails?id=${row.patrolSceneId}&type=edit`
                  )
                }
                style={{
                  display: row.taskStatus === 1 ? 'none' : 'inline-block'
                }}
              >
                编辑
              </a>
            )}
            <a
              onClick={() =>
                router.push(
                  `/missionManage/sceneDetails?id=${row.patrolSceneId}&type=detail`
                )
              }
              style={{
                display: row.taskStatus !== 1 ? 'none' : 'inline-block'
              }}
            >
              详情
            </a>
            {row.canRemove && (
              <CustomPopconfirm
                title="是否确定删除？"
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDelete(row.patrolSceneId)}
              >
                <Button type="link" style={{ marginLeft: 8 }}>
                  删除
                </Button>
              </CustomPopconfirm>
            )}
          </Fragment>
        );
      }
    }
  ];
};

export default getMissionManageColumns;
