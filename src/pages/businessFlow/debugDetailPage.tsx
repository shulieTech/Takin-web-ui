import { Col, Row, Table } from 'antd';
import React, { Fragment, useState } from 'react';
import { MainPageLayout } from 'src/components/page-layout';
interface Props {}
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
   
  return <MainPageLayout title="场景调试">
      <Row type="flex" style={{height:'80vh',border:'1px solid #ddd'}}>
        <Col span={8}>
        <Table bordered={false}  columns={columns} size="small" dataSource={detail?.records} pagination={false}/>
        </Col>
        <Col  span={16}>
         
        </Col>
      </Row>
    </MainPageLayout>;
};
export default DebugDetail;