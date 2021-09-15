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
      isEdit: true,
      editable: false
    }
  ],
  originList: []
});
export type NodeTypeOneState = ReturnType<typeof getInitState>;
const NodeTypeFive: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());

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

    let result = null;
    result = curValues;

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

  /**
   * @name 编辑行
   */
  const handleEditRow = (originList, id) => {
    setState({
      originList: originList.map(item => {
        return { ...item };
      }),
      list: state.list.map(item => {
        if (item.id === id) {
          return { ...item, editable: true };
        }
        return { ...item };
      })
    });
  };

  const handleSave = id => {
    setState({
      list: state.list.map(item => {
        if (item.id === id) {
          return { ...item, editable: false };
        }
        return { ...item };
      })
    });
  };

  const handleCancle = id => {
    setState({
      list: state.originList
    });
  };

  const handleChangeData = (id, value, k) => {
    setState({
      list: state.list.map(item => {
        if (item.id === id) {
          return { ...item, [k]: value };
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
        dataIndex: 'b',
        render: (text, row) => {
          return row.editable ? (
            <Input
              value={text}
              onChange={e => handleChangeData(row.id, e.target.value, 'b')}
            />
          ) : (
            text
          );
        }
      },
      {
        ...customColumnProps,
        title: '业务表',
        dataIndex: 'c',
        render: (text, row) => {
          return row.editable ? (
            <Input
              value={text}
              onChange={e => handleChangeData(row.id, e.target.value, 'c')}
            />
          ) : (
            text
          );
        }
      },
      {
        ...customColumnProps,
        title: '影子表',
        dataIndex: 'd',
        render: (text, row) => {
          return row.editable ? (
            <Input
              value={text}
              onChange={e => handleChangeData(row.id, e.target.value, 'd')}
            />
          ) : (
            text
          );
        }
      },
      {
        ...customColumnProps,
        title: '编辑',
        dataIndex: 'd',
        render: (text, row) => {
          return !row.editable ? (
            <a
              onClick={() => {
                handleEditRow(state.list, row.id);
              }}
            >
              编辑
            </a>
          ) : (
            <Fragment>
              <a
                onClick={() => {
                  handleSave(row.id);
                }}
              >
                保存
              </a>
              <a
                onClick={() => {
                  handleCancle(row.id);
                }}
              >
                取消
              </a>
            </Fragment>
          );
        }
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
