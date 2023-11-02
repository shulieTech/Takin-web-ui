/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button,  Switch, Dropdown } from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import IB2Node from './IB2Node';
import APIPanel from './APIPanel';

interface Props {
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  action?: string;
  form?: any;
  linkIndex: any;
}

const getInitState = () => ({} as any);
const LinkItem: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const { action, form , linkIndex } = props;

  useEffect(() => {
    console.log('props.value', props.value);
    setState({
      ...props.value,
    });
  }, [props.value]);

  const handleDeleteLink = () => {

    let linksData = [];
    let result = null;
    let newData = null;
    linksData = props?.state?.links;

    result = linksData?.filter((item, k) => {
      if (k !== linkIndex) {
        return item;
      }
    });
    newData = result;
    if (action === 'edit') {
      linksData = props?.state?.details?.links;
      result = linksData?.filter((item, k) => {
        if (k !== linkIndex) {
          return item;
        }
      });
      newData = {
        ...props?.state?.details,
        links: result
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
    console.log('curValues', curValues);

    let linksData = [];
    let result = null;
    let newData = null;

    linksData = props?.state?.links;
    result = linksData?.map((item, k) => {
      if (k === linkIndex) {
        return curValues;
      }
      return item;
    });
    newData = result;
    if (action === 'edit') {
      linksData = props?.state?.details?.links;
      result = linksData?.map((item, k) => {
        if (k === linkIndex) {
          return curValues;
        }
        return item;
      });
      newData = {
        ...props?.state?.details,
        links: result
      };
    } 

    if (props.onChange) {
      props.onChange(newData);
    }
  };

  return (
    <Form style={{ border: '1px solid #ddd', padding: '8px 16px', marginBottom: 20 }}>
    <Form layout="inline">
      <Form.Item >
        <Input
          value={action === 'edit' ? state?.linkName : '链路名称'} 
          placeholder="请输入链路名称" 
          onChange={ e =>
            handleTransmit({ linkName: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item >
        <CommonSelect 
            value={action === 'edit' ? state?.linkType : 'normal'} 
            style={{ width: 160 }} 
            dataSource={[
              {
                label: '普通线程组',
                value: 'normal'
              },
              {
                label: 'setUp线程组',
                value: 'setUp'
              },
              {
                label: 'tearDown线程组',
                value: 'tearDown'
              }
            ]}
            onChange={ value =>
                handleTransmit({ linkType: value })
              } 
        />
      </Form.Item>
      <Form.Item >
        <Switch
          checked={action === 'edit' ? state?.enabled : true} 
          onChange={(value) => {
            handleTransmit({ enabled: value });
          }}
        />
      </Form.Item>
      <Form.Item style={{ float: 'right' }}>
        <Button onClick={() => { handleDeleteLink(); }} type="link">删除</Button>
      </Form.Item>
    </Form>
    {/* {action === 'edit' ? linkNode?.apis?.map((formItem, index) => {
      if (formItem?.apiType === 'HTTP') {
        return <APIPanel key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
      }
      return <IB2Node key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
    }) : state?.apis?.map((formItem, index) => {
      if (formItem?.apiType === 'HTTP') {
        return <APIPanel key={index} form={form} index={index} api={formItem} setState={setState} state={state} linkIndex={linkIndex}/>;
      }
      return <IB2Node key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
    })} */}
<div style={{ marginTop: 20 }}>
  {/* <Dropdown.Button onClick={() => addNode('HTTP', linkIndex)} overlay={() =>  menu(linkIndex)}>
    添加压测节点
  </Dropdown.Button> */}
</div>
    </Form>

  );
};
export default LinkItem;
