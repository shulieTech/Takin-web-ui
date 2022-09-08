import React, { useState, useEffect, useContext } from 'react';
import { Modal, Collapse, Icon, Spin, Divider, Table } from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import { PrepareContext } from '../indexPage';
import styles from '../index.less';

const { Panel } = Collapse;

interface Props {
  cancelCallback: () => void;
}

export default (props: Props) => {
  const { cancelCallback } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);

  const { list, loading, total, query, getList } = useListService({
    service: service.getLinkList,
    defaultQuery: {
      status: undefined,
      current: 0,
      pageSize: 10,
    },
    // isQueryOnMount: false,
  });

  const caretDownBtn = (
    <span
      style={{
        display: 'inline-block',
        width: 24,
        lineHeight: '22px',
        textAlign: 'center',
        borderRadius: 4,
        border: '1px solid var(--Netural-300, #DBDFE3)',
        cursor: 'pointer',
      }}
    >
      <Icon type="caret-down" />
    </span>
  );

  return (
    <Spin spinning={loading}>
      <Modal
        visible
        width={1300}
        bodyStyle={{ padding: 0, height: '80vh', overflow: 'auto' }}
        footer={null}
        onCancel={cancelCallback}
      >
        <div
          style={{
            padding: '24px 40px',
            display: 'flex',
          }}
        >
          <span
            style={{
              color: 'var(--Netural-1000, #141617)',
              fontSize: 22,
              fontWeight: 600,
              flex: 1,
            }}
          >
            链路：{prepareState.currentLink?.name}
          </span>
          <span
            style={{
              color: 'var(--Netural-800, #5A5E62)',
            }}
          >
            配置清单
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            borderTop: '1px solid var(--Netural-75, #F7F8FA)',
            padding: '4px 40px',
            lineHeight: '20px',
          }}
        >
          <div style={{ flex: 1, color: 'var(--Netural-600, #90959A)' }}>
            检测时间：2021-08-30 11:36:03
          </div>
          <div>
            <span
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
                marginLeft: 45,
                backgroundColor:
                  query.status === undefined
                    ? 'var(--Netural-100, #EEF0F2)'
                    : '#fff',
              }}
              onClick={() => getList({ status: undefined, current: 0 })}
            >
              <Icon
                type="info-circle"
                theme="filled"
                style={{
                  color: 'var(--Netural-900, #303336)',
                  fontSize: 12,
                  marginRight: 8,
                }}
              />
              全部 234
            </span>
            <span
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
                marginLeft: 45,
                backgroundColor:
                  query.status === 0 ? 'var(--Netural-100, #EEF0F2)' : '#fff',
              }}
              onClick={() => getList({ status: 0, current: 0 })}
            >
              <Icon
                type="check-square"
                theme="filled"
                style={{
                  color: 'var(--FunctionPositive-300, #2DC396)',
                  fontSize: 12,
                  marginRight: 8,
                }}
              />
              已完成 1
            </span>
            <span
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
                marginLeft: 45,
                backgroundColor:
                  query.status === 1 ? 'var(--Netural-100, #EEF0F2)' : '#fff',
              }}
              onClick={() => getList({ status: 1, current: 0 })}
            >
              <Icon
                type="warning"
                theme="filled"
                style={{
                  color: 'var(--FunctionAlert-500, #FFA929)',
                  fontSize: 12,
                  marginRight: 8,
                }}
              />
              异常 1
            </span>
          </div>
        </div>
        <Collapse
          expandIconPosition="right"
          expandIcon={(panelProps) => caretDownBtn}
          className={styles['custom-collapse']}
        >
          {list.map((record) => {
            return (
              <Panel
                key={record.id}
                header={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {{
                        0: (
                          <Icon
                            type="check-square"
                            theme="filled"
                            style={{
                              color: 'var(--FunctionPositive-300, #2DC396)',
                            }}
                          />
                        ),
                        1: (
                          <Icon
                            type="warning"
                            theme="filled"
                            style={{
                              color: 'var(--FunctionAlert-500, #FFA929)',
                            }}
                          />
                        ),
                      }[record.status] || '-'}
                      <Divider
                        type="vertical"
                        style={{ height: 24, margin: '0 24px' }}
                      />
                      <div style={{ display: 'inline-flex' }}>
                        <div>
                          <div
                            style={{
                              color: 'var(--Netural-1000, #141617)',
                            }}
                          >
                            {record.name}
                          </div>
                          <div
                            style={{
                              color: 'var(--Netural-600, #90959A)',
                            }}
                          >
                            ID:{record.id}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        flex: 1,
                        color:
                          record.status === 1
                            ? 'var(--FunctionNegative-500, #D24D40)'
                            : 'inherit',
                      }}
                    >
                      {record.nodeNum}/{record.agentNodeNum}
                    </span>
                  </div>}
              >
                <Table
                  dataSource={[
                    {
                      name: '影子表1',
                      url: 'amdpdubboService#queryWaybillInfoByCode',
                      status: 0,
                      msg: '正常',
                    },
                    {
                      name: '影子表2',
                      url: 'amdpdubboService#queryWaybillInfoByCode',
                      status: 0,
                      msg: '正常',
                    },
                  ]}
                  columns={[
                    {
                      dataIndex: 'name',
                      render: (text) => (
                        <div style={{ paddingLeft: 200 }}>{text}</div>
                      ),
                    },
                    { dataIndex: 'url' },
                    { dataIndex: 'msg', align: 'right' },
                  ]}
                  showHeader={false}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                />
              </Panel>
            );
          })}
        </Collapse>
      </Modal>
    </Spin>
  );
};
