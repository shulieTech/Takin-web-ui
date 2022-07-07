import React, { useState, useEffect } from 'react';
import { Table, Spin, Badge } from 'antd';
import service from '../service';

const CompareReport: React.FC = (props) => {
  const { sceneId, reportIds = [] } = props.location.query;
  const [loading, setLoading] = useState(false);
  const [reportList, setReportList] = useState([]);

  const queryReportDetail = async (id) => {
    const {
      data: { data, success },
    } = await service.queryReportDetail({ reportId: id });
    if (success) {
      return data;
    }
  };

  const queryAllReports = async () => {
    Promise.all(reportIds.map((x) => queryReportDetail(x))).then((res) => {
      setReportList(res);
    });
  };

  const columns = [
    { title: '报告ID', dataIndex: 'id', width: 50, fixed: 'left' },
    {
      title: '通过状态',
      dataIndex: 'conclusion',
      render: (text) => {
        return {
          1: <Badge text="通过" status="success" />,
          2: <Badge text="不通过" status="error" />,
        }[text];
      },
    },
    { title: '开始时间', dataIndex: 'startTime' },
    { title: '压测时长', dataIndex: 'testTotalTime' },
    { title: '消耗流量(vum)', dataIndex: 'amount' },
    { title: '请求总数', dataIndex: 'totalRequest' },
    { title: '最大并发', dataIndex: 'concurrent' },
    { title: '平均并发', dataIndex: 'avgConcurrent' },
    {
      title: '实际/目标TPS',
      render: (text, record) => `${record.avgTps}/${record.tps}`,
    },
    { title: '平均RT(ms)', dataIndex: 'avgRt' },
    { title: '成功率(%)', dataIndex: 'successRate' },
    { title: 'SA(%)', dataIndex: 'sa' },
  ];

  useEffect(() => {
    queryAllReports();
  }, []);

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 16 }}>
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
      </div>
    </Spin>
  );
};

export default CompareReport;
