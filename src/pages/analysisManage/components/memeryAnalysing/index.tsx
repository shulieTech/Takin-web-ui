/**
 * @name
 * @author MingShined
 */
import { Col, Row, Spin } from 'antd';
import { useStateReducer } from 'racc';
import React, { useContext, useEffect } from 'react';
import { ThreadContext } from '../../context';
import { AnalysisType, intervalTime } from '../../enum';
import AnalysisService from '../../service';
import { AnalysisProps } from '../../types';
import GCElapsedTime from './GCElapsedTime';
import GCTime from './GCTime';
import HeapMemoryDetails from './HeapMemoryDetails';

interface ChartDataBean {
  type: string;
  value: any;
  time: string;
}

const initState = {
  chartMap: {} as {
    heapMemory: ChartDataBean[];
    gcCount: ChartDataBean[];
    gcCost: ChartDataBean[];
  },
  loading: false
};

export type MemeryAnalysingState = typeof initState;

interface Props extends AnalysisProps {}

const MemeryAnalysing: React.FC<Props> = props => {
  const [memeryState, setMemeryState] = useStateReducer<MemeryAnalysingState>(
    initState
  );
  const { state } = useContext(ThreadContext);
  useEffect(() => {
    let timer = null;
    if (state.processName && state.appName) {
      getMemeryChartInfo();
      if (props.query.type === AnalysisType.分析实况) {
        clearInterval(timer);
        timer = setInterval(() => {
          getMemeryChartInfo();
        }, intervalTime);
      }
    }
    return () => clearInterval(timer);
  }, [state.processName]);
  const getMemeryChartInfo = async () => {
    setMemeryState({ loading: true });
    const {
      data: { data, success }
    } = await AnalysisService.memeryAnalysis({
      reportId: props.query.reportId,
      ...state
    });
    if (success) {
      setMemeryState({ chartMap: data, loading: false });
    }
  };
  return (
    <Spin spinning={memeryState.loading}>
      <HeapMemoryDetails {...memeryState} />
      <Row className="mg-t2x" type="flex" gutter={48}>
        <Col className="flex-1">
          <GCTime {...memeryState} />
        </Col>
        <Col className="flex-1">
          <GCElapsedTime {...memeryState} />
        </Col>
      </Row>
    </Spin>
  );
};
export default MemeryAnalysing;
