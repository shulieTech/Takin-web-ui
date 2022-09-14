import React, { useState, useEffect } from 'react';
import {
  Table,
  Statistic,
  DatePicker,
  Card,
  Row,
  Col,
  Spin,
  Badge,
} from 'antd';
import service from './service';
import moment from 'moment';

const { RangePicker } = DatePicker;

const PressureStatistics: React.FC = (props) => {
  const [queryParams, setQueryParams] = useState({
    startTime: moment()
      .subtract(7, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    topSceneList: [],
    sceneCount: {
      count: 0,
      running: 0,
      wait: 0,
    },
    scriptCount: 0,
    reportCount: {
      count: 0,
      fail: 0,
      success: 0,
    },
  });

  const queryData = async (params = {}) => {
    const newParams = {
      ...queryParams,
      ...params,
    };
    setQueryParams(newParams);
    setLoading(true);
    Promise.all([
      service.getTopSceneList({ type: 0, ...newParams }),
      service.getReportTotal(newParams),
      service.getSceneTotal({ type: 0, ...newParams }),
      service.getScriptTotal(newParams),
    ])
      .then((res) => {
        setData({
          topSceneList: res[0].data?.data || [],
          reportCount: res[1].data.data || {},
          sceneCount: {
            count: res[2].data?.data.total || 0,
            running:
              res[2].data?.data?.data?.find((x) => x.type === '压测中')
                ?.value || 0,
            wait:
              res[2].data?.data?.data?.find((x) => x.type === '待启动')
                ?.value || 0,
          },
          scriptCount: res[3].data?.data || 0,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    { title: '压测场景ID', dataIndex: 'id' },
    { title: '压测场景名称', dataIndex: 'name' },
    // { title: '标签', dataIndex: 'tag', render: () => '-' },
    {
      title: '创建日期',
      dataIndex: 'gmtCreate',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    { title: '创建人', dataIndex: 'createName' },
    { title: '压测次数', dataIndex: 'count' },
    { title: '通过', dataIndex: 'success' },
    { title: '不通过', dataIndex: 'fail' },
  ];

  useEffect(() => {
    queryData();
  }, []);

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 16 }}>
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <RangePicker
            allowClear={false}
            ranges={{
              '7天内': [moment().subtract(7, 'days'), moment()],
              '30天内': [moment().subtract(30, 'days'), moment()],
            }}
            defaultValue={[moment().subtract(7, 'days'), moment()]}
            onChange={(val) => {
              const params =
                Array.isArray(val) && val.length > 0
                  ? {
                    startTime: val[0]
                        .startOf('day')
                        .format('YYYY-MM-DD HH:mm:ss'),
                    endTime: val[1]
                        .endOf('day')
                        .format('YYYY-MM-DD HH:mm:ss'),
                  }
                  : {
                    startTime: undefined,
                    endTime: undefined,
                  };
              queryData(params);
            }}
          />
        </div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic title="脚本总数" value={data.scriptCount || 0} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <Col span={12}>
                  <Statistic
                    title="压测场景数"
                    value={data.sceneCount?.count || 0}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Badge
                      status="processing"
                      text={
                        <span>
                          压测中 {data.sceneCount?.running || 0}（
                          {data.sceneCount?.count > 0
                            ? (
                                (data.sceneCount?.running /
                                  data.sceneCount?.count) *
                                100
                              ).toFixed(2)
                            : 0}
                          %）
                        </span>
                      }
                    />
                  </div>
                  <div>
                    <Badge
                      status="default"
                      text={
                        <span>
                          待启动 {data.sceneCount?.wait || 0}（
                          {data.sceneCount?.count > 0
                            ? (
                                (data.sceneCount?.wait /
                                  data.sceneCount?.count) *
                                100
                              ).toFixed(2)
                            : 0}
                          %）
                        </span>
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <Col span={12}>
                  <Statistic
                    title="压测报告数"
                    value={data.reportCount?.count || 0}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Badge
                      status="success"
                      text={
                        <span>
                          通过 {data.reportCount?.success || 0}（
                          {data.reportCount?.count > 0
                            ? (
                                (data.reportCount?.success /
                                  data.reportCount?.count) *
                                100
                              ).toFixed(2)
                            : 0}
                          %）
                        </span>
                      }
                    />
                  </div>
                  <div>
                    <Badge
                      status="error"
                      text={
                        <span>
                          不通过 {data.reportCount?.fail || 0}（
                          {data.reportCount?.count > 0
                            ? (
                                (data.reportCount?.fail /
                                  data.reportCount?.count) *
                                100
                              ).toFixed(2)
                            : 0}
                          %）
                        </span>
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Table
          rowKey="id"
          title={(pageData) => (
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
              压测次数 Top5 场景
            </div>
          )}
          dataSource={data.topSceneList || []}
          columns={columns}
          pagination={false}
        />
      </div>
    </Spin>
  );
};

export default PressureStatistics;
