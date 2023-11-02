/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button,  Switch } from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';

interface Props {
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  action?: string;
}

const getInitState = () => ({} as any);
const GlobalHttp: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const { action } = props;

  useEffect(() => {
    setState({
      ...props.value,
      
    });
  }, [props.value]);

  const handleTransmit = value => {
    setState({
      ...state,
      ...value
    });
    const curValues = { ...state, ...value };

    let newData = null;
    newData = curValues;
 
    if (action === 'edit') {
      newData = {
        ...props?.state?.details,
        globalHttp: curValues
      };
    }
 
    if (props.onChange) {
      props.onChange(newData);
    }
  };

  return (
     <Form layout="inline" style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <Form.Item  label="协议">
         
            <Input 
              value={action === 'edit' ? state?.protocol : undefined} 
              placeholder="请输入协议，http或https" 
              style={{ width: 200 }}
              onChange={ e =>
                handleTransmit({ protocol: e.target.value })
               } 
            />
        
          </Form.Item>
          <Form.Item  label="服务器名称或IP" >
            <Input 
              value={action === 'edit' ? state?.domain : undefined} 
              placeholder="请输入服务器名称或IP"
              style={{ width: 350 }}
              onChange={ e =>
                handleTransmit({ domain: e.target.value })
               } 
            />
          </Form.Item>
          <Form.Item  label="端口号" >
            <Input 
              value={action === 'edit' ? state?.port : undefined} 
              placeholder="请输入端口号" 
              style={{ width: 100 }}
              onChange={ e =>
                handleTransmit({ port: e.target.value })
               } 
            />
          </Form.Item>
          <Form.Item  label="路径" >
            <Input 
              value={action === 'edit' ? state?.path : undefined} 
              placeholder="请输入路径" 
              style={{ width: 500 }}
              onChange={ e =>
                handleTransmit({ path: e.target.value })
               } 
            />
          </Form.Item>
          <Form.Item  label="内容编码" >
            <Input 
              value={action === 'edit' ? state?.contentEncoding : undefined} 
              placeholder="请输入内容编码" 
              style={{ width: 150 }}
              onChange={ e =>
                handleTransmit({ contentEncoding: e.target.value })
               } 
            />
          </Form.Item>
        </Form>

  );
};
export default GlobalHttp;
