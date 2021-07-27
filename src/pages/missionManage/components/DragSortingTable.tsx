import React, {
  useState,
  useCallback,
  useRef,
  Fragment,
  useEffect
} from 'react';
import { Button, Row, Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import EditableTable from '../components/EditableTable';
import XunjianModal from '../modals/XunjianModal';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import ServiceLinkModal from '../modals/ServiceLinkModal';
import MissionManageService from '../service';
import styles from '../index.less';
import { start } from 'repl';

const type = 'DragableBodyRow';

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop(
    () => ({
      accept: type,
      collect: monitor => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName:
            dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
        };
      },
      drop: item => {
        moveRow(item.index, index);
      }
    }),
    [index]
  );
  const [, drag] = useDrag(
    () => ({
      type,
      item: { index },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [index]
  );
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};
interface Props {
  location: any;
  setState: any;
}

const DragSortingTable: React.FC<Props> = props => {
  const [datas, setData] = useState([]);
  const [enable, setEnable] = useState(true);

  useEffect(() => {
    queryTable();
  }, []);

  useEffect(() => {
    props.setState({ dataSource: datas });
  }, [datas]);

  function parseJson(arr) {
    arr.forEach((item, index) => {
      item.key = index;
      return item;
    });
    return arr;
  }

  const { location } = props;
  const queryTable = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.sceneDetail({ sceneId: location.query.id });
    if (success) {
      setData(parseJson(data.patrolSceneChainResponse));
    }
  };

  const columns = [
    {
      title: '业务活动',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 300
    },
    {
      title: '类型',
      dataIndex: 'patrolType',
      key: 'patrolType',
      width: 300,
      render: text => (text === 1 ? '技术巡检' : '业务巡检')
    },
    {
      title: '检查点',
      dataIndex: 'isMq',
      width: 300,
      render: (text, row) => {
        if (text === 0) {
          return <EditableTable id={row.chainId} />;
        }
        return <XunjianModal id={row.chainId} />;
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        if (row.patrolType === 1) {
          return (
            <CustomPopconfirm
              title="删除后不可恢复，确定要删除吗？"
              okText="确定删除"
              okColor="var(--FunctionalError-500)"
              onConfirm={() => deleteRow(row.chainId)}
            >
              <a
                style={{
                  display:
                    window.location.href.split('type=')[1] === 'detail'
                      ? 'none'
                      : 'block'
                }}
              >
                删除
              </a>
            </CustomPopconfirm>
          );
        }
        return (
          <ServiceLinkModal
            btnText="查看"
            id={row.chainId}
            activityId={row.activityId}
            row={row}
          />
        );
      }
    }
  ];

  const deleteRow = async id => {
    const {
      data: { data, success }
    } = await MissionManageService.nodeDelete(id);
    if (success) {
      queryTable();
    }
  };

  const components = {
    body: {
      row: DragableBodyRow
    }
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = datas[dragIndex];
      setData(
        update(datas, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        })
      );
    },
    [datas]
  );

  const handleExpandChange = () => {
    setEnable(!enable);
  };

  const expandedRowRender = record => {
    const column = [
      {
        title: '业务活动',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 300
      },
      {
        title: '类型',
        dataIndex: 'patrolType',
        key: 'patrolType',
        width: 300,
        render: text => (text === 1 ? '技术巡检' : '业务巡检')
      },
      {
        title: '检查点',
        dataIndex: 'isMq',
        width: 300,
        render: (text, row) => {
          if (text === 0) {
            return <EditableTable id={row.chainId} />;
          }
          return <XunjianModal id={row.chainId} />;
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          if (row.patrolType === 1) {
            return (
              <CustomPopconfirm
                title="删除后不可恢复，确定要删除吗？"
                okText="确定删除"
                okColor="var(--FunctionalError-500)"
                onConfirm={() => deleteRow(row.chainId)}
              >
                <a
                  style={{
                    display:
                      window.location.href.split('type=')[1] === 'detail'
                        ? 'none'
                        : 'block'
                  }}
                >
                  删除
                </a>
              </CustomPopconfirm>
            );
          }
          return (
            <ServiceLinkModal
              btnText="查看"
              id={row.chainId}
              activityId={row.activityId}
              row={row}
            />
          );
        }
      }
    ];
    return (
      <Table
        columns={column}
        dataSource={record.techActivities}
        pagination={false}
        showHeader={false}
      />
    );
  };

  return (
    <div className={styles.align}>
      <div
        style={{
          margin: '10px 0 15px 95%',
          display: enable ? 'block' : 'none'
        }}
      >
        <Button
          onClick={handleExpandChange}
          style={{
            color: '#11bbd5',
            borderColor: '#11bbd5'
          }}
        >
          排序
        </Button>
      </div>
      <div
        style={{
          margin: '10px 0 15px 89%',
          display: enable ? 'none' : 'block'
        }}
      >
        <Button onClick={handleExpandChange} type="primary">
          确认
        </Button>
        <Button
          onClick={handleExpandChange}
          style={{
            color: '#11bbd5',
            borderColor: '#11bbd5',
            marginLeft: '10px'
          }}
        >
          取消
        </Button>
      </div>
      <div style={{ display: enable ? 'none' : 'block' }}>
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={enable ? [] : datas}
            components={components}
            pagination={false}
            onRow={(record, index) => ({
              index,
              moveRow
            })}
          />
        </DndProvider>
      </div>
      <div style={{ display: enable ? 'block' : 'none' }}>
        <Table
          columns={columns}
          dataSource={enable ? datas : []}
          childrenColumnName="techActivities"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default DragSortingTable;
