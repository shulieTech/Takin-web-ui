import { Checkbox, Col, Input, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { CommonSelect, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomAlert from '../custom-alert/CustomAlert';
import { DataSourceProps } from './types';
interface Props {
  value?: any;
  onChange?: (value: any) => void;
  keys: string;
  dataSource: DataSourceProps[];
  disabled?: boolean;
}
const getInitState = () => ({
  list: [
    {
      id: 1,
      a: true,
      b: 1,
      c: 1,
      d: 1,
      isEdit: true
    }
  ]
});
export type NodeTypeOneState = ReturnType<typeof getInitState>;
const NodeTypeFive: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const keys = props.keys.split(',');
  useEffect(() => {
    setState({
      ...props.value
    });
  }, [props.value]);
  const handleTransmit = value => {
    setState({
      ...state,
      ...value
    });
    const curValues = {};
    keys.forEach(item => {
      curValues[item] = {
        ...state,
        ...value
      }[item];
    });
    let result = null;
    result = !curValues[keys[0]] ? null : curValues;
    if (value[keys[0]] === '2' || state[keys[0]] === '2') {
      result = keys.find(item => !curValues[item]) ? null : curValues;
    }

    if (props.onChange) {
      props.onChange(result);
    }
  };

  /**
   * @name 选择是否加入影子表
   */
  const handleJoin = async checkedId => {
    setState({
      list: state.list.map(item => {
        if (item.id === checkedId) {
          return { ...item, a: item.a ? false : true };
        }
        return { ...item };
      })
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '是否加入影子表',
        dataIndex: 'a',
        render: (text, row) => {
          return (
            <Checkbox checked={text} onChange={() => handleJoin(row.id)} />
          );
        }
      },

      {
        ...customColumnProps,
        title: '业务库',
        dataIndex: 'b'
      },
      {
        ...customColumnProps,
        title: '业务表',
        dataIndex: 'c'
      },
      {
        ...customColumnProps,
        title: '影子表',
        dataIndex: 'd'
      }
    ];
  };

  return (
    <div>
      <CustomAlert
        message
        showIcon
        types="info"
        title={
          <span>
            共用业务表{state.list.length}个，加入影子表
            {
              state.list.filter(item => {
                if (item.a) {
                  return item;
                }
              }).length
            }
            个
          </span>
        }
      />
      <CustomTable columns={getColumns()} dataSource={state.list} />
    </div>
  );
};
export default NodeTypeFive;
