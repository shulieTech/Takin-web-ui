/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useContext, useEffect } from 'react';
import { ThreadContext } from '../../context';
import { AnalysisType, intervalTime } from '../../enum';
import AnalysisService from '../../service';
import { AnalysisProps } from '../../types';
import CpuUseRatio from './CpuUseRatio';
import ThreadChart from './ThreadChart';
import ThreadList from './ThreadList';

const threadInitState = {
  threadCpuData: [],
  time: '',
  selectThreadName: null,
  threadStackLink: ''
};

export type ThreadInitStateProps = typeof threadInitState;

interface Props extends AnalysisProps {}

const ThreadAnalysis: React.FC<Props> = ({ query }) => {
  const [threadState, setThreadState] = useStateReducer(threadInitState);
  const { state } = useContext(ThreadContext);
  useEffect(() => {
    /** @name 分析实况 */
    let timer = null;
    if (state.processName && state.appName) {
      getChart();
      if (query.type === AnalysisType.分析实况) {
        clearInterval(timer);
        timer = setInterval(() => {
          getChart();
        }, intervalTime);
      }
    }
    return () => clearInterval(timer);
  }, [state.processName]);
  const getChart = async () => {
    const {
      data: { data, success }
    } = await AnalysisService.getThreadCpuChart({
      ...state,
      reportId: query.reportId
    });
    if (success) {
      setThreadState({ threadCpuData: data });
    }
  };
  return (
    <Fragment>
      <ThreadChart {...threadState} setThreadState={setThreadState} />
      <Row className="mg-t2x" type="flex">
        <Col style={{ width: 500 }} className="mg-r4x">
          <ThreadList {...threadState} setThreadState={setThreadState} />
        </Col>
        <Col className="flex-1">
          <CpuUseRatio
            query={query}
            {...threadState}
            setThreadState={setThreadState}
          />
        </Col>
      </Row>
    </Fragment>
  );
};
export default ThreadAnalysis;
