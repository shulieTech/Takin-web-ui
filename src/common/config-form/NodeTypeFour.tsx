import { Col, Input, Row } from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import { DataSourceProps } from './types';
interface Props {
  value?: any;
  onChange?: (value: any) => void;
  keys: string[];
  dataSource: DataSourceProps[];
  disabled?: boolean;
  inputProps?: any;
}
const getInitState = () => ({});
export type NodeTypeOneState = ReturnType<typeof getInitState>;
const NodeTypeFour: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const keys = props.keys;
  useEffect(() => {
    setState({
      ...props.value
    });
  }, [props.value]);
  const handleTransmit = value => {
    setState({
      ...state,
      ...value
    });
    const curValues = {};
    keys.forEach(item => {
      curValues[item] = {
        ...state,
        ...value
      }[item];
    });
    let result = null;
    result = !curValues[keys[0]] ? null : curValues;
    if (result[keys[0]] === '2') {
      result = keys.find(item => !curValues[item]) ? null : curValues;
    }

    if (props.onChange) {
      props.onChange(result);
    }
  };
  return (
    <Fragment>
      <Row type="flex" gutter={12}>
        <Col>
          <CommonSelect
            allowClear={false}
            dataSource={props.dataSource}
            onChange={value =>
              handleTransmit({ [keys[0]]: value, [keys[1]]: undefined })
            }
            value={state ? state[keys[0]] : undefined}
            placeholder="请选择"
            style={{ width: 160 }}
          />
        </Col>
        {state[keys[0]] === '2' && (
          <Col>
            <Input
              {...props.inputProps}
              onChange={e => handleTransmit({ [keys[1]]: e.target.value })}
              value={state ? state[keys[1]] : undefined}
              placeholder="请输入"
            />
          </Col>
        )}
        {/* TODO 组件可扩展性较差，只支持2个下拉选项，这里只能硬编码处理了，value为3的时候，后面这个显示为普通输入框 */}
        {state[keys[0]] === '3' && (
          <Col>
            <Input
              onChange={e => handleTransmit({ [keys[1]]: e.target.value })}
              value={state ? state[keys[1]] : undefined}
              placeholder="请输入"
            />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
export default NodeTypeFour;
