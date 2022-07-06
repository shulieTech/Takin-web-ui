import React from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import update from 'immutability-helper';
import styles from './index.less';
import { set } from 'lodash';
import { message } from 'antd';

let dragingIndex = -1;

const BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };

  let { className } = restProps;
  if (isOver) {
    if (restProps.index > dragingIndex) {
      className += ` ${styles['drop-over-downward']}`;
    }
    if (restProps.index < dragingIndex) {
      className += ` ${styles['drop-over-upward']}`;
    }
  }

  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
};

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
      rowRawData: props.rowRawData,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    // props.moveRow(dragIndex, hoverIndex);
    props.moveRow(monitor.getItem().rowRawData, props.rowRawData);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, (connect) => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow)
);

const useDragTable = ({
  dataSource,
  draggable = true,
  updateDataSource,
  rowKey = 'id',
  childrenColumnName = 'children',
  canCrossLevel = false,
}) => {
  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const rowKeyMap = {};
  // 递归DataSource，保存path和map信息
  const loopForPath = (data: any[], parentPath = '') => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((x, i) => {
        const currentPath = `${
          parentPath ? `${parentPath}.` : parentPath
        }[${i}]`;
        const item = {
          ...x,
          [childrenColumnName]: loopForPath(
            x[childrenColumnName],
            `${currentPath ? `${currentPath}.` : ''}${childrenColumnName}`
          ),
          _path: currentPath,
        };
        rowKeyMap[x[rowKey]] = item;
        return item;
      });
    }
    return undefined;
  };

  const dataSourceHasPath = loopForPath(dataSource);

  const onRowMove = (dragRowData, hoverRowData) => {
    // const dragRow = dataSourceHasPath[dragIndex];
    // const newDataSource = update(dataSource, {
    //   data: {
    //     $splice: [
    //       [dragIndex, 1],
    //       [hoverIndex, 0, dragRow],
    //     ],
    //   },
    // }).data;
    const getParentPath = (pathStr: string) =>
      pathStr.substring(0, pathStr.lastIndexOf('.'));
    const newDataSource = dataSource.concat();
    if (
      !canCrossLevel &&
      getParentPath(dragRowData._path) !== getParentPath(hoverRowData._path)
    ) {
      message.warn('不支持跨层级拖拽');
      return;
    } 
    set(newDataSource, dragRowData._path, hoverRowData);
    set(newDataSource, hoverRowData._path, dragRowData);
    
    updateDataSource(newDataSource);
  };

  return {
    TableWarpper: (props) =>
      draggable ? (
        <DndProvider backend={HTML5Backend}>{props.children}</DndProvider>
      ) : (
        <>{props.children}</>
      ),
    tableProps: draggable
      ? {
        components,
        onRow: (record, index) => ({
          index,
          rowRawData: rowKeyMap[record[rowKey]],
          moveRow: onRowMove,
        }),
      }
      : {},
  };
};

export default useDragTable;
