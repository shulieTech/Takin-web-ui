import { Col, InputNumber, Row } from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import styles from './../index.less';
interface Props {
  value?: any;
  onChange?: (value: any) => void;
  dictionaryMap?: any;
}
interface State {
  ruleObj: {
    indexInfo: string | number;
    condition: string | number;
    during: number;
    times: number;
  };
}
const Rule: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    ruleObj: {
      indexInfo: undefined,
      condition: undefined,
      during: undefined,
      times: undefined
    }
  });

  const { dictionaryMap } = props;
  const { SLA_TARGER_TYPE, COMPARE_TYPE } = dictionaryMap;

  useEffect(() => {
    if (!props.value) {
      return;
    }
    setState({
      ruleObj: props.value
    });
  }, [props.value]);
  const handleChange = (key, value) => {
    setState({ ruleObj: { ...state.ruleObj, [key]: value } });
    if (props.onChange) {
      props.onChange({
        ...state.ruleObj,
        [key]: value,
        disabled: +value === 4 || +value === 5 ? true : false
      });
    }
  };

  return (
    <Row type="flex">
      <Col>
        <CommonSelect
          value={
            state.ruleObj.indexInfo || state.ruleObj.indexInfo === 0
              ? String(state.ruleObj.indexInfo)
              : state.ruleObj.indexInfo
          }
          placeholder="指标"
          onChange={value => {
            handleChange('indexInfo', value);
          }}
          style={{ width: 100 }}
          dataSource={SLA_TARGER_TYPE ? SLA_TARGER_TYPE : []}
        />
      </Col>
      <Col>
        <CommonSelect
          dataSource={COMPARE_TYPE ? COMPARE_TYPE : []}
          value={
            state.ruleObj.condition || state.ruleObj.condition === 0
              ? String(state.ruleObj.condition)
              : state.ruleObj.condition
          }
          style={{ width: 100, margin: '0 10px' }}
          placeholder="条件"
          onChange={value => {
            handleChange('condition', value);
          }}
        />
      </Col>
      <Col>
        <InputNumber
          value={state.ruleObj.during}
          style={{ width: 100 }}
          min={0}
          precision={0}
          onChange={value => {
            handleChange('during', value);
          }}
        />
        <span className={styles.suffix}>
          {String(state.ruleObj.indexInfo) === '0'
            ? 'ms'
            : String(state.ruleObj.indexInfo) === '1'
            ? '' 
            : String(state.ruleObj.indexInfo) === '6'
            ? ''
            : '%'}
        </span>
      </Col>
      <Col>
        <span className={styles.suffix}>连续出现</span>
        <InputNumber
          value={state.ruleObj.times}
          style={{ width: 100 }}
          min={0}
          precision={0}
          onChange={value => {
            handleChange('times', value);
          }}
        />
        <span className={styles.suffix}>次</span>
      </Col>
    </Row>
  );
};
export default Rule;
