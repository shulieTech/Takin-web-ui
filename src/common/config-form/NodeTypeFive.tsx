import { Button, Checkbox, Col, Input, message, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { CommonSelect, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
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
  list: [],
  originList: [],
  editingKey: ''
});
export type NodeTypeOneState = ReturnType<typeof getInitState>;
const NodeTypeFive: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());

  useEffect(() => {
    setState({
      list:
        props.value &&
        props.value.map((item, k) => {
          return {
            ...item,
            shaDowTableName: `pt_${item.bizTableName}`,
            id: k,
            editable: false
          };
        })
    });
  }, [props.value]);

  const handleTransmit = value => {
    const result = value.map((item, k) => {
      delete item.id;
      delete item.editable;
      return {
        ...item
      };
    });

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
          return { ...item, isCheck: item.isCheck ? false : true };
        }
        return { ...item };
      })
    });
    handleTransmit(
      state.list.map(item => {
        if (item.id === checkedId) {
          return { ...item, isCheck: item.isCheck ? false : true };
        }
        return { ...item };
      })
    );
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
      }),
      editingKey: id
    });
  };

  const handleSave = (id, row) => {
    if (!row.bizDatabase || !row.bizTableName) {
      message.info('业务库业务表不能为空！');
      return;
    }
    setState({
      list: state.list.map(item => {
        if (item.id === id) {
          return { ...item, editable: false };
        }
        return { ...item };
      }),
      editingKey: ''
    });
    handleTransmit(
      state.list.map(item => {
        if (item.id === id) {
          return { ...item, editable: false };
        }
        return { ...item };
      })
    );
  };

  const handleCancle = (id, row) => {
    setState({
      list: state.originList,
      editingKey: ''
    });
    handleTransmit(state.originList);
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

  const handleDelete = id => {
    setState({
      list: state.list.filter(item => {
        if (item.id !== id) {
          return { ...item };
        }
      })
    });
    handleTransmit(
      state.list.filter(item => {
        if (item.id !== id) {
          return { ...item };
        }
      })
    );
  };

  const handleAdd = () => {
    handleEditRow(state.list, state.list.length);

    setState({
      editingKey: state.list.length.toString(),
      list: state.list.concat([
        {
          id: state.list.length,
          isCheck: false,
          bizDatabase: undefined,
          bizTableName: undefined,
          shaDowTableName: undefined,
          isManual: true,
          editable: true
        }
      ])
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '是否加入影子表',
        dataIndex: 'isCheck',
        width: 120,
        render: (text, row) => {
          return (
            <Checkbox checked={text} onChange={() => handleJoin(row.id)} />
          );
        }
      },

      {
        ...customColumnProps,
        title: '业务库',
        dataIndex: 'bizDatabase',
        render: (text, row) => {
          return row.editable ? (
            <Input
              value={text}
              onChange={e =>
                handleChangeData(row.id, e.target.value, 'bizDatabase')
              }
            />
          ) : (
            text
          );
        }
      },
      {
        ...customColumnProps,
        title: '业务表',
        dataIndex: 'bizTableName',
        render: (text, row) => {
          return row.editable ? (
            <Input
              value={text}
              onChange={e =>
                handleChangeData(row.id, e.target.value, 'bizTableName')
              }
            />
          ) : (
            text
          );
        }
      },
      {
        ...customColumnProps,
        title: '影子表',
        dataIndex: 'shaDowTableName',
        render: (text, row) => {
          return row.editable ? (
            <Input
              value={row.bizTableName ? `pt_${row.bizTableName}` : undefined}
              disabled={true}
            />
          ) : row.bizTableName ? (
            `pt_${row.bizTableName}`
          ) : (
            ''
          );
        }
      },
      {
        ...customColumnProps,
        title: '编辑',
        dataIndex: 'isManual',
        width: 80,
        render: (text, row) => {
          return !text ? (
            '-'
          ) : !row.editable ? (
            <Fragment>
              <Button
                style={{ margin: 0, padding: 0 }}
                type="link"
                disabled={state.editingKey !== ''}
                onClick={() => {
                  handleEditRow(state.list, row.id);
                }}
              >
                编辑
              </Button>
              <CustomPopconfirm
                okText="确认删除"
                title={'是否删除该行？'}
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDelete(row.id)}
              >
                <a style={{ marginLeft: 8 }}>删除</a>
              </CustomPopconfirm>
            </Fragment>
          ) : (
            <Fragment>
              <a
                onClick={() => {
                  handleSave(row.id, row);
                }}
              >
                保存
              </a>
              <a
                style={{ marginLeft: 8 }}
                onClick={() => {
                  handleCancle(row.id, row);
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
                if (item.isCheck) {
                  return item;
                }
              }).length
            }
            个
          </span>
        }
      />
      <Button
        type="primary"
        style={{ marginBottom: 8, marginTop: 8 }}
        onClick={handleAdd}
        disabled={state.editingKey !== ''}
      >
        添加影子表
      </Button>
      <CustomTable columns={getColumns()} dataSource={state.list} />
    </div>
  );
};
export default NodeTypeFive;
