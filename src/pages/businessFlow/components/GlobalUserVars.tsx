/* eslint-disable react-hooks/exhaustive-deps */
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

const GlobalUserVars: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    list: [],
    disabled: false
  });

  useEffect(() => {
    setState({
      list: props.value?.length === 0 ? [{ key: '', value: '', desc: '' }] : props.value
    });
  }, [props.value]);

  /** @name header定义 */
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'Key',
        dataIndex: 'key',
        render: (text, row, index) => {
          return (
                <Input
                  placeholder="请输入Key"
                  value={text}
                  onChange={e =>
                    handleChange('change', 'key', e.target.value, index)
                  }
                />
          );
        }
      },
      {
        ...customColumnProps,
        title: 'Value',
        dataIndex: 'value',
        render: (text, row, index) => {
          return (
            <Input
              placeholder="请输入Value"
              value={text}
              onChange={e =>
                handleChange('change', 'value', e.target.value, index)
              }
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '描述',
        dataIndex: 'desc',
        render: (text, row, index) => {
          return (
            <Input
              placeholder="请输入描述"
              value={text}
              onChange={e =>
                handleChange('change', 'desc', e.target.value, index)
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
        key: '',
        value: '',
        desc: '' 
      });
    } else {
      state.list.splice(k, 1);
    }

    if (props.onChange) {
      props.onChange(state.list);
    }
  };

  return (
      <CommonTable
        rowKey={(row, index) => index.toString()}
        columns={getColumns()}
        size="small"
        dataSource={state.list}
      />
  );
};
export default GlobalUserVars;
