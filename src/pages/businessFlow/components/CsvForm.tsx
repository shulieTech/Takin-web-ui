/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Button,  Switch } from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';

interface Props {
  title?: string | React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  form?: any;
  index?: any;
  action?: string;
  setState?: any;
  csv: any;
}
interface State {
  list: any[];
  disabled: boolean;
}

const getInitState = () => ({} as any);
const CsvForm: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const { form , index,  action, csv } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;

  useEffect(() => {
    console.log('props.value', props?.value);
    setState({
      ...props.value,
      
    });
  }, [props.value]);

  const handleDelete = (e) => {
    e.stopPropagation();
    let csvData = [];
    let result = null;
    let newData = null;
    csvData = props?.state?.csvs;

    result = csvData?.filter((item, k) => {
      if (k !== index) {
        return item;
      }
    });
    newData = result;
    if (action === 'edit') {
      csvData = props?.state?.details?.dataSource?.csvs;
      result =   result = csvData?.filter((item, k) => {
        if (k !== index) {
          return item;
        }
      });
      newData = {
        ...props?.state?.details,
        dataSource: {
          ...props?.state?.details?.dataSource,
          csvs: result
        }
      };
    }
    console.log('result', result);
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

    let csvData = [];
    let result = null;
    let newData = null;

    csvData = props?.state?.csvs;
    result = csvData?.map((item, k) => {
      if (k === index) {
        return curValues;
      }
      return item;
    });
    newData = result;
    if (action === 'edit') {
      csvData = props?.state?.details?.dataSource?.csvs;
      result = csvData?.map((item, k) => {
        if (k === index) {
          return curValues;
        }
        return item;
      });
      newData = {
        ...props?.state?.details,
        dataSource: {
          ...props?.state?.details?.dataSource,
          csvs: result
        }
      };
    } 
    console.log('newData', newData);  

    if (props.onChange) {
      props.onChange(newData);
    }
  };

  return (
     <Form layout="inline" style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <Form.Item  label="文件名">
            <Input 
                value={action === 'edit' ? state?.fileName : undefined}
                placeholder="请输入文件名"
                style={{ width: 250 }} 
                onChange={ e =>
              handleTransmit({ fileName: e.target.value })
             } 
            />
          </Form.Item>
          <Form.Item  label="变量名（西文逗号间隔）" >
            <Input 
                value={action === 'edit' ? state?.params : undefined}
                placeholder="请输入变量名（西文逗号间隔)" 
                style={{ width: 350 }} 
                onChange={ e =>
                  handleTransmit({ params: e.target.value })
                } 
            />
          </Form.Item>
          <Form.Item  label="首行忽略">
            <Switch 
                checked={action === 'edit' ? state?.ingoreFirstLine : false}
                onChange={(value) => {
                  handleTransmit({ ingoreFirstLine: value });
                }}
             />
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="link" style={{ marginBottom: 8 }} onClick={handleDelete}>删除</Button>
          </Form.Item>
        </Form>

  );
};
export default CsvForm;
