/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import { Button, Col, Collapse, Modal, Row, Table, Tabs } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { MainPageLayout } from 'src/components/page-layout';
import { getUrlParams } from 'src/utils/utils';
import { router } from 'umi';
import BusinessFlowService from './service';

interface Props {}
const { Panel } = Collapse;
const { TabPane } = Tabs;

const DebugDetail: React.FC<Props> = props => {
   
  const [detail, setDetail] = useState({});
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [debugLog, setDebugLog] = useState();
  const id = getUrlParams(window.location.href)?.id;

  useEffect(() => {
    queryDebugDetail();
  }, []);

  /**
   * @name 获取调试详情
   */
  const queryDebugDetail = async () => {
    const {
      data: { success, data }
    } = await BusinessFlowService.debugDetail({ id });
    if (success) {
      if (!data?.hasResult) {
        setTimeout(() => {
          queryDebugDetail();
        }, 5000);
      }
      if (data?.hasResult) {
        setDetail(data);
      }
    }
  };

  /**
   * @name 获取调试日志
   */
  const queryDebugLog = async () => {
    const {
      data: { success, data }
    } = await BusinessFlowService.debugLog({ id });
    if (success) {
      setDebugLog(data);
    }
  };

  const columns = [
    {
      title: 'API名称',
      dataIndex: 'apiName',
      key: 'apiName',
    },
    {
      title: '请求耗时',
      dataIndex: 'requestCost',
      key: 'requestCost',
    },
    {
      title: '响应状态',
      dataIndex: 'responseCode',
      key: 'responseCode',
      render: (text, record) => {
        return <span style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            width: 10,
            height: 10,
            backgroundColor: record?.responseStatus ? 'green' : 'red',
            borderRadius: '50%',
            top: 3
          }}/><span style={{ marginLeft: 12 }}> {text}</span></span>;
      }
    },
  ];
  
  return(<MainPageLayout title={<span>业务流程调试 <Button onClick={() => {
    setVisible(true);
    queryDebugLog();
  }} type="link">查看日志</Button> </span>} extra={<Button onClick={() => {router.push(`/businessFlow/addPTSScene?action=edit&id=${id}`); }}>返回</Button>}>
      <Row type="flex" style={{ height: '80vh', border: '1px solid #ddd', marginTop: 8 }}>
        <Col span={10}>
        <Table 
          bordered={false}  
          columns={columns} 
          size="small" 
          dataSource={detail?.records} 
          pagination={false}  
          onRow={(record, indexs) => {
            return {
              onClick: () => {
                setIndex(indexs);
              },
              style: index === indexs ? { backgroundColor: '#caedf2' } : {},
            };
          }}
          rowKey={(record, indexs) => indexs} />
        </Col>
        <Col  span={14}>
          {detail?.records?.map((item, k) => {
            if (index === k) {
              return   <Collapse key={k} defaultActiveKey={['1']} >
              <Panel header="General" key="1">
                <div><span style={{ fontWeight: 500 }}>Request URL：</span><span>{item?.detail?.general?.requestUrl || '-'}</span></div>
                <div><span style={{ fontWeight: 500 }}>Request Method：</span><span>{item?.detail?.general?.requestMethod || '-'}</span></div>
                <div><span style={{ fontWeight: 500 }}>Response Code：</span><span>{item?.detail?.general?.responseCode || '-'}</span> </div>
                <Tabs  type="card">
      <TabPane tab="请求详情" key="1">
      <Collapse key={k} defaultActiveKey={['1']} >
      <Panel header="Request Headers" key="1">
        <pre>{item?.detail?.requestData?.requestHeaders}</pre>
              </Panel>
              <Panel header="Request Body结构化" key="2">
                <div>{item?.detail?.requestData?.requestBody}</div>
              </Panel>
              </Collapse>
      </TabPane>
      <TabPane tab="响应详情" key="2">
      <Collapse key={k} defaultActiveKey={['1']} >
      <Panel header="Response Headers" key="1">
      <pre>{item?.detail?.responseData?.responseHeaders}</pre>
              </Panel>
              <Panel header="Response Body结构化" key="2">
                <div>{item?.detail?.responseData?.responseBody}</div>
              </Panel>
              <Panel header="断言" key="3">
                <div>{item?.detail?.responseData?.asserts?.map((ite: any, k) => {
                  return <div key={k}><span>{ite?.assertName}{ite?.success ? '成功' : '失败'}</span>{!ite?.success && <span>,{ite?.failureMessage}</span>}</div>;
                })}</div>
              </Panel>
              </Collapse>
      </TabPane>
    </Tabs>
              </Panel>
           
            </Collapse>;
            }
         
          })}
        </Col>
      </Row>
      <Modal width="90%" bodyStyle={{ height: 500, overflow: 'scroll' }} visible={visible} title="调试日志" footer={null} onCancel={() => {
        setVisible(false);
      }}>
        <pre>{debugLog}</pre>
      </Modal>
    </MainPageLayout>);
};
export default DebugDetail;