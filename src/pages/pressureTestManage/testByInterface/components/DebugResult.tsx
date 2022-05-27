import React, { useState, useEffect } from 'react';
import { Select, Icon, Tree, Pagination, Collapse } from 'antd';
import service from '../service';
import useListService from 'src/utils/useListService';
import moment from 'moment';

const { Panel } = Collapse;

interface Props {
  detail: any;
  debugId?: number | string;
}

const DebugResult: React.FC<Props> = (props) => {
  const { debugId, detail } = props;
  const [result, setResult] = useState();
  const { query, total, list, getList, loading } = useListService({
    service: service.getDebugResult,
    defaultQuery: {
      id: debugId,
      senceId: detail?.id,
      current: 0,
      pageSize: 10,
    },
    afterSearchCallback: (res) => {
      // 轮询结果
      if (res.data.success && res.data.data.status === 1) {
        getList();
      }
    },
  });

  const getDebugResult = async () => {
    const {
      data: { success, data },
    } = await service.getDebugResult({ id: debugId, senceId: detail?.id });
    if (success) {
      setResult(data);
      if (data.status === 1) {
        setTimeout(() => {
          getDebugResult();
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (debugId) {
      getDebugResult();
    }
  }, [debugId]);

  const expandIcon = ({ isActive }) => (
    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
  );

  return (
    <div>
      <div
        style={{
          padding: '8px 0',
          borderTop: '1px solid #EEF0F2',
          color: 'var(--Netural-500, #AEB2B7)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ flex: 1 }}>响应结果</span>
        {result && (
          <div style={{ color: 'var(--Netural-850, #414548)' }}>
            <span style={{ marginRight: 32 }}>
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: '#D64C42', marginRight: 8 }}
              />
              1 失败
            </span>
            <Select
              allowClear
              placeholder="状态"
              style={{ width: 120 }}
              onChange={(val) =>
                getList({
                  status: val,
                })
              }
            >
              <Select.Option value={1}>成功</Select.Option>
              <Select.Option value={2}>失败</Select.Option>
            </Select>
          </div>
        )}
      </div>
      {!result ? (
        <div
          style={{
            color: 'var(--Netural-800, #5A5E62)',
            lineHeight: '20px',
            textAlign: 'center',
            padding: '40px 0',
          }}
        >
          您可以输入一个URL，点击调
          <br />
          试后，可在此查看响应结果
        </div>
      ) : (
        <div
          style={{
            borderTop: '1px solid #EEF0F2',
          }}
        >
          <Collapse
            bordered={false}
            expandIcon={expandIcon}
            style={{
              backgroundColor: '#fff',
            }}
          >
            {list.map((x) => {
              const { headers, body, Cookie } = JSON.parse(x.request);
              const hasError = !!x.errorMessage;
              return (
                <Panel
                  key={x.id}
                  style={{
                    borderBottom: 'none',
                    backgroundColor: hasError ? '#FAF2F3' : '#fff',
                  }}
                  header={
                    <div
                      style={{
                        display: 'flex',
                        color: hasError
                          ? 'var(--FunctionNegative-500, #D24D40)'
                          : 'var(--Netural-700, #6F7479)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{ marginRight: 16 }}>{x.status}</span>
                        <span style={{ marginRight: 16 }}>{x.httpMethod}</span>
                        <span style={{ marginRight: 16 }}>{x.requestUrl}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--Netural-500, #AEB2B7)',
                        }}
                      >
                        {moment(x.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  }
                >
                  {x.errorMessage && (
                    <div
                      style={{
                        paddingLeft: 16,
                        color: 'var(--FunctionNegative-500, #D24D40)',
                        lineHeight: '28px',
                      }}
                    >
                      {x.errorMessage}
                    </div>
                  )}
                  <Collapse
                    bordered={false}
                    expandIcon={expandIcon}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Panel
                      header="Header"
                      key="Header"
                      style={{ borderBottom: 'none' }}
                    >
                      <div style={{ paddingLeft: 16 }}>
                        {Object.entries(headers).map(([k, v]) => {
                          return (
                            <div key={k} style={{ lineHeight: '28px' }}>
                              <span
                                style={{ color: '#6187CF', marginRight: 8 }}
                              >
                                {k}：
                              </span>
                              <span
                                style={{
                                  color: 'var(--Netural-850, #414548)',
                                }}
                              >
                                {v}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </Panel>
                    <Panel
                      header="Body"
                      key="Body"
                      style={{ borderBottom: 'none' }}
                    >
                      <div style={{ paddingLeft: 16 }}>{body}</div>
                    </Panel>
                    <Panel
                      header="Response"
                      key="Response"
                      style={{ borderBottom: 'none' }}
                    >
                      <div style={{ paddingLeft: 16 }}>{x.response}</div>
                    </Panel>
                  </Collapse>
                </Panel>
              );
            })}
          </Collapse>
          <Pagination
            simple
            hideOnSinglePage
            size="small"
            total={total}
            pageSize={query.pageSize}
            current={query.current + 1}
            onChange={(page, pageSize) => {
              getList({ pageSize, current: page - 1 });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DebugResult;
