/* eslint-disable react/jsx-no-undef */
import { Button, Col, Collapse, Modal, Row, Table, Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import { MainPageLayout } from 'src/components/page-layout';
interface Props {}
const { Panel } = Collapse;
const { TabPane } = Tabs;

const DebugDetail: React.FC<Props> = props => {
   
  const [detail, useDetail] = useState({
    hasResult: true,
    records: [
      {
        apiName: '',
        detail: {
          general: {
            checkResult: '',
            exportContent: '',
            requestMethod: '',
            requestUrl: '',
            responseCode: 0
          },
          requestCost: 0,
          requestData: {
            requestBody: '',
            requestHeaders: ''
          },
          requestTime: '',
          responseData: {
            asserts: [
              {
                assertName: '',
                failureMessage: '',
                success: true
              }
            ],
            errorMessage: '',
            responseBody: '',
            responseHeaders: ''
          },
          responseStatus: true
        },
        requestTime: '',
        responseCode: 0,
        responseStatus: true
      }
    ]
  });
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const columns = [
    {
      title: 'API名称',
      dataIndex: 'apiName',
      key: 'apiName',
    },
    {
      title: '请求时间',
      dataIndex: 'requestTime',
      key: 'requestTime',
    },
    {
      title: '响应状态',
      dataIndex: 'responseStatus',
      key: 'responseStatus',
    },
  ];

  const headercolumns = [
    {
      title: '键名（Key）',
      dataIndex: 'key',
      key: 'keey',
    },
    {
      title: '键值（Value）',
      dataIndex: 'value',
      key: 'value',
    }
  ];
  
  // tslint:disable-next-line:jsx-wrap-multiline
  return <MainPageLayout title="场景调试">
      <Row type="flex" style={{ height: '80vh', border: '1px solid #ddd' }}>
        <Col span={8}>
        <Table bordered={false}  columns={columns} size="small" dataSource={detail?.records} pagination={false}/>
        </Col>
        <Col  span={16}>
          {detail?.records?.map((item, k) => {
            return   <Collapse key={k} defaultActiveKey={['1']} >
            <Panel header="General" key="1">
              <div><span style={{ fontWeight: 500 }}>Request URL：</span><span>{item?.detail?.general?.requestUrl || '-'}</span></div>
              <div><span style={{ fontWeight: 500 }}>Request Method：</span><span>{item?.detail?.general?.requestMethod || '-'}</span></div>
              <div><span style={{ fontWeight: 500 }}>Response Code：</span><span>{item?.detail?.general?.responseCode || '-'}</span>{item?.detail?.general?.responseCode === 500 && <Button onClick={() => {setVisible(true); }} type="link">常见错误码解读</Button>} </div>
              <div><span style={{ fontWeight: 500 }}>Export Content：</span><span>{item?.detail?.general?.exportContent || '-'}</span></div>
              <div><span style={{ fontWeight: 500 }}>Check Result：</span><span>{item?.detail?.general?.checkResult || '-'}</span></div>
              <Tabs  type="card">
    <TabPane tab="请求详情" key="1">
    <Collapse key={k} defaultActiveKey={['1']} >
    <Panel header="Request Headers" key="1">
    <Table bordered={false}  columns={headercolumns} size="small" dataSource={detail?.records} pagination={false}/>
            </Panel>
            <Panel header="Request Body结构化" key="2">
              <div>{item?.detail?.requestData?.requestBody}</div>
            </Panel>
            <Panel header="Request 原始报文" key="3">
              <div>{item?.detail?.requestData?.requestBody}</div>
            </Panel>
            </Collapse>
    </TabPane>
    <TabPane tab="响应详情" key="2">
    <Collapse key={k} defaultActiveKey={['1']} >
    <Panel header="Response Headers" key="1">
    <Table bordered={false}  columns={headercolumns} size="small" dataSource={detail?.records} pagination={false}/>
            </Panel>
            <Panel header="Response Body结构化" key="2">
              <div>{item?.detail?.responseData?.responseBody}</div>
            </Panel>
            <Panel header="Response 原文" key="3">
              <div>{item?.detail?.responseData?.responseBody}</div>
            </Panel>
            </Collapse>
    </TabPane>
  </Tabs>
            </Panel>
         
          </Collapse>;
          })}
        </Col>
      </Row>
      <Modal visible={visible} title="常见错误码解读" footer={null}>
        222
      </Modal>
    </MainPageLayout>;
};
export default DebugDetail;