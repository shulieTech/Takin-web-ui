/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { renderToolTipItem } from 'racc';
import React, { useContext, useEffect, useState } from 'react';
import { ThreadContext } from '../context';
import { AnalysisEnum } from '../enum';
import AnalysisService from '../service';
import { AnalysisProps } from '../types';

interface Props extends AnalysisProps {}
const AnalysisDetails: React.FC<Props> = props => {
  const { state, setState } = useContext(ThreadContext);
  const [info, setInfo] = useState({});
  useEffect(() => {
    if (state.appName && state.processName) {
      getBasicInfo();
    }
  }, [state.processName]);
  const getBasicInfo = async () => {
    const {
      data: { data, success }
    } = await AnalysisService.getThreadDetails({
      ...state,
      reportId: props.query.reportId
    });
    if (success) {
      setInfo(data);
      setState({
        agentId: data?.[AnalysisEnum.AgentId]
      });
    }
  };
  const columns: ColumnProps<any>[] = [
    {
      title: '应用名称',
      dataIndex: AnalysisEnum.进程名称
    },
    {
      title: 'PID',
      dataIndex: AnalysisEnum.PID
    },
    {
      title: '机器IP',
      dataIndex: AnalysisEnum.机器IP
    },
    {
      title: 'AgentId',
      dataIndex: AnalysisEnum.AgentId
    }
  ];
  return (
    <Row style={{ margin: '16px 0' }} type="flex" justify="space-around">
      {columns.map((item, index) => (
        <Col key={index} style={{ flex: 1 }}>
          <span>{item.title}：</span>
          <span>{renderToolTipItem(info[item.dataIndex], 20)}</span>
        </Col>
      ))}
    </Row>
  );
};
export default AnalysisDetails;
