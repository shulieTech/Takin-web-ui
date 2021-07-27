import { InputNumber, Row, Slider } from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
interface Props {
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}
interface State {
  value: number;
}
const InputNumberWithSlider: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    value: null
  });

  useEffect(() => {
    setState({
      value: props.value
    });
  }, [props.value]);

  const handleChange = value => {
    setState({
      value
    });
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const handleBlur = () => {
    if (props.onBlur) {
      props.onBlur({ ...state });
    }
  };

  return (
    <Row type="flex" style={{ width: '100%' }}>
      <Slider
        min={props.min}
        max={props.max}
        // disabled={typeof state.value === 'number' ? false : true}
        disabled={props.disabled}
        value={typeof state.value === 'number' ? state.value : props.min}
        onChange={value => handleChange(value)}
        onBlur={() => handleBlur()}
        style={{ width: 'calc(100% - 130px)', display: 'inline-block' }}
      />
      <InputNumber
        style={{ width: 105, display: 'inline-block', marginLeft: 10 }}
        precision={0}
        min={props.min}
        max={props.max}
        value={state.value}
        disabled={props.disabled}
        // disabled={typeof state.value === 'number' ? false : true}
        onBlur={() => handleBlur()}
        onChange={value => handleChange(value)}
      />
    </Row>
  );
};
export default InputNumberWithSlider;
