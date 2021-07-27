/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import moment from 'moment';
import { transformEnumKeys, useStateReducer } from 'racc';
import React from 'react';
import { MainPageLayout } from 'src/components/page-layout';
import ChartNode from './components/ChartNode';
import ExtraNode from './components/ExtraNode';
import SceneNode from './components/SceneNode';
import ScriptNode from './components/ScriptNode';
import { TabMap } from './enum';

const format = 'YYYY-MM-DD HH:mm:ss';

const getInitState = () => ({
  current: TabMap.压测场景,
  date: [
    moment()
      .subtract('day', 7)
      .format(format),
    moment().format(format)
  ]
});
export type PressureTestStatisticState = ReturnType<typeof getInitState>;
export interface PressureTestStatisticChildrenProps
  extends Partial<PressureTestStatisticState> {
  setState?: (state: Partial<PressureTestStatisticState>) => void;
}

interface PressureTestStatisticProps {}
const PressureTestStatistic: React.FC<PressureTestStatisticProps> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const handleClick = (current: any) => {
    if (current === state.current) {
      return;
    }
    setState({ current });
  };
  return (
    <MainPageLayout
      extra={<ExtraNode {...state} setState={setState} />}
      title="压测统计"
    >
      <Row className="mg-t4x" type="flex" justify="space-around" gutter={24}>
        {transformEnumKeys(TabMap).map(item => (
          <Col key={item} onClick={() => handleClick(item)}>
            <ChartNode
              {...state}
              setState={setState}
              color={
                +item === TabMap.压测场景
                  ? data => {
                    if (data.type === '待启动') {
                      return '#FFB64A';
                    }
                    return '#11BBD5';
                  }
                  : ['#9153E6', '#1889F1']
              }
              type={item}
              title={TabMap[item]}
            />
          </Col>
        ))}
      </Row>
      {+state.current === TabMap.压测场景 ? (
        <SceneNode {...state} />
      ) : (
        <ScriptNode {...state} />
      )}
    </MainPageLayout>
  );
};
export default PressureTestStatistic;
