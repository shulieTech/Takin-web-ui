/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button, Tabs,  Collapse,  Switch} from 'antd';
import {  useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import CheckPointTable from './CheckPointTable';
import IB2HeaderTable from './IB2HeaderTable';

interface Props {
  title?: string | React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  form?: any;
  index?: any;
  api?: any;
  action?: string;
  setState?: any;
  linkIndex?: any;
  linksData: any;
  javaRequestDetails: any;
}
const { TabPane } = Tabs;
const { Panel } = Collapse;
const getInitState = () => ({} as any);
const IB2Node: React.FC<Props> = props => {
    
  const { index,  action , linkIndex , linksData, javaRequestDetails } = props;
  const [state, setState] = useStateReducer(getInitState());
  useEffect(() => {
    setState({
      ...props.value,
    });
  }, [props.value]);

  const handleDelete = (e) => {
    e.stopPropagation();
    const apisData = linksData?.[linkIndex]?.apis;
    const result = apisData?.filter((item, k) => {
      if (k !== index) {
        return item;
      }
    });
    if (props.onChange) {
      props.onChange(result);
    }
  };

  const handleTransmit = value => {
    setState({
      ...state,
      ...value
    });
    const curValues = { ...state, ...value };

    let apisData = [];
    let result = null;
    let newData = null;

    apisData = linksData?.[linkIndex]?.apis;
    result = apisData?.map((item, k) => {
      if (k === index) {
        return curValues;
      }
      return item;
    });
    newData = result;
    if (props.onChange) {
      props.onChange(newData);
    }
  };

  return (
    <Collapse expandIconPosition="left" style={{ marginBottom: 8 }}>
    <Panel header={
        <Form layout="inline">
          <Form.Item >
              <Input 
                value={state?.apiName} 
                placeholder="请输入压测API名称" 
                onChange={ e =>
                  handleTransmit({ apiName: e.target.value })
                } 
                onClick={(e) => {
                  e.stopPropagation();
                // tslint:disable-next-line:jsx-alignment
                }}/>
          </Form.Item>
          <Form.Item >
          <Switch
            checked={state?.enabled} 
            onChange={(value, e) => {
              handleTransmit({ enabled: value });
              e.stopPropagation();
            }} 
          />
         <Form.Item >
           <Input
             value={action === 'edit' && state?.needRequest  ? javaRequestDetails?.className : action === 'edit' ? state?.base?.requestUrl : javaRequestDetails?.className} 
             placeholder="请输入类名" 
             disabled={true} 
             style={{ minWidth: 500, marginLeft: 20 }}
           />
        </Form.Item>
      </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>
        } key="1">
          <Tabs defaultActiveKey="1" >
          <TabPane tab="基本请求信息" key="1">
           <Form>
              <Form.Item label="类名">
                <Input
                  value={action === 'edit' && state?.needRequest  ? javaRequestDetails?.className : action === 'edit' ? state?.base?.requestUrl : javaRequestDetails?.className}  
                  placeholder="请输入类名" 
                  disabled={true}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="参数定义" key="2">
          <Form>
              <Form.Item>
                <IB2HeaderTable
                  // value={action === 'edit' && state?.needRequest ? javaRequestDetails?.params?.map((item, k) => {
                  //   return { ...item, allowEdit: false };
                  // }) : action === 'edit' ? state?.param?.params : javaRequestDetails?.params?.map((item, k) => {
                  //   return { ...item, allowEdit: false };
                  // })}
                  value={state?.param?.params} 
                  onChange={(value) => {
                    handleTransmit({ param: {
                      params: value
                    } });
                  }} 
                  />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="检查点（断言）" key="3">
          <Form>
              <Form.Item>
                <CheckPointTable
                  value={state?.checkAssert?.asserts} 
                  onChange={(value) => {
                    handleTransmit({ checkAssert: {
                      asserts: value
                    } });
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
    </Panel>
    </Collapse>
  );
};
export default IB2Node;
