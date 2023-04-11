import { Card, Icon, Input, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonSelect, CommonTable, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';

interface Props {
  title?: string | React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  dictionaryMap?: any;
}
interface State {
  list: any[];
  disabled: boolean;
}

const CheckPointTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    list: [],
    disabled: false
  });

  useEffect(() => {
    setState({
      list: props.value?.length === 0 ? [{ checkObject: undefined, checkPointType: undefined, checkCondition: undefined, checkContent: undefined }] : props.value
    });
  }, [props.value, setState]);

  /** @name 检查点定义 */
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '检查点类型',
        dataIndex: 'checkPointType',
        render: (text, row, index) => {
          return (
              <CommonSelect
                placeholder="请选择检查点类型"
                dropdownMatchSelectWidth={false}
                value={text}
                dataSource={[
                    { label: '响应Body', value: '响应Body' },
                    // { label: '响应header', value: '响应header' },
                    { label: '响应状态码', value: '响应状态码' },
                    { label: '出参', value: '出参' },
                ]}
                style={{ width: 150 }}
                onChange={value =>
                  handleChange('change', 'checkPointType', value, index)
                }
              />
          );
        }
      }, 
      {
        ...customColumnProps,
        title: <span>检查对象<Tooltip  title={<div><div>当检查点类型=出参时，检查对象填写参数表达式：</div><div>  JSON表达式：示例$.data.code</div><div>    正则表达式：示例"code":"(.*?)"</div></div>}><Icon style={{ marginLeft: 8 }} type="question-circle" /></Tooltip></span>,
        dataIndex: 'checkObject',
        render: (text, row, index) => {
          return (
                <Input
                  disabled={row?.checkObjectDisabled}
                  placeholder="请输入检查对象"
                  value={text}
                  onChange={e =>
                    handleChange('change', 'checkObject', e.target.value, index)
                  }
                />
          );
        }
      },
      {
        ...customColumnProps,
        title: '检查条件',
        dataIndex: 'checkCondition',
        render: (text, row, index) => {
          return (
              <CommonSelect
                dropdownMatchSelectWidth={false}
                value={text}
                dataSource={row?.checkPointType === '响应Body' ? [
                    { label: '等于', value: '等于' },
                    { label: '包含', value: '包含' },
                    { label: '正则匹配', value: '正则匹配' },
                ] : [{ label: '等于', value: '等于' }]}
                style={{ width: 150 }}
                onChange={value =>
                  handleChange('change', 'checkCondition', value, index)
                }
              />
          );
        }
      }, 
      {
        ...customColumnProps,
        title: <span>检查内容<Tooltip  title={`当检查条件=包含或正则匹配时，检查内容可填写正则表达式`}><Icon style={{ marginLeft: 8 }} type="question-circle" /></Tooltip></span>,
        dataIndex: 'checkContent',
        render: (text, row, index) => {
          return (
            <Input
              placeholder="请输入检查内容"
              value={text}
              onChange={e =>
                handleChange('change', 'checkContent', e.target.value, index)
              }
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row, index) => {
          return (
            <span>
              {index <= state.list.length - 1 && state.list.length !== 1 && (
                <Icon
                  type="minus-circle"
                  style={{ color: '#11BBD5', marginLeft: 5 }}
                  onClick={() => handleChange('minus', '', '', index)}
                />
              )}
              {index === state.list.length - 1 && (
                <Icon
                  type="plus-circle"
                  style={{ color: '#11BBD5', marginLeft: 5 }}
                  onClick={() => handleChange('plus', '', '', index)}
                />
              )}
            </span>
          );
        }
      }
    ];
  };

  const handleChange = (type, key, value, k) => {
    setState({ disabled: value.disabled });

    if (type === 'change') {
      if (key === 'checkPointType') {
        if (value === '响应Body') {
          state.list.splice(k, 1, { ...state.list[k], checkObject: '整个body', [key]: value, checkObjectDisabled: true, checkCondition: undefined });
        } else if (value === '响应状态码') {
          state.list.splice(k, 1, { ...state.list[k], checkObject: '状态码', [key]: value, checkObjectDisabled: true, checkCondition: undefined });
        }  else {
          state.list.splice(k, 1, { ...state.list[k], [key]: value, checkCondition: undefined });
        }
      } else {
        if (value === '响应Body') {
          state.list.splice(k, 1, { ...state.list[k], checkObject: '整个body', [key]: value, checkObjectDisabled: true, });
        } else if (value === '响应状态码') {
          state.list.splice(k, 1, { ...state.list[k], checkObject: '状态码', [key]: value, checkObjectDisabled: true });
        } else {
          state.list.splice(k, 1, { ...state.list[k], [key]: value });
        }
      }    
    } else if (type === 'plus') {
      state.list.push({
        checkObject: undefined, checkPointType: undefined, checkCondition: undefined, checkContent: undefined, checkObjectDisabled: false
      });
    } else {
      state.list.splice(k, 1);
    }

    if (props.onChange) {
      props.onChange(state.list);
    }
  };

  return (
    // <Card title={props.title}>
      <CommonTable
        rowKey={(row, index) => index.toString()}
        columns={getColumns()}
        size="small"
        dataSource={state.list}
      />
    // </Card>
  );
};
export default CheckPointTable;
