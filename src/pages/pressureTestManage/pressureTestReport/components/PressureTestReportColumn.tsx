/**
 * @name
 * @author chuxu
 */
import { Badge, Button, Popconfirm, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import { getTakinAuthority } from 'src/utils/utils';
import Link from 'umi/link';
import PressureTestReportService from '../service';

const getPressureTestReportColumns = (state, setState): ColumnProps<any>[] => {

  /**
   * @name 删除黑名单(单个)
   */
  const handleDelete = async id => {
    const {
        data: { data, success }
      } = await PressureTestReportService.deleteReport({
        id
      });
    if (success) {
      message.success(`删除成功`);
      setState({
        isReload: !state.isReload
      });
    }
  };
  return [
    {
      ...customColumnProps,
      title: '压测报告ID',
      dataIndex: 'id'
    },
    {
      ...customColumnProps,
      title: '压测场景ID',
      dataIndex: 'sceneId'
    },
    {
      ...customColumnProps,
      title: '压测场景名称',
      dataIndex: 'sceneName'
    },
    {
      ...customColumnProps,
      title: '最大并发',
      dataIndex: 'concurrent'
    },
    {
      ...customColumnProps,
      title: '压测时长',
      dataIndex: 'totalTime'
    },
    {
      ...customColumnProps,
      title: '消耗流量（vum）',
      dataIndex: 'amount',
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle'
    },
    {
      ...customColumnProps,
      title: '压测开始时间',
      dataIndex: 'startTime'
    },
    {
      ...customColumnProps,
      title: '压测结果',
      dataIndex: 'conclusion',
      render: text => {
        return (
          <Badge
            text={text === 1 ? '通过' : '不通过'}
            color={
              text === 1
                ? 'var(--BrandPrimary-500)'
                : 'var(--FunctionalError-500)'
            }
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '执行人',
      dataIndex: 'userName',
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <Popconfirm
                onConfirm={() => handleDelete(row.id)}
                title="确认删除报告吗?"
            >
                <Button style={{ marginRight: 8 }} type="link">
                  删除
                </Button>
              </Popconfirm>
            <Link
              to={`/pressureTestManage/pressureTestReport/reportDetails?id=${row.id}&sceneId=${row.sceneId}`}
            >
              查看报告
            </Link>
          </Fragment>
        );
      }
    }
  ];
};

export default getPressureTestReportColumns;
