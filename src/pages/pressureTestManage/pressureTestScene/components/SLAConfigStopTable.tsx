import { Card, Icon, Input } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonSelect, CommonTable, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import Rule from './Rule';

interface Props {
  title: string | React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  dictionaryMap?: any;
}
interface State {
  list: any[];
  disabled: boolean;
}

const SLAConfigStopTable: React.FC<Props> = props => {
  const { dictionaryMap } = props;
  const [state, setState] = useStateReducer<State>({
    list: [],
    disabled: false
  });

  useEffect(() => {
    setState({
      list: props.value
    });
  }, []);

  /** @name 终止条件配置 */
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '名称',
        dataIndex: 'ruleName',
        render: (text, row, index) => {
          return (
            <Input
              placeholder="请输入规则名称"
              value={text}
              onChange={e =>
                handleChange('change', 'ruleName', e.target.value, index)
              }
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '对象',
        dataIndex: 'businessActivity',
        render: (text, row, index) => {
          return (
            <CommonSelect
              dropdownMatchSelectWidth={false}
              disabled={state.disabled}
              value={text}
              mode="multiple"
              dataSource={
                props.state.selectedBussinessActiveList
                  ? [
                    {
                      label: '全部',
                      value: '-1'
                    }
                  ].concat(
                      props.state.selectedBussinessActiveList.map(item => {
                        return {
                          label: item.businessActivityName,
                          value: String(item.businessActivityId)
                        };
                      })
                    )
                  : []
              }
              style={{ width: 150 }}
              onChange={value =>
                handleChange('change', 'businessActivity', value, index)
              }
              onRender={item => (
                <CommonSelect.Option key={item.value} value={item.value}>
                  {item.label}
                </CommonSelect.Option>
              )}
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '规则',
        dataIndex: 'rule',
        render: (text, row, index) => {
          return (
            <Rule
              dictionaryMap={dictionaryMap}
              value={text}
              onChange={value => handleChange('change', 'rule', value, index)}
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
        ruleName: '',
        businessActivity: undefined,
        rule: ''
      });
    } else {
      state.list.splice(k, 1);
    }

    if (props.onChange) {
      props.onChange(state.list);
    }
  };

  return (
    <Card title={props.title}>
      <CommonTable
        rowKey={(row, index) => index.toString()}
        columns={getColumns()}
        size="small"
        dataSource={state.list}
      />
    </Card>
  );
};
export default SLAConfigStopTable;
