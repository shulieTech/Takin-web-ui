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
const APIPanel: React.FC<Props> = props => {
    
  const { form , index, api, action , linkIndex } = props;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldValue } = form;
//   console.log('form------',form?.getFieldsValue());
  // console.log('api', api);
  const [state, setState] = useStateReducer<State>({
    list: [],
    disabled: false,
    type: ''
  });

  useEffect(() => {
    setState({
      list: props.value?.length === 0 ? [{ key: '', value: '' }] : props.value,
      type: api?.body?.contentType
    });
  }, [props.value]);

//   const handleChange = (type, key, value, k) => {
//     setState({ disabled: value.disabled });
//     if (type === 'change') {
//       state.list.splice(k, 1, { ...state.list[k], [key]: value });
//     } else if (type === 'plus') {
//       state.list.push({
//         key:'',
//         value:''
//       });
//     } else {
//       state.list.splice(k, 1);
//     }

//     if (props.onChange) {
//       props.onChange(state.list);
//     }
//   };

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

  const handleDelete = (e) => {
    e.stopPropagation();
    // console.log('index', index);
    if (action === 'edit') {
    //   console.log('props?.state?.details', props?.state?.details);
      removeApiAtIndex(props?.state?.details, 0, index);
    //   console.log(' removeApiAtIndex(props?.state?.details, 0, index)', removeApiAtIndex(props?.state?.details, 0, index));
      props.setState({
        // details: removeApiAtIndex(props?.state?.details, 0, index)
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
    if (json.links && json.links[linksIndex] && json.links[linksIndex].apis) {
      json.links[linksIndex].apis.splice(apiIndex, 1);
    }
  }

  return (
    <Collapse expandIconPosition="left" style={{ marginBottom: 8 }}>
    <Panel header={
        <Form layout="inline">
          <Form.Item >
            {getFieldDecorator(`${linkIndex}_${index}_apiName`, {
              initialValue: action === 'edit' ? api?.apiName : undefined,
              rules: [{ required: true, message: '请输入压测API名称!' }],
            })(<Input placeholder="请输入压测API名称" onClick={(e) => {
              e.stopPropagation();
            }}/>)}
          </Form.Item>
          <Form.Item >
         {getFieldValue(`${linkIndex}_${index}_requestMethod`)}
          </Form.Item>
          <Form.Item >
          {getFieldValue(`${linkIndex}_${index}_requestUrl`)}
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>
        } key="1">
          <Tabs defaultActiveKey="1" >
          <TabPane tab="基本请求信息" key="1">
          <Form>
  <Row>
    <Col span={24}>
      <Form.Item label="压测URL">
        {getFieldDecorator(`${linkIndex}_${index}_requestUrl`, {
          initialValue: action === 'edit' ? api?.base?.requestUrl : undefined,
          rules: [{ required: true, message: 'url不能为空!' }],
        })(<Input.TextArea placeholder="请输入有效的压测URL，例如 http://www.xxxx.com?k=v" />)}
      </Form.Item>
    </Col>
  </Row>
  <Row>
    <Col span={5}>
      <Form.Item label="请求方式">
        {getFieldDecorator(`${linkIndex}_${index}_requestMethod`, {
          initialValue: action === 'edit' ? api?.base?.requestMethod : undefined,
          rules: [{ required: true, message: '请输入请求方式!' }],
        })(<CommonSelect dataSource={[
          {
            label: 'GET',
            value: 'GET'
          },
          {
            label: 'POST',
            value: 'POST'
          }
        ]}/>)}
      </Form.Item>
    </Col>
    <Col offset={3} span={8}>
      <Form.Item label="超时时间">
        {getFieldDecorator(`${linkIndex}_${index}_requestTimeout`, {
          initialValue: action === 'edit' ? api?.base?.requestTimeout : undefined,
          rules: [{ required: false, message: '请输入超时时间!' }],
        })(<InputNumberPro style={{ width: 200 }} addonAfter="毫秒" placeholder="请输入超时时间"/>)}
      </Form.Item>
    </Col>
    <Col span={8}>
      <Form.Item label="允许302跳转">
        {getFieldDecorator(`${linkIndex}_${index}_allowForward`, {
          valuePropName: 'checked',
          initialValue: action === 'edit' ? api?.base?.allowForward : true,
          rules: [{ required: false, message: '请输入超时时间!' }],
        })(<Switch/>)}
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
                {getFieldDecorator(`${linkIndex}_${index}_headers`, {
                  initialValue: action === 'edit' ? api?.header?.headers : [],
                  rules: [{ required: false, message: 'url不能为空!' }],
                })(<HeaderTable />)}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="出参定义" key="3">
          <Form>
              <Form.Item>
                {getFieldDecorator(`${linkIndex}_${index}_vars`, {
                  initialValue: action === 'edit' ? api?.returnVar?.vars : [],
                  rules: [{ required: false, message: '' }],
                })(<ParamsTable />)}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="检查点（断言）" key="4">
          <Form>
              <Form.Item>
                {getFieldDecorator(`${linkIndex}_${index}_asserts`, {
                  initialValue: action === 'edit' ? api?.checkAssert?.asserts : [],
                  rules: [{ required: false, message: '' }],
                })(<CheckPointTable />)}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="定时器" key="5">
          <Form layout="inline">
              <Form.Item label="线程延迟（毫秒）">
                {getFieldDecorator(`${linkIndex}_${index}_delay`, {
                  initialValue: action === 'edit' ? api?.timer?.delay : undefined,
                  rules: [{ required: false, message: '' }],
                })(<InputNumber min={0} precision={0}/>)}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="BeanShell预处理程序" key="6">
          <Form>
              <Form.Item label="脚本">
                {getFieldDecorator(`${linkIndex}_${index}_beanShellPre`, {
                  initialValue: action === 'edit' ? api?.beanShellPre?.script?.[0] : undefined,
                  rules: [{ required: false, message: '' }],
                })(<Input.TextArea style={{ height: 200 }}/>)}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="BeanShell后置处理程序" key="7">
          <Form>
              <Form.Item label="脚本">
                {getFieldDecorator(`${linkIndex}_${index}_beanShellPost`, {
                  initialValue: action === 'edit' ? api?.beanShellPost?.script?.[0] : undefined,
                  rules: [{ required: false, message: '' }],
                })(<Input.TextArea style={{ height: 200 }}/>)}
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
    </Panel>
    </Collapse>
  );
};
export default APIPanel;
