import { Badge, Icon, Row, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { CommonTable, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import EmptyNode from 'src/common/empty-node';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Link } from 'umi';
import LinkDebugService from '../service';
import CallStackDetailModal from '../Modals/CallStackDetailModal';
import { DetailState } from '../detailPage';
import styles from './../index.less';
import { Resizable } from 'react-resizable';
interface Props {
  state?: DetailState;
  traceId: string;
  id?: string;
  callStackMessage?: any;
}

const getInitState = () => ({
  callStackData: null,
  loading: false,
  columns: [
    {
      ...customColumnProps,
      title: '方法',
      dataIndex: 'interfaceName',
      width: 300
    },
    {
      ...customColumnProps,
      title: '应用/中间件',
      dataIndex: 'appAndMiddleware',
      width: 200
    },
    {
      ...customColumnProps,
      title: '服务名',
      dataIndex: 'serviceName',
      ellipsis: true,
      width: 200
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'success',
      width: 100
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      width: 100
    }
  ]
});
export type CallStackTableState = ReturnType<typeof getInitState>;
const CallStackTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<CallStackTableState>(
    getInitState()
  );
  const { traceId, id } = props;

  useEffect(() => {
    if (traceId && props.state.tabKey === '1') {
      queryCallStackList({ traceId });
    }
  }, []);

  /**
   * @name 获取调用栈数据
   */
  const queryCallStackList = async value => {
    setState({
      loading: true
    });
    const {
      data: { data, success }
    } = await LinkDebugService.queryCallStackList({
      ...value
    });
    if (success) {
      setState({
        callStackData: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 替换子节点
   */
  function changeNodes(data, key, node) {
    data.map(item => {
      if (item.id === key) {
        item.nextNodes = node;
      }
      if (item.nextNodes) {
        changeNodes(item.nextNodes, key, node);
      }
    });

    return data;
  }

  const handleExpand = async (expanded, record) => {
    if (expanded === false) {
      setState({
        callStackData: changeNodes(state.callStackData, record.id, [])
      });
      return;
    }
    const {
      data: { success, data }
    } = await LinkDebugService.queryCallStackList({
      traceId,
      id: record.id
    });
    if (success) {
      if (data) {
        setState({
          callStackData: changeNodes(state.callStackData, record.id, data)
        });
      }
    }
  };

  // const ResizeableTitle = props => {
  //   // console.log('props', props);
  //   const { onResize, width, ...restProps } = props;

  //   if (!width) {
  //     return <th {...restProps} />;
  //   }

  //   return (
  //     <Resizable
  //       width={width}
  //       height={0}
  //       onResize={onResize}
  //       draggableOpts={{ enableUserSelectHack: false }}
  //     >
  //       <th {...restProps} />
  //     </Resizable>
  //   );
  // };

  // const components = {
  //   header: {
  //     cell: ResizeableTitle
  //   }
  // };
  const columns = state.columns.map((col, index) => ({
    ...col,
    onHeaderCell: column => ({
      width: column.width,
      onResize: handleResize(index)
    })
  }));

  const handleResize = index => (e, { size }) => {
    // console.log('index', index);
    // console.log('e', e);
    // console.log('size', size);
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width
    };
    setState({
      columns: nextColumns
    });
    // console.log('nextColumns', nextColumns);

    // setState(({ columns }) => {
    //   const nextColumns = [...columns];
    //   nextColumns[index] = {
    //     ...nextColumns[index],
    //     width: size.width
    //   };
    //   console.log('nextColumns', nextColumns);
    //   return { columns: nextColumns };
    // });
  };

  //   console.log('columns', columns);

  return (
    <Table
      bordered
      // components={components}
      loading={state.loading}
      rowKey="id"
      columns={columns}
      size="small"
      dataSource={state.callStackData || []}
      defaultExpandAllRows={false}
      defaultExpandedRowKeys={[0]}
      childrenColumnName="nextNodes"
      onExpand={(expanded, record) => {
        if (record.id !== 0) {
          handleExpand(expanded, record);
        }
      }}
    />
  );
};
export default CallStackTable;
