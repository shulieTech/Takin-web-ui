/**
 * @name
 * @author chuxu
 */
import { Badge, Popconfirm } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { customColumnProps } from 'src/components/custom-table/utils';
import { getTakinAuthority } from 'src/utils/utils';
import Link from 'umi/link';
import PressureTestReportService from '../service';

const btnAuthority: any =
localStorage.getItem('trowebBtnResource') &&
JSON.parse(localStorage.getItem('trowebBtnResource'));

const getPressureTestReportColumns = (state, setState): ColumnProps<any>[] => {

  /**
   * @name 删除
   */
  const handleDelete = async reportId => {
    const {
      data: { success, data }
    } = await PressureTestReportService.deleteReport({ reportId });
    if (success) {
      setState({
        isReload: state?.isReload
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
    // {
    //   ...customColumnProps,
    //   title: '消耗流量（vum）',
    //   dataIndex: 'amount',
    //   className: getTakinAuthority() === 'true' ? '' : 'tableHiddle'
    // },
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
      dataIndex: 'nickName',
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
            {/* <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessActivity_4_delete
              }
            >
              <Popconfirm
                title="确定要删除吗？"
                okText="确认删除"
                cancelText="取消"
                onConfirm={() => handleDelete(row.id)}
              >
                <a href="#" style={{ marginRight: 8 }}>
                  删除
                </a>
              </Popconfirm>
            </AuthorityBtn> */}
            <Link
              to={`/pressureTestManage/pressureTestReport/details?id=${row.id}&sceneId=${row.sceneId}`}
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
