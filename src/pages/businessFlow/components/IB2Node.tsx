import { Form, Input, Button, Tabs, Row, Col, Collapse, Divider, InputNumber, Switch, Radio } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonSelect, CommonTable, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import InputNumberPro from 'src/common/inputNumber-pro';
import { customColumnProps } from 'src/components/custom-table/utils';
import BodyTable from './BodyTable';
import CheckPointTable from './CheckPointTable';
import HeaderTable from './HeaderTable';
import IB2HeaderTable from './IB2HeaderTable';
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
  linkIndex?:any;
}
interface State {
  list: any[];
  disabled: boolean;
}
const { TabPane } = Tabs;
const { Panel } = Collapse;
const IB2Node: React.FC<Props> = props => {
    
  const { form , index, api, action,linkIndex } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;
//   console.log('form------',form?.getFieldsValue());
//   const [state, setState] = useStateReducer<State>({

//   });

//   useEffect(() => {

//   }, []);

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

  function removeApiAtIndex(json, linkIndexs, apiIndex) {
    if (json.links && json.links[linkIndexs] && json.links[linkIndexs].apis) {
      json.links[linkIndexs].apis.splice(apiIndex, 1);
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
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>
        } key="1">
          <Tabs defaultActiveKey="1" >
          <TabPane tab="基本请求信息" key="1">
           <Form>
              <Form.Item label="类名">
                {getFieldDecorator(`${linkIndex}_${index}_requestUrl`, {
                  initialValue: action === 'edit' && api?.needRequest  ? props?.state?.javaRequestDetails?.className : action === 'edit' ? api?.base?.requestUrl : props?.state?.javaRequestDetails?.className,
                  rules: [{ required: true, message: '请输入类名!' }],
                })(<Input placeholder="请输入类名" />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {getFieldDecorator(`${linkIndex}_${index}_apiType`, {
                  initialValue: 'JAVA',
                  rules: [{ required: false, message: '' }],
                })(<Input placeholder="请输入类名" />)}
              </Form.Item>
            </Form>
          </TabPane>
      
          <TabPane tab="参数定义" key="2">
          <Form>
              <Form.Item>
                {getFieldDecorator(`${linkIndex}_${index}_params`, {
                  initialValue: action === 'edit' && api?.needRequest ? props?.state?.javaRequestDetails?.params?.map((item, k) => {
                    return { ...item, allowEdit: false };
                  }) : action === 'edit' ? api?.param?.params : props?.state?.javaRequestDetails?.params?.map((item, k) => {
                    return { ...item, allowEdit: false };
                  }),
                  rules: [{ required: false, message: '' }],
                })(<IB2HeaderTable />)}
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
    </Panel>
    </Collapse>
  );
};
export default IB2Node;
