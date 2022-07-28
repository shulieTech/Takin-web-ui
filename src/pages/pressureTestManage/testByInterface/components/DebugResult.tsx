import React, { useState, useEffect } from 'react';
import {
  Select,
  Icon,
  Pagination,
  Collapse,
  Spin,
  Button,
  message,
  Tooltip,
} from 'antd';
import service from '../service';
import useListService from 'src/utils/useListService';
import moment from 'moment';
import { IFieldMergeState } from '@formily/antd';

const { Panel } = Collapse;

const DebugResult: React.FC<IFieldMergeState> = (props) => {
  const { schema, form } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { debugId, detail, ...rest } = componentProps;
  let timer;
  const [errorCount, setErrorCount] = useState(0);
  const defaultQuery = {
    resultId: debugId,
    configId: detail?.id,
    current: 0,
    pageSize: 20,
  };
  const { query, total, list, getList, loading, setList } = useListService({
    defaultQuery,
    service: service.getDebugResult,
    afterSearchCallback: (res) => {
      if (res.data.success) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        setErrorCount(res.data?.extData?.failCount || 0);
        // 轮询结果
        if (!res.data?.extData?.requestFinished) {
          timer = setTimeout(() => {
            getList(defaultQuery);
          }, 2000);
        }
      }
    },
    isQueryOnMount: false,
  });

  const clearDebugHistory = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const {
      data: { data, success },
    } = await service.clearDebugResult({
      resultId: debugId,
      configId: detail?.id,
    });
    if (success) {
      message.success('操作成功');
      form.setFieldState('.debugResult', (state) => {
        state.props['x-component-props'].debugId = '';
      });
      getList(defaultQuery);
    }
  };

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (debugId || detail?.id) {
      getList(defaultQuery);
    } else {
      setList([]);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }, [debugId, detail?.id]);

  const expandIcon = ({ isActive }) => (
    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
  );

  return (
    <Spin spinning={loading}>
      <Collapse
        defaultActiveKey="debugResultContent"
        expandIcon={({ isActive }) => (
          <Icon
            type="caret-right"
            rotate={isActive ? 90 : -90}
            style={{ right: 22 }}
          />
        )}
        expandIconPosition="right"
        bordered={false}
        style={{
          backgroundColor: '#fff',
          borderTop: '1px solid #EEF0F2',
          marginLeft: -32,
          marginRight: -32,
        }}
      >
        <Panel
          key="debugResultContent"
          style={{
            borderBottom: 'none',
          }}
          header={
            <span
              style={{
                color: 'var(--Netural-500, #AEB2B7)',
                padding: '0 16px',
                lineHeight: '32px',
              }}
            >
              响应结果
            </span>
          }
          extra={
            <span onClick={(e) => e.stopPropagation()}>
              {(list.length > 0 || query.status) && (
                <div style={{ color: 'var(--Netural-850, #414548)' }}>
                  {errorCount > 0 && (
                    <span style={{ marginRight: 32 }}>
                      <Icon
                        type="close-circle"
                        theme="filled"
                        style={{ color: '#D64C42', marginRight: 8 }}
                      />
                      {errorCount} 失败
                    </span>
                  )}
                  <Select
                    allowClear
                    placeholder="状态"
                    style={{ width: 120, marginRight: 8 }}
                    onChange={(val) =>
                      getList({
                        ...defaultQuery,
                        status: val,
                      })
                    }
                  >
                    <Select.Option value={1}>成功</Select.Option>
                    <Select.Option value={2}>失败</Select.Option>
                  </Select>
                  <Button onClick={clearDebugHistory}>清空</Button>
                </div>
              )}
            </span>}
        >
          {!(list.length > 0) ? (
            <div
              style={{
                color: 'var(--Netural-800, #5A5E62)',
                lineHeight: '20px',
                textAlign: 'center',
                padding: '40px 0',
              }}
            >
              {query.status ? (
                <>暂无数据</>
              ) : (
                <>
                  您可以输入一个URL，点击调
                  <br />
                  试后，可在此查看响应结果
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                borderTop: '1px solid #EEF0F2',
                minHeight: 200,
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
                  const {
                    headers: requestHeaders,
                    body: requestBody,
                    Cookie,
                  } = JSON.parse(x.request || '{}');
                  const { headers: responseHeaders, body: responseBody } =
                    JSON.parse(x.response || '{}');
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
                          <div
                            style={{
                              flex: 1,
                              display: 'flex',
                              overflow: 'hidden',
                            }}
                          >
                            <span style={{ marginRight: 16 }}>{x.status}</span>
                            <span style={{ marginRight: 16 }}>
                              {x.httpMethod}
                            </span>
                            <span
                              style={{ marginRight: 16, flex: 1 }}
                              className="truncate"
                            >
                              <Tooltip title={x.requestUrl}>
                                {x.requestUrl}
                              </Tooltip>
                            </span>
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
                          header="Request"
                          key="Request"
                          style={{ borderBottom: 'none' }}
                        >
                          <div style={{ paddingLeft: 16 }}>
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
                                  {Object.entries(requestHeaders).map(
                                    ([k, v]) => {
                                      return (
                                        <div
                                          key={k}
                                          style={{ lineHeight: '28px' }}
                                        >
                                          <span
                                            style={{
                                              color: '#6187CF',
                                              marginRight: 8,
                                            }}
                                          >
                                            {k}：
                                          </span>
                                          <span
                                            style={{
                                              color:
                                                'var(--Netural-850, #414548)',
                                              whiteSpace: 'normal',
                                              wordBreak: 'break-all',
                                            }}
                                          >
                                            {v}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </Panel>
                              {requestBody && (
                                <Panel
                                  header="Body"
                                  key="Body"
                                  style={{ borderBottom: 'none' }}
                                >
                                  <div
                                    style={{
                                      paddingLeft: 16,
                                      whiteSpace: 'normal',
                                      wordBreak: 'break-all',
                                    }}
                                  >
                                    {requestBody}
                                  </div>
                                </Panel>
                              )}
                            </Collapse>
                          </div>
                        </Panel>

                        {x.response && (
                          <Panel
                            header="Response"
                            key="Response"
                            style={{ borderBottom: 'none' }}
                          >
                            <div style={{ paddingLeft: 16 }}>
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
                                    {Object.entries(responseHeaders).map(
                                      ([k, v]) => {
                                        return (
                                          <div
                                            key={k}
                                            style={{ lineHeight: '28px' }}
                                          >
                                            <span
                                              style={{
                                                color: '#6187CF',
                                                marginRight: 8,
                                              }}
                                            >
                                              {k}：
                                            </span>
                                            <span
                                              style={{
                                                color:
                                                  'var(--Netural-850, #414548)',
                                              }}
                                            >
                                              {v}
                                            </span>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </Panel>
                                {responseBody && (
                                  <Panel
                                    header="Body"
                                    key="Body"
                                    style={{ borderBottom: 'none' }}
                                  >
                                    <div style={{ paddingLeft: 16 }}>
                                      {responseBody}
                                    </div>
                                  </Panel>
                                )}
                              </Collapse>
                            </div>
                          </Panel>
                        )}
                      </Collapse>
                    </Panel>
                  );
                })}
              </Collapse>
              <Pagination
                style={{
                  padding: 16,
                  textAlign: 'center',
                }}
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
        </Panel>
      </Collapse>
    </Spin>
  );
};

DebugResult.isVirtualFieldComponent = true;

export default DebugResult;
