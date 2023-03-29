/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Badge, Button, Col, Popconfirm, Row, Tag, message, } from 'antd';
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
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { getTakinAuthority } from 'src/utils/utils';
import downloadFile from 'src/utils/downloadFile';

declare var serverUrl: string;
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
      message.success('删除成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  /**
   * @name  下载打包脚本
   */
  const handleDownload = async (Id, fileName) => {
    const {
      data: { data, success }
    } = await BusinessFlowService.downloadScript({
      scriptId: Id
    });
    if (success) {
      downloadFile(data.content, `${fileName}.zip`);
    }
  };

  return [
    {
      ...customColumnProps,
      title: '业务流程',
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
                value:
                  row[BusinessFlowBean.来源] !== null ? (
                    <Tag>
                      {row[BusinessFlowBean.来源] === 0 ? '手工' : row[BusinessFlowBean.来源] === 3 ? 'Takin' : 'Jmeter'}
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
              <span className={styles.title}>总计</span>
              <span className={styles.value}>{row[BusinessFlowBean.总计]}</span>
            </Col>
            <Col span={8}>
              <span className={styles.title}>已完成</span>
              <span
                className={styles.value}
                style={{
                  color: 'var(--FunctionalSuccess-500)'
                }}
              >
                {text}
              </span>
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
            {localStorage.isAdmin === 'true' &&
              getTakinAuthority() === 'true' && (
                <span style={{ marginRight: 8 }}>
                  <AdminDistributeModal
                    dataId={row.id}
                    btnText="分配给"
                    menuCode="BUSINESS_FLOW"
                    onSccuess={() => {
                      setState({
                        isReload: !state.isReload
                      });
                    }}
                  />
                </span>
              )}
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessFlow_3_update &&
                row.canEdit
              }
            >
              {row[BusinessFlowBean.来源] === 0 ? (
                <Link
                  style={{ marginRight: 8 }}
                  to={`/businessFlow/addBusinessFlow?action=edit&id=${row.id}`}
                >
                  编辑
                </Link>
              )  : (
                <Link
                  style={{ marginRight: 8 }}
                  to={`/businessFlow/details?id=${row.id}`}
                >
                  编辑
                </Link>
              )}
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
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessFlow_3_update &&
                row.canEdit
              }
            >
              <Button
                disabled={row[BusinessFlowBean.来源] === 0 ? true : false}
                style={{ marginRight: 8 }}
                type="link"
                onClick={() =>
                  handleDownload(row.scriptDeployId, row.sceneName)
                }
              >
                下载
              </Button>
            </AuthorityBtn>
            {row[BusinessFlowBean.来源] === 3 &&  <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.businessFlow_3_update &&
                row.canEdit
              }
            >
              <Link
                style={{ marginRight: 8 }}
                to={`/businessFlow/addPTSScene?action=edit&id=${row.id}`}
              >
              在线调试
              </Link>
            </AuthorityBtn>}
          </Fragment>
        );
      }
    }
  ];
};

export default getBusinessFlowColumns;
