import React, { useState, useEffect } from 'react';
import { Table, Spin, Badge, Tooltip } from 'antd';
import service from '../service';
import Chart from './components/Chart';

const CompareReport: React.FC = (props) => {
  const { sceneId, reportIds = [] } = props.location.query;
  const [loading, setLoading] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [chartList, setChartList] = useState([]);

  const queryReportDetail = async (id) => {
    const {
      data: { data, success },
    } = await service.queryReportDetail({ reportId: id });
    if (success) {
      return data;
    }
  };
  const queryReportTrend = async (id) => {
    const {
      data: { data, success },
    } = await service.queryLinkChartsInfo({ reportId: id });
    if (success) {
      return {
        id,
        ...data,
      };
    }
  };

  const queryAllReports = async () => {
    setLoading(true);
    await Promise.all(reportIds.map((x) => queryReportDetail(x))).then(
      (res) => {
        setReportList(res);
      }
    );
    await Promise.all(reportIds.map((x) => queryReportTrend(x))).then((res) => {
      setChartList(res);
    });
    setLoading(false);
  };

  const columns = [
    { title: '报告ID', dataIndex: 'id' },
    {
      title: '通过状态',
      dataIndex: 'conclusion',
      render: (text, record) => {
        return {
          0: (
            <Badge
              text={<Tooltip title={record.conclusionRemark}>不通过</Tooltip>}
              status="error"
            />
          ),
          1: <Badge text="通过" status="success" />,
        }[text];
      },
    },
    { title: '开始时间', dataIndex: 'startTime' },
    { title: '压测时长', dataIndex: 'testTotalTime' },
    {
      title: (
        <span>
          消耗流量
          <br />
          (vum)
        </span>
      ),
      dataIndex: 'amount',
      render: (text) => text || 0,
    },
    {
      title: '请求总数',
      dataIndex: 'totalRequest',
      render: (text) => text || 0,
    },
    { title: '最大并发', dataIndex: 'concurrent', render: (text) => text || 0 },
    {
      title: '平均并发',
      dataIndex: 'avgConcurrent',
      render: (text) => text || 0,
    },
    {
      title: '实际/目标TPS',
      render: (text, record) => `${record.avgTps || 0}/${record.tps}`,
    },
    { title: '平均RT(ms)', dataIndex: 'avgRt', render: (text) => text || 0 },
    {
      title: '成功率(%)',
      dataIndex: 'successRate',
      render: (text) => text || 0,
    },
    { title: 'SA(%)', dataIndex: 'sa', render: (text) => text || 0 },
  ];

  useEffect(() => {
    queryAllReports();
  }, []);

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 16 }}>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {reportList[0]?.sceneName}
          </span>
          <span
            style={{
              marginLeft: 16,
            }}
          >
            压测场景 ID：{reportList[0]?.sceneId}
          </span>
        </div>
        <Table
          className="show-scroll-bar"
          size="small"
          rowKey="id"
          columns={columns}
          pagination={false}
          dataSource={reportList}
          scroll={{
            x: 'max-content',
          }}
        />

        <Chart data={chartList} />
      </div>
    </Spin>
  );
};

export default CompareReport;
