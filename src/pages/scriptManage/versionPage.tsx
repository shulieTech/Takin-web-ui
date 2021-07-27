/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import { useStateReducer } from 'racc';
import React from 'react';
import { MainPageLayout } from 'src/components/page-layout';
import { Basic } from 'src/types';
import VersionDetails from './components/VersionDetails';
import VersionExtra from './components/VersionExtra';
import VersionList from './components/VersionList';

const getInitState = () => ({
  versionList: [],
  current: undefined
});

type State = ReturnType<typeof getInitState>;
export interface VersionHistoryChildrenProps extends Partial<State> {
  setState?: (state: Partial<State>) => void;
  [name: string]: any;
}
interface Props extends Basic.BaseProps {}

const VersionHistory: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>(getInitState());
  const { query } = props.location;
  return (
    <MainPageLayout
      title="版本历史"
      extra={<VersionExtra {...state} setState={setState} />}
    >
      <Row type="flex" style={{ height: '100%' }}>
        <Col style={{ width: 200 }}>
          <VersionList {...query} {...state} setState={setState} />
        </Col>
        <Col className="flex-1">
          <VersionDetails {...query} {...state} setState={setState} />
        </Col>
      </Row>
    </MainPageLayout>
  );
};
export default VersionHistory;
