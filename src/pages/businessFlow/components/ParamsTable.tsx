import { Card, Icon, Input } from 'antd';
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

const ParamsTable: React.FC<Props> = props => {
  const { dictionaryMap } = props;
  const [state, setState] = useStateReducer<State>({
    list: [],
    disabled: false
  });

  useEffect(() => {
    setState({
      list: props.value?.length === 0 ? [{ varName: undefined, varSource: undefined, parseExpress: undefined, matchIndex: undefined }] : props.value
    });
  }, [props.value, setState]);

  /** @name header定义 */
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '出参名',
        dataIndex: 'varName',
        render: (text, row, index) => {
          return (
                <Input
                  placeholder="请输入出参名"
                  value={text}
                  onChange={e =>
                    handleChange('change', 'varName', e.target.value, index)
                  }
                />
          );
        }
      },
      {
        ...customColumnProps,
        title: '来源',
        dataIndex: 'varSource',
        render: (text, row, index) => {
            return (
              <CommonSelect
                dropdownMatchSelectWidth={false}
                value={text}
                dataSource={[
                    { label: 'Body:JSON', value: 'Body:JSON' },
                    // { label: 'Body:TEXT', value: 'Body:TEXT' },
                    { label: 'Header:K/V', value: 'Header:K/V' },
                    // { label: 'Cookie:K/V', value: 'Cookie:K/V' },
                    // { label: '响应状态码', value: '响应状态码' },
                ]}
                style={{ width: 150 }}
                onChange={value =>
                  handleChange('change', 'varSource', value, index)
                }
              />
            );
          }
      }, 
      {
        ...customColumnProps,
        title: '解析表达式',
        dataIndex: 'parseExpress',
        render: (text, row, index) => {
          return (
            <Input
              placeholder="请输入出参提取表达式"
              value={text}
              onChange={e =>
                handleChange('change', 'parseExpress', e.target.value, index)
              }
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '第几个匹配项',
        dataIndex: 'matchIndex',
        render: (text, row, index) => {
          return (
            <Input
              placeholder="请输入匹配项"
              value={text}
              onChange={e =>
                handleChange('change', 'matchIndex', e.target.value, index)
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
      state.list.splice(k, 1, { ...state.list[k], [key]: value });
    } else if (type === 'plus') {
      state.list.push({
        1: '',
        2: '',
        3: ''
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
export default ParamsTable;
