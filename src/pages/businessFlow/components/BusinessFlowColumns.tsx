/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge, Col, Row, Tag } from 'antd';
import TableTwoRows from 'src/common/table-two-rows/TableTwoRows';
import moment from 'moment';
import styles from './../index.less';
import {
  businessActivityStatusColorMap,
  businessActivityStatusMap,
  BusinessFlowBean
} from '../enum';

const getBusinessFlowColumns = (state, setState): ColumnProps<any>[] => {
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
                      businessActivityStatusColorMap[row[BusinessFlowBean.状态]]
                    }
                    text={businessActivityStatusMap[row[BusinessFlowBean.状态]]}
                  />
                )
              },
              {
                label: '来源：',
                value: row[BusinessFlowBean.来源] ? (
                  <Tag>{row[BusinessFlowBean.来源]}</Tag>
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
      dataIndex: 'type',
      width: 250,
      render: text => {
        return (
          <Row type="flex">
            <Col span={8}>
              <p className={styles.title}>节点</p>
              <p className={styles.value}>12</p>
            </Col>
            <Col span={8}>
              <p className={styles.title}>业务活动</p>
              <p className={styles.value}>12</p>
            </Col>
            <Col span={8}>
              <p className={styles.title}>匹配进度</p>
              <p>
                <span
                  className={styles.value}
                  style={{
                    color: true
                      ? 'var(--FunctionalSuccess-500)'
                      : 'var(--FunctionalError-500)'
                  }}
                >
                  40
                </span>
                <span className={styles.value}> / </span>
                <span className={styles.value}>40</span>
              </p>
            </Col>
          </Row>
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后更新时间',
      dataIndex: 'gmtUpdate',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '-'
    }
  ];
};

export default getBusinessFlowColumns;
