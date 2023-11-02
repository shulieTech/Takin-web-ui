/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button, } from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';

interface Props {
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  index?: any;
  action?: string;
}

const getInitState = () => ({} as any);
const CountForm: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const { index,  action } = props;

  useEffect(() => {
    setState({
      ...props.value,
      
    });
  }, [props.value]);
  
  const handleDelete = (e) => {
    e.stopPropagation();
    let counterData = [];
    let result = null;
    let newData = null;
    counterData = props?.state?.counters;

    result = counterData?.filter((item, k) => {
      if (k !== index) {
        return item;
      }
    });
    newData = result;
    if (action === 'edit') {
      counterData = props?.state?.details?.counters;
      result = counterData?.filter((item, k) => {
        if (k !== index) {
          return item;
        }
      });
      newData = {
        ...props?.state?.details,
        counters: result
      };
    }
    if (props.onChange) {
      props.onChange(newData);
    } 
  };

  const handleTransmit = value => {
    setState({
      ...state,
      ...value
    });
    const curValues = { ...state, ...value };

    let counterData = [];
    let result = null;
    let newData = null;

    counterData = props?.state?.counters;
    result = counterData?.map((item, k) => {
      if (k === index) {
        return curValues;
      }
      return item;
    });
    newData = result;
    if (action === 'edit') {
      counterData = props?.state?.details?.counters;
      result = counterData?.map((item, k) => {
        if (k === index) {
          return curValues;
        }
        return item;
      });
      newData = {
        ...props?.state?.details,
        counters: result
      };
    } 
    if (props.onChange) {
      props.onChange(newData);
    }
  };

  return (
     <Form layout="inline" style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <Form.Item  label="初始值">
            <Input
               value={action === 'edit' ? state?.start : undefined} 
               placeholder="请输入初始值" 
               style={{ width: 200 }}
               onChange={ e =>
                handleTransmit({ start: e.target.value })
               } 
              />
          </Form.Item>
          <Form.Item  label="递增" >
            <Input
              value={action === 'edit' ? state?.incr : undefined}  
              placeholder="请输入递增" 
              style={{ width: 200 }} 
              onChange={ e =>
              handleTransmit({ incr: e.target.value })
             } />
          </Form.Item>
          <Form.Item  label="最大值">
            <Input
              value={action === 'edit' ? state?.end : undefined} 
              placeholder="请输入最大值" 
              style={{ width: 200 }} 
              onChange={ e =>
                handleTransmit({ end: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item  label="数字格式">
            <Input  
              value={action === 'edit' ? state?.format : undefined}  
              placeholder="请输入数字格式" 
              style={{ width: 200 }}
              onChange={ e =>
                handleTransmit({ format: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item  label="引用名称">
            <Input
              value={action === 'edit' ? state?.name : undefined}   
              placeholder="请输入引用名称" 
              style={{ width: 200 }}
              onChange={ e =>
                handleTransmit({ name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>

  );
};
export default CountForm;
