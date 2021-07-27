/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { message, Button, Switch, Badge, Modal } from 'antd';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import NewKanbanModal from '../modals/NewKanbanModal';
import { router } from 'umi';
import MissionManageService from '../service';
import moment from 'moment';

const getMissionManageColumns = (state, setState): ColumnProps<any>[] => {
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await MissionManageService.deleteMission({ id });
    if (success) {
      message.success('删除成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '瓶颈类型',
      dataIndex: 'type',
      render: text => {
        return { 0: '全部', 1: '卡慢', 2: '接口异常', 3: '巡检异常' }[text];
      }
    },
    {
      ...customColumnProps,
      title: '巡检任务',
      dataIndex: 'businessName',
      render: text => (text ? text : '全部')
    },
    {
      ...customColumnProps,
      title: '巡检场景',
      dataIndex: 'sceneName',
      render: text => (text ? text : '全部')
    },
    {
      ...customColumnProps,
      title: '巡检看板',
      dataIndex: 'boardName',
      render: text => (text ? text : '全部')
    },
    {
      ...customColumnProps,
      title: '接收方式',
      dataIndex: 'channel',
      render: text => (text === 1 ? '企业微信' : text === 0 ? '钉钉' : '自定义')
    },
    {
      ...customColumnProps,
      title: '最新修改时间',
      dataIndex: 'modifyTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'
    },
    {
      ...customColumnProps,
      title: '修改人',
      dataIndex: 'userName'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            {row.canEdit && (
              <NewKanbanModal
                btnText="编辑"
                type="link"
                state={state}
                id={row.id}
                row={row}
                setState={setState}
                onSuccess={() => {
                  setState({
                    isReload: !state.isReload,
                    searchParams: {
                      current: 0
                    }
                  });
                }}
              />
            )}
            <span style={{ marginLeft: 5 }} />
            {row.canRemove && (
              <CustomPopconfirm
                title="是否确定删除？"
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDelete(row.id)}
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
