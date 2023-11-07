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
}
interface State {
  list: any[];
  disabled: boolean;
  type: string;
}
const { TabPane } = Tabs;
const { Panel } = Collapse;
const getInitState = () => ({} as any);
const APIPanel: React.FC<Props> = props => {
    
  const { form , index, api, action , linkIndex } = props;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldValue } = form;
//   console.log('form------',form?.getFieldsValue());
  // console.log('api', api);
  // const [state, setState] = useStateReducer<State>({
  //   list: [],
  //   disabled: false,
  //   type: ''
  // });
  const [state, setState] = useStateReducer(getInitState());
  useEffect(() => {
    console.log('props.value', props.value);
    setState({
      ...props.value,
      
    });
  }, [props.value]);

  const onChange = (e) => {
    setState({
      type: e.target.value
    });
    form?.setFieldsValue({
      [`${linkIndex}_${index}_contentType`]: e.target.value 
    });
    // form?.setFieldsValue(`${linkIndex}_${index}_contentType`, e.target.value);
    console.log('getFieldValue', getFieldValue(`${linkIndex}_${index}_contentType`));
  };

  const removePropertiesStartingWith = (obj, prefix) => {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith(prefix)) {
        delete obj[key];
      }
    });
  };

  function resetFieldsErrors(keys) {

    const fields = keys.reduce((acc, key) => {
      acc[key] = {
        value: undefined,
        errors: null
      };
      return acc;
    }, {});
    console.log('hahahahhaha这是files', fields);
  
    form.setFieldsValue(fields);
  }

  const resetFieldsStartingWith = (prefix, obj) => {
    const fieldsToReset = Object.keys(obj).filter(key => key.startsWith(prefix));
    console.log('fieldsToReset', fieldsToReset);
    resetFieldsErrors(fieldsToReset);
    form.resetFields(fieldsToReset);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    // console.log('index', index);
    console.log('here-?????????执行');
    // const allFields = Object.keys(form.getFieldsValue());
    if (action === 'edit') {
      // resetFieldsStartingWith(`${linkIndex}_${index}`, form.getFieldsValue());
      const fields = form.getFieldsValue();
      const newFields = Object.keys(fields).reduce((result, key) => {
        if (!key.startsWith(`${linkIndex}_${index}`)) {
          result[key] = fields[key];
        }
        return result;
      }, {});
   
      props.setState({
        formFields: Object.keys(newFields),
        details: deleteApiAtIndexWithoutMutation(props?.state?.details, linkIndex, index)
      });
      return; 
    }
    // console.log('props?.state?.apis', props?.state?.apis, index);

    // const newArray = props?.state?.apis?.slice(0, index).concat(props?.state?.apis.slice(index + 1));
    // console.log('newArray', newArray);
    props?.state?.apis.splice(index, 1);
    props.setState({
    //   apis: newArray
    });
  };

  function removeApiAtIndex(json, linksIndex, apiIndex) {
    console.log('linksIndex-----', json, linksIndex, apiIndex);
    if (json.links && json.links[linksIndex] && json.links[linksIndex].apis) {
      // json.links[linksIndex].apis.splice(apiIndex, 1);
      json.links[linksIndex].apis?.filter((item, k) => {
        if (k !== apiIndex) {
          return item;
        }
      });
    }
  }

  function deleteApiAtIndexWithoutMutation(object, linksIndex, apiIndex) {
    const newObject = JSON.parse(JSON.stringify(object));
  
    if (
      newObject &&
      newObject.links &&
      newObject.links[linksIndex] &&
      newObject.links[linksIndex].apis
    ) {
      newObject.links[linksIndex].apis.splice(apiIndex, 1);
      return newObject;
    } 
    console.error('Invalid indices or object structure.');
    return object;
    
  }

  const handleTransmit = value => {
    setState({
      ...state,
      ...value
    });
    const curValues = { ...state, ...value };
    console.log('curValues',curValues);

    // let counterData = [];
    // let result = null;
    // let newData = null;

    // counterData = props?.state?.counters;
    // result = counterData?.map((item, k) => {
    //   if (k === index) {
    //     return curValues;
    //   }
    //   return item;
    // });
    // newData = result;
    // if (action === 'edit') {
    //   counterData = props?.state?.details?.counters;
    //   result = counterData?.map((item, k) => {
    //     if (k === index) {
    //       return curValues;
    //     }
    //     return item;
    //   });
    //   newData = {
    //     ...props?.state?.details,
    //     counters: result
    //   };
    // } 
    // if (props.onChange) {
    //   props.onChange(newData);
    // }
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
          {getFieldValue(`${linkIndex}_${index}_requestMethod`) === 'POST' &&    <TabPane tab="Body定义" key="5">
            <Form>
              <Form.Item label="Content-Type">
                {getFieldDecorator(`${linkIndex}_${index}_contentType`, {
                  initialValue: action === 'edit' ? api?.body?.contentType : undefined,
                  rules: [{ required: true, message: 'url不能为空!' }],
                })(<Radio.Group onChange={onChange} >
                  <Radio value={'JSON'}>JSON</Radio>
                  <Radio value={'form-data'}>form-data</Radio>
                  <Radio value={'x-www-form-urlencoded'}>x-www-form-urlencoded</Radio>
                </Radio.Group>)}
              </Form.Item>
              {getFieldValue(`${linkIndex}_${index}_contentType`) === 'JSON' && 
              <Form.Item>
                 {getFieldDecorator(`${linkIndex}_${index}_rawData`, {
                   initialValue: action === 'edit' ? api?.body?.rawData : undefined,
                   rules: [{ required: false, message: '不能为空!' }],
                 })(<Input.TextArea style={{ height: 100 }} placeholder="如果服务端（被压测端）需要强校验换行符（\n）或者待加密的部分需要有换行符，请使用unescape解码函数对包含换行符的字符串进行反转义：${sys.escapeJava(text)}"/>)}
              </Form.Item>}
              {(getFieldValue(`${linkIndex}_${index}_contentType`) === 'form-data' || getFieldValue(`${linkIndex}_${index}_contentType`) === 'x-www-form-urlencoded') && 
              <Form.Item>
                 {getFieldDecorator(`${linkIndex}_${index}_forms`, {
                   initialValue: action === 'edit' ? api?.body?.forms : [],
                   rules: [{ required: false, message: '不能为空!' }],
                 })(<BodyTable/>)}
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
