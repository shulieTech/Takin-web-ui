/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button,  Switch, Dropdown, Menu } from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
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
    // console.log('props.value', props.value);
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
    console.log('curValues---linkitem', curValues);

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

  const addNode = (type, defaultName?) => {
    let node = [];
    if (type === 'HTTP') {
      node = [{
        apiName: '',
        apiType: type,
        enabled: true,
        base: {
          allowForward: true,
          requestMethod: 'GET',
          requestTimeout: undefined,
          requestUrl: ''
        },
        body: {
          forms: [
            {
              key: '',
              value: ''
            }
          ],
          rawData: ''
        },
        checkAssert: {
          asserts: [
            {
              checkCondition: undefined,
              checkContent: undefined,
              checkObject: undefined,
              checkPointType: undefined,
            }
          ]
        },
        header: {
          headers: [
            {
              key: undefined,
              value: undefined
            }
          ]
        },
        returnVar: {
          vars: [
            {
              matchIndex: undefined,
              parseExpress: undefined,
              testName: undefined,
              varName: undefined,
              varSource: undefined
            }
          ]
        }
      }
      ];
    }
    if (type === 'JAVA') {
      node = [{
        apiName: '',
        apiType: type,
        enabled: true,
        base: {
          requestUrl: defaultName
        },
        param: {
          params: []
        },
        needRequest: true,
        checkAssert: {
          asserts: [
            {
              checkCondition: undefined,
              checkContent: undefined,
              checkObject: undefined,
              checkPointType: undefined
            }
          ]
        },
      }
      ];
    }
  
    if (action === 'edit') {
      const newLinks  = props?.state?.details?.links?.map((item, k) => {
        if (k === linkIndex) {
          return {
            linkName: item?.linkName,
            linkType: item?.linkType,
            enabled: item?.enabled,
            apis: item?.apis?.concat(node)
          };
        }
        return item;
      });
      if (props.onChange) {
        props.onChange({
          ...props?.state?.details,
          links: newLinks
        });
      }
      return;
    }
    if (props.onChange) {
      props.onChange({
        apis: state?.apis?.concat(node)
      });
    }
  };

  function handleMenuClick(e) {
    if (e.key === 'HTTP') {
      addNode('HTTP', linkIndex);
    }
    if (e.key === 'JAVA') {
    //   queryJavaRequestDetail(linkIndex);
    }
  }

  const menu = () => {
    // tslint:disable-next-line:jsx-wrap-multiline
    return <Menu onClick={(e) => handleMenuClick(e)}>
    <Menu.Item key="HTTP">
      HTTP压测节点
    </Menu.Item>
    <Menu.Item key="JAVA">
      IB2压测节点
    </Menu.Item>
    </Menu>;
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
    { state?.apis?.map((formItem, index) => {
      if (formItem?.apiType === 'HTTP') {
        return <APIPanel 
          onChange={(value) => {
            handleTransmit({ apis: value });
          }}
          linksData={action === 'edit' ? props?.state?.details?.links : props?.state?.links}
          value={formItem} 
          key={index} 
          form={form} 
          index={index} 
          api={formItem} 
          action={action} 
          setState={setState} 
          state={state} 
          linkIndex={linkIndex}
        />;
      }
      return <IB2Node key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
    }) 
    }
<div style={{ marginTop: 20 }}>
  <Dropdown.Button onClick={() => addNode('HTTP')} overlay={() =>  menu()}>
    添加压测节点
  </Dropdown.Button>
</div>
    </Form>

  );
};
export default LinkItem;
