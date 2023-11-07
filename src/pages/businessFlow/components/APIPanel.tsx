/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button, Tabs, Row, Col, Collapse, Divider, InputNumber, Switch, Radio } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonSelect, CommonTable, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import InputNumberPro from 'src/common/inputNumber-pro';
import { customColumnProps } from 'src/components/custom-table/utils';
import BodyTable from './BodyTable';
import CheckPointTable from './CheckPointTable';
import HeaderTable from './HeaderTable';
import ParamsTable from './ParamsTable';

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
}

const { TabPane } = Tabs;
const { Panel } = Collapse;
const getInitState = () => ({} as any);
const APIPanel: React.FC<Props> = props => {
    
  const { form , index, api, action , linkIndex , linksData } = props;
  const { getFieldDecorator } = form;
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
              value={action === 'edit' ? state?.apiName : undefined} 
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
          checked={action === 'edit' ? state?.enabled : true} 
          onChange={(value, e) => {
            handleTransmit({ enabled: value });
            e.stopPropagation();
          }} 
        />
      </Form.Item>
         <Form.Item >
            <Input
                // value={action === 'edit' ? state?.base?.requestMethod : undefined}   
                value={state?.base?.requestMethod}  
                style={{ width: 80 }}
                disabled={true} 
            />
          </Form.Item>
          <Form.Item >
            <Input
                // value={action === 'edit' ? state?.base?.requestUrl : undefined} 
                value={state?.base?.requestUrl}   
                style={{ minWidth: 500 }}
                disabled={true} 
            />
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>
        } >
          <Tabs defaultActiveKey="1" >
          <TabPane tab="基本请求信息" key="1">
          <Form>
  <Row>
    <Col span={24}>
      <Form.Item label="压测URL">
        <Input.TextArea
          value={action === 'edit' ? state?.base?.requestUrl : undefined}
          placeholder="请输入有效的压测URL，例如 http://www.xxxx.com?k=v"
          onChange={ e =>
            handleTransmit({ base: {
              ...state?.base,
              requestUrl: e.target.value
            }})
           } 
        />
      </Form.Item>
    </Col>
  </Row>
  <Row>
    <Col span={5}>
      <Form.Item label="请求方式">
        <CommonSelect
            value={action === 'edit' ? api?.base?.requestMethod : undefined} 
            dataSource={[
              {
                label: 'GET',
                value: 'GET'
              },
              {
                label: 'POST',
                value: 'POST'
              }
            ]}
            onChange={ value =>
              handleTransmit({ base: {
                ...state?.base,
                requestMethod: value
              }})
             } 
        />
      </Form.Item>
    </Col>
    <Col offset={3} span={8}>
      <Form.Item label="超时时间">
        <InputNumberPro
          value={action === 'edit' ? state?.base?.requestTimeout : undefined} 
          style={{ width: 200 }} 
          addonAfter="毫秒" 
          placeholder="请输入超时时间"
          onChange={ value =>
            handleTransmit({ base: {
              ...state?.base,
              requestTimeout: value
            }})
           } 
        />
      </Form.Item>
    </Col>
    <Col span={8}>
      <Form.Item label="允许302跳转">
        <Switch 
          checked={action === 'edit' ? state?.base?.allowForward : true} 
          onChange={(value) => {
            handleTransmit({ base: {
              ...state?.base,
              allowForward: value
            }});
          }} 
        />
      </Form.Item>
    </Col>
  </Row>
  <Form.Item style={{ display: 'none' }}>
    {getFieldDecorator(`${linkIndex}_${index}_apiType`, {
      initialValue: 'HTTP',
      rules: [{ required: false, message: '' }],
    })(<Input placeholder="请输入类名" />)}
  </Form.Item>
</Form>
          </TabPane>
          {state?.base?.requestMethod === 'POST' &&    <TabPane tab="Body定义" key="5">
            <Form>
              <Form.Item label="Content-Type">
                <Radio.Group
                  value={action === 'edit' ? state?.body?.contentType : undefined} 
                  // onChange={onChange}
                  onChange={(e) => {
                    handleTransmit({ body: {
                      ...state?.body,
                      contentType: e.target.value,
                    }});
                  }}
                >
                  <Radio value={'JSON'}>JSON</Radio>
                  <Radio value={'form-data'}>form-data</Radio>
                  <Radio value={'x-www-form-urlencoded'}>x-www-form-urlencoded</Radio>
                </Radio.Group>
              </Form.Item>
              {state?.body?.contentType === 'JSON' && 
              <Form.Item>
                 <Input.TextArea
                   value={action === 'edit' ? state?.body?.rawData : undefined} 
                   style={{ height: 100 }} 
                   placeholder="如果服务端（被压测端）需要强校验换行符（\n）或者待加密的部分需要有换行符，请使用unescape解码函数对包含换行符的字符串进行反转义：${sys.escapeJava(text)}"
                   onChange={(e) => {
                     handleTransmit({ body: {
                       ...state?.body,
                       rawData: e.target.value
                     }});
                   }}
                 />
              </Form.Item>}
              {(state?.body?.contentType === 'form-data' || state?.body?.contentType === 'x-www-form-urlencoded') && 
              <Form.Item>
                 <BodyTable
                   value={action === 'edit' ? api?.body?.forms : []} 
                   onChange={(value) => {
                     handleTransmit({ body: {
                       ...state?.body,
                       forms: value
                     }});
                   }}
                 />
              </Form.Item>}
            </Form>
          </TabPane>}
      
          <TabPane tab="Header定义" key="2">
          <Form>
              <Form.Item>
                <HeaderTable
                  value={action === 'edit' ? state?.header?.headers : []}
                  onChange={(value) => {
                    handleTransmit({ header: {
                      ...state?.header,
                      headers: value
                    }});
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="出参定义" key="3">
          <Form>
              <Form.Item>
                <ParamsTable 
                  value={action === 'edit' ? state?.returnVar?.vars : []}
                  onChange={(value) => {
                    handleTransmit({ returnVar: {
                      ...state?.returnVar,
                      vars: value
                    }});
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="检查点（断言）" key="4">
          <Form>
              <Form.Item>
                <CheckPointTable 
                  value={action === 'edit' ? state?.checkAssert?.asserts : []}
                  onChange={(value) => {
                    handleTransmit({ checkAssert: {
                      ...state?.checkAssert,
                      asserts: value
                    }});
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="定时器" key="6">
          <Form layout="inline">
              <Form.Item label="线程延迟（毫秒）">
                <InputNumber
                  value={action === 'edit' ? state?.timer?.delay : undefined} 
                  min={0} 
                  precision={0}
                  onChange={(value) => {
                    handleTransmit({ timer: {
                      ...state?.timer,
                      delay: value
                    }});
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="BeanShell预处理程序" key="7">
          <Form>
              <Form.Item label="脚本">
                <Input.TextArea 
                  value={action === 'edit' ? state?.beanShellPre?.script?.[0] : undefined}
                  style={{ height: 200 }}
                  onChange={(e) => {
                    handleTransmit({ beanShellPre: {
                      ...state?.beanShellPre,
                      script: [e.target.value]
                    }});
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="BeanShell后置处理程序" key="8">
          <Form>
              <Form.Item label="脚本">
                <Input.TextArea
                  value={action === 'edit' ? state?.beanShellPost?.script?.[0] : undefined} 
                  style={{ height: 200 }}
                  onChange={(e) => {
                    handleTransmit({ beanShellPost: {
                      ...state?.beanShellPost,
                      script: [e.target.value]
                    }});
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
export default APIPanel;
