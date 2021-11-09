/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge, Button, Col, Popconfirm, Row, Tag } from 'antd';
import TableTwoRows from 'src/common/table-two-rows/TableTwoRows';
import moment from 'moment';
import styles from './../index.less';
import {
  businessFlowStatusColorMap,
  businessFlowStatusMap,
  BusinessFlowBean
} from '../enum';
import { Link } from 'umi';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import BusinessFlowService from '../service';

const getBusinessFlowColumns = (state, setState): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const userType: string = localStorage.getItem('troweb-role');
  const expire: string = localStorage.getItem('troweb-expire');
  /**
   * @name 删除
   */
  const handleDelete = async id => {
    const {
      data: { success, data }
    } = await BusinessFlowService.deleteBusinessFlow({ id });
    if (success) {
      setState({
        isReload: !state.isReload
      });
    }
  };
  return [
    {
      ...customColumnProps,
      title: '业务活动',
      dataIndex: BusinessFlowBean.业务活动名称,
      width: 350,
      render: (text, row) => {
        return (
          <TableTwoRows
            title={row[BusinessFlowBean.业务活动名称]}
            secondLineContent={[
              {
                label: 'ID：',
                value: row[BusinessFlowBean.ID]
              },
              {
                label: '状态：',
                value: (
                  <Badge
                    color={
                      businessFlowStatusColorMap[row[BusinessFlowBean.状态]]
                    }
                    text={businessFlowStatusMap[row[BusinessFlowBean.状态]]}
                  />
                )
              },
              {
                label: '来源：',
                value: row[BusinessFlowBean.来源] ? (
                  <Tag>
                    {row[BusinessFlowBean.来源] === 1 ? 'Jmeter' : '手工'}
                  </Tag>
                ) : (
                  '-'
                )
              }
            ]}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '统计',
      dataIndex: BusinessFlowBean.已完成,
      width: 200,
      render: (text, row) => {
        return (
          <Row type="flex">
            <Col span={8}>
              <p className={styles.title}>总计</p>
              <p className={styles.value}>{row[BusinessFlowBean.总计]}</p>
            </Col>
            <Col span={8}>
              <p className={styles.title}>已完成</p>
              <p
                className={styles.value}
                style={{
                  color: 'var(--FunctionalSuccess-500)'
                }}
              >
                {text}
              </p>
            </Col>
          </Row>
        );
      }
    },
    {
      ...customColumnProps,
      title: '负责人',
      dataIndex: BusinessFlowBean.负责人
    },
    {
      ...customColumnProps,
      title: '最后更新时间',
      dataIndex: BusinessFlowBean.最后更新时间,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '-'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'gmtUpdate',
      render: (text, row) => {
        return (
          <Fragment>
            {/* {userType === '0' &&
            expire === 'false' &&
            getTakinAuthority() === 'true' && (
              <span style={{ marginRight: 8 }}>
                <AdminDistributeModal
                  dataId={row.id}
                  btnText="分配给"
                  menuCode="BUSINESS_FLOW"
                  onSccuess={() => {
                    setBusinessFlowState({
                      isReload: !BusinessFlowState.isReload
                    });
                  }}
                />
              </span>
            )} */}
            <Link
              style={{ marginRight: 8 }}
              to={`/businessFlow/details?id=${row.id}`}
            >
              详情
            </Link>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessFlow_3_update &&
                row.canEdit
              }
            >
              <Link
                style={{ marginRight: 8 }}
                to={`/businessFlow/details?id=${row.id}`}
              >
                编辑
              </Link>
            </AuthorityBtn>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessFlow_4_delete &&
                row.canRemove
              }
            >
              <Popconfirm
                title="确定要删除吗？"
                okText="确认删除"
                cancelText="取消"
                onConfirm={() => handleDelete(row.id)}
              >
                <Button style={{ marginRight: 8 }} type="link">
                  删除
                </Button>
              </Popconfirm>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

export default getBusinessFlowColumns;
