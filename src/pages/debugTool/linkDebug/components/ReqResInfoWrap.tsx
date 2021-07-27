import { Card, Col, Row } from 'antd';
import React, { Fragment } from 'react';
import { DetailState } from '../detailPage';
import InfoCard from './InfoCard';
import styles from './../index.less';
interface Props {
  state?: DetailState;
}

const ReqResInfoWrap: React.FC<Props> = props => {
  const { state } = props;
  const { debugResultDetail } = state;
  const reqInfoData = [
    {
      label: '请求URL',
      value: debugResultDetail.requestUrl || '-'
    },
    {
      label: '请求Header',
      value: `${(debugResultDetail.request &&
        debugResultDetail.request.headers &&
        Object.keys(debugResultDetail.request.headers).length !== 0 &&
        Object.keys(debugResultDetail.request.headers).map(key => {
          return `${key}:${debugResultDetail.request.headers[key]}`;
        })) ||
        '-'}`
    },
    {
      label: '请求Body',
      value:
        (debugResultDetail.request && debugResultDetail.request.body) || '-'
    }
  ];

  const resInfoData = [
    {
      label: 'TraceID',
      value: debugResultDetail.traceId || '-'
    },
    {
      label: '响应Header',
      value: `${(debugResultDetail.response &&
        debugResultDetail.response.headers &&
        Object.keys(debugResultDetail.response.headers).length !== 0 &&
        Object.keys(debugResultDetail.response.headers).map(key => {
          return `${key}:${debugResultDetail.response.headers[key]}`;
        })) ||
        '-'}`
    },
    {
      label: '响应Body',
      value:
        (debugResultDetail.response && debugResultDetail.response.body) || '-'
    }
  ];
  return (
    <Row type="flex" justify="space-between" gutter={16}>
      <Col span={12}>
        <InfoCard
          title="请求信息"
          dataSource={reqInfoData}
          renderNode={renderNode(
            reqInfoData,
            debugResultDetail &&
              debugResultDetail.request &&
              debugResultDetail.request.headers
          )}
        />
      </Col>
      <Col span={12}>
        <InfoCard
          title="响应信息"
          dataSource={resInfoData}
          renderNode={renderNode(
            resInfoData,
            debugResultDetail &&
              debugResultDetail.response &&
              debugResultDetail.response.headers
          )}
        />
      </Col>
    </Row>
  );
};
export default ReqResInfoWrap;

const renderNode = (data, headers) => {
  return (
    <div style={{ width: 548, maxHeight: 560, overflow: 'scroll' }}>
      {data &&
        data.map((item, k) => {
          return (
            <div key={k} className={styles.nodesWrap}>
              <div className={styles.title}>{item.label}</div>
              {item.label === '请求Header' || item.label === '响应Header' ? (
                <div className={styles.nodeContent}>
                  {headers &&
                    Object.keys(headers) &&
                    Object.keys(headers).map(key => {
                      return (
                        <p key={key} style={{ padding: '4px 0px' }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#595959',
                              marginRight: 16
                            }}
                          >
                            {key}:
                          </span>
                          <span>{headers[key]}</span>
                        </p>
                      );
                    })}
                </div>
              ) : (
                <div className={styles.nodeContent}>{item.value}</div>
              )}
            </div>
          );
        })}
    </div>
  );
};
