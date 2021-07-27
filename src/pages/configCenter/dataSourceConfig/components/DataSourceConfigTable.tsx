/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import Link from 'umi/link';
import { Badge, Button, Divider, Icon, message, Modal, Popover } from 'antd';
import DataSourceConfigService from '../service';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import AddDataSourceConfigModal from '../modals/AddDataSourceConfigModal';
import styles from './../index.less';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AddDataSourceTagsModal from '../modals/AddDataSourceTagsModal';

const getDataSourceConfigColumns = (
  state,
  setState,
  dictionaryMap
): ColumnProps<any>[] => {
  const userType: string = localStorage.getItem('troweb-role');
  const expire: string = localStorage.getItem('troweb-expire');
  const { confirm } = Modal;

  /**
   * @name 确认是否删除
   */
  const handleDelete = async datasourceIds => {
    const {
      data: { data, success }
    } = await DataSourceConfigService.deleteDataSourceConfig({
      datasourceIds
    });
    if (success) {
      message.success('操作成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  const showDeleteConfirm = async value => {
    const {
      data: { data, success }
    } = await DataSourceConfigService.queryDataSourceActivityList({
      datasourceId: value
    });
    if (success) {
      confirm({
        icon: null,
        title: '是否删除当前数据源?',
        content: (
          <div style={{ color: '#8C8C8C' }}>
            {data && data.length > 0
              ? ' 删除当前数据源后，以下业务活动的数据验证命令将会失效，删除后无法恢复，是否确认删除？'
              : '删除后无法恢复，是否确认删除'}
            <p style={{ marginTop: 16 }}>
              {data &&
                data.map((item, k) => {
                  return (
                    <span
                      key={k}
                      style={{
                        padding: '4px 10px',
                        background: '#FFD4C9',
                        borderRadius: '2px',
                        color: '#646464',
                        marginRight: 8
                      }}
                    >
                      {item.refName}
                    </span>
                  );
                })}
            </p>
          </div>
        ),
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          handleDelete([value]);
        }
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '数据源名称',
      dataIndex: 'datasourceName'
    },
    {
      ...customColumnProps,
      title: '数据源地址',
      dataIndex: 'jdbcUrl'
    },
    {
      ...customColumnProps,
      title: '用户名',
      dataIndex: 'username'
    },
    {
      ...customColumnProps,
      title: '数据库类型',
      dataIndex: 'type',
      render: text => {
        return <span>{(text && text.label) || '-'}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '标签',
      dataIndex: 'tags',
      render: (text, row) => {
        return (
          <div className={styles.tagsWrap}>
            {text && text.length > 1 ? (
              <span>
                <span className={styles.circleTag}>
                  {text[0] && text[0].tagName}
                </span>
                <Popover
                  placement="bottom"
                  trigger="click"
                  title="标签"
                  content={
                    <div className={styles.tags}>
                      {text.map((item, k) => {
                        return (
                          <p key={k}>
                            {item.tagName} <Divider />
                          </p>
                        );
                      })}
                    </div>}
                >
                  <a className={styles.circleTag} style={{ marginLeft: 8 }}>
                    ...
                  </a>
                </Popover>
              </span>
            ) : text && text.length === 1 ? (
              <a className={styles.circleTag} style={{ marginLeft: 8 }}>
                {text[0] && text[0].tagName}
              </a>
            ) : (
              <span> - </span>
            )}
            <AuthorityBtn isShow={true}>
              <AddDataSourceTagsModal
                tags={row.tags}
                datasourceId={row.datasourceId}
                btnText={
                  <Icon
                    type="plus-circle"
                    style={{ color: '#11BBD5', marginLeft: 8 }}
                  />
                }
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            </AuthorityBtn>
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: 'gmtUpdate'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <AddDataSourceConfigModal
              action="edit"
              btnText="编辑"
              datasourceId={row.datasourceId}
              dictionaryMap={dictionaryMap}
              onSccuess={() => {
                setState({
                  isReload: !state.isReload
                });
              }}
            />
            <Button
              onClick={() => showDeleteConfirm(row.datasourceId)}
              type="link"
              style={{ marginLeft: 8 }}
            >
              删除
            </Button>
          </Fragment>
        );
      }
    }
  ];
};

export default getDataSourceConfigColumns;
