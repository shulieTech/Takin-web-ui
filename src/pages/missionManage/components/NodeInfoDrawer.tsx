/**
 * @name
 * @author MingShined
 */
import { Drawer, Col, Row, Tooltip, Table, Input, Button, Switch, Form, Select, message } from 'antd';
import React, { useContext, useEffect, useRef } from 'react';
import { BusinessActivityDetailsContext } from '../modals/ServiceLinkModal';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { NodeType } from '../enum';
import MissionManageService from '../service';
import _ from 'lodash';
import styles from '../index.less';
import { router } from 'umi';
const EditableContext = React.createContext<WrappedFormUtils<any> | null>(null);
const { Option } = Select;
interface Props {
  id?: string;
  row: any;
}
const NodeInfoDrawer: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  if (!state.nodeInfo || !state.nodeInfo) {
    return null;
  }
  return (
    <Drawer
      maskClosable
      title="链路节点选取"
      onClose={() => setState({ nodeVisible: false })}
      width={1100}
      placement="right"
      mask={false}
      visible={state.nodeVisible}
      className={styles.nodeInfoDrawer}
      destroyOnClose={true}
      closable={true}
    >
      <NodeDetailsHeader
        type={state.nodeInfo.nodeType}
        title={state.nodeInfo._label}
        providerService={state.providerService || []}
        setState={setState}
        row={props.row}
      />
    </Drawer>
  );
};
export default NodeInfoDrawer;

export const NodeDetailsHeader: React.FC<{
  title: string;
  actions?: React.ReactNode;
  type: NodeType;
  providerService: any;
  setState: any;
  row: any;
}> = props => {
  const imgUrlMap = {
    [NodeType.应用]: 'app_details_icon',
    [NodeType.外部应用]: 'outer_details_icon',
    [NodeType.数据库]: 'db_details_icon',
    [NodeType.文件]: 'oss_details_icon',
    [NodeType.未知应用]: 'unknow_details_icon',
    [NodeType.消息队列]: 'mq_details_icon',
    [NodeType.缓存]: 'cache_details_icon'
  };
  return (
    <div style={{ border: '1px solid #F0F0F0', padding: 24 }}>
      <Row className="mg-b3x" align="middle" type="flex" justify="space-between">
        <Col>
          <Row type="flex" align="middle">
            <Col>
              <img
                src={require(`../../../assets/${imgUrlMap[props.type]}.png`)}
                style={{ width: 64, height: 64 }}
                alt=""
              />
            </Col>
            <Col className="mg-l2x" style={{ marginLeft: '10px' }}>
              <div>
                {props.title.length > 24 ? (
                  <Tooltip title={props.title}>
                    <span
                      style={{
                        fontSize: 22,
                        color: '#393B4F',
                        fontWeight: 'bold'
                      }}
                    >
                      {props.title.substr(0, 24)}...
                    </span>
                  </Tooltip>
                ) : (
                  <span
                    style={{ fontSize: 22, color: '#393B4F', fontWeight: 'bold' }}
                  >
                    {props.title}
                  </span>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={styles.border}>
        <span className={styles.blueline} />
        <span className={styles.boldTitle}>节点</span>
        <EditableTable providerService={props.providerService} setState={props.setState} row={props.row} />
      </div>
    </div>
  );
};

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
};

const EditableFormRow = Form.create()(EditableRow);

interface EditableCellProps {
  title: React.ReactNode;
  editable: String;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const form = useContext(EditableContext)!;
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const save = async () => {
    const values = await form.validateFields();
    handleSave({ ...record, ...values });
  };

  let childNode = children;

  if (editable === 'name') {
    if (record.isDeleted === false) {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
        >
          {form.getFieldDecorator(dataIndex, {
            initialValue: `${record.serviceName}#${record.method}`,
          })(
            <Input onPressEnter={save} onBlur={save} style={{ width: '100%' }} ref={inputRef} />)}
        </Form.Item>
      );
    } else {
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
        >
          {form.getFieldDecorator(dataIndex, {
            initialValue: `${record.nodeName}`,
          })(
            <Input onPressEnter={save} onBlur={save} style={{ width: '100%' }} ref={inputRef} />)}
        </Form.Item>
      );
    }

  } else if (editable === 'condition') {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
      >
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex] || false,
        })(
          <Switch onClick={save} checked={record[dataIndex]} />
        )}
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface EditableTableProps {
  setState: any;
  providerService: any;
  row: any;
}

interface EditableTableState {
  dataSource: any;
  count: number;
}

class EditableTable extends React.Component<EditableTableProps, EditableTableState> {

  constructor(props: EditableTableProps) {
    super(props);

    this.componentDidMount = () => {
      if (this.props.providerService) {
        const datas = _.cloneDeep(this.props.providerService);
        datas.map((ite, ind) => {
          ite.nodeName = ite.serviceName;
          if (ite.isDeleted === 1) {
            ite.isDeleted = false;
          } else {
            ite.isDeleted = true;
          }
          ite.key = ind;
          return ite;
        });
        this.setState({ dataSource: datas });
      }
    };

    this.state = {
      dataSource: [],
      count: 1,
    };
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    // tslint:disable-next-line:no-shadowed-variable
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  submit = async () => {
    const datas = _.cloneDeep(this.state.dataSource);
    datas.map((ite, ind) => {
      ite.techNodeId = ite.nodeId;
      if (ite.isDeleted) {
        ite.isDeleted = 0;
      } else {
        ite.isDeleted = 1;
      }
      delete ite.key;
    });
    datas.map((ite, ind) => {
      if (ite.id) {
        ite.isNew = 0;
      } else {
        if (ite.isDeleted === 1) {
          ite.isNew = 2;
        } else {
          ite.isNew = 1;
        }
      }
    });
    const newData = datas.filter(ele => ele.isNew !== 2);
    const result = {
      chainId: this.props.row.chainId,
      isMq: this.props.row.isMq,
      patrolSceneId: this.props.row.patrolSceneId,
      nodeList: newData
    };
    const {
      data: { data, success }
    } = await MissionManageService.nodeAdd({
      ...result
    });
    if (success) {
      message.success(data.msg);
      setTimeout(() => {
        this.props.setState({ nodeVisible: false });
        location.reload();
      }, 1000);
    }
  }

  render() {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '节点',
        dataIndex: 'serviceName',
        width: 250,
        render: (text, record) => {
          return `${text}#${record.method}`;
        }
      },
      {
        title: '类型',
        dataIndex: 'nodeType',
        width: 100
      },
      {
        title: '技术巡检节点名称',
        dataIndex: 'nodeName',
        editable: 'name',
      },
      {
        title: '技术巡检节点',
        dataIndex: 'isDeleted',
        editable: 'condition',
        width: 150
      },
    ];
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const column = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div style={{ marginTop: 20 }}>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={column}
        />
        <div>
          <Button
            onClick={this.submit}
            type="primary"
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              display: window.location.href.split('type=')[1] === 'detail' ? 'none' : 'block'
            }}
          >保存
          </Button>
        </div>
      </div>
    );
  }
}