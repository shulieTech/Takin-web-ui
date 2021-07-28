import React, { useContext, useRef, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import MissionManageService from '../service';
import styles from '../index.less';
import { CommonModal } from 'racc';
const EditableContext = React.createContext<WrappedFormUtils<any> | null>(null);
const { Option } = Select;

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
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
      >
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
          rules: [
            {
              required: true,
              message: `请输入检查内容`,
            },
          ],
        })(
          <Input onPressEnter={save} onBlur={save} style={{ width: '100%' }} placeholder="请输入检查内容" />)}
      </Form.Item>
    );
  } else if (editable === 'type') {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
      >
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex] || '1',
        })(
          <Select style={{ width: 120 }} onBlur={save}>
            <Option value="1">出参</Option>
          </Select>
        )}
      </Form.Item>
    );
  } else if (editable === 'names') {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
      >
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
        })(
          <Input onPressEnter={save} onBlur={save} style={{ width: '100%' }} placeholder="请输入key值" />)}
      </Form.Item>
    );
  } else if (editable === 'condition') {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
      >
        {form.getFieldDecorator(dataIndex, {
          initialValue: `${record[dataIndex]}` || '1',
        })(
          <Select style={{ width: 120 }} onBlur={save}>
            <Option value="1">等于</Option>
            <Option value="2">不等于</Option>
            <Option value="3">包含</Option>
            <Option value="4">不包含</Option>
          </Select>
        )}
      </Form.Item>
    );
  } else if (editable === 'name1') {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
      >
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
        })(
          <Input onPressEnter={save} onBlur={save} style={{ width: '100%' }} ref={inputRef} placeholder="请输入value值" />)}
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  paramType: string;
  condition: string;
}

interface EditableTableState {
  dataSource: DataType[];
  count: number;
}

class EditableTable extends React.Component<EditableTableProps, EditableTableState> {

  constructor(props: EditableTableProps) {
    super(props);

    this.state = {
      dataSource: [
        {
          key: '0',
          paramType: '1',
          condition: '1',
        },
      ],
      count: 1,
    };
  }

  handleDelete = (key: React.Key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData: DataType = {
      key: count,
      paramType: '1',
      condition: '1',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = (row: DataType) => {
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

  handleSubmit = () => {
    return new Promise(async resolve => {
      const result = {
        id: window.location.href.split('=')[1].split('&')[0],
        chainId: this.props.id,
        isMq: 0,
        assertInfos: this.state.dataSource
      };
      const {
        data: { success }
      } = await MissionManageService.createOrUpdate({ ...result });
      if (success) {
        resolve(true);
        message.success('保存成功');
        return;
      }
      resolve(false);
    });
  };

  getDetails = async () => {
    this.setState({
      dataSource: [
        {
          key: '0',
          paramType: '1',
          condition: '1',
        },
      ]
    });
    const {
      data: { data, success }
    } = await MissionManageService.assertGet({ chainId: this.props.id });
    if (success) {
      if (data.assertInfos) {
        data.assertInfos.map((ite, item) => {
          ite.key = item;
          return ite;
        });
        this.setState({ dataSource: data.assertInfos });
      }
    }
  };

  render() {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '* 断言名称',
        dataIndex: 'assertName',
        width: 200,
        editable: 'name1',
      },
      {
        title: '* 参数类型',
        dataIndex: 'paramType',
        width: 150,
        editable: 'type',
      },
      {
        title: '检查对象',
        dataIndex: 'paramKey',
        width: 200,
        editable: 'names',
      },
      {
        title: '* 检查条件',
        dataIndex: 'condition',
        width: 150,
        editable: 'condition',
      },
      {
        title: '* 检查内容',
        dataIndex: 'referenceValue',
        width: 200,
        editable: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        render: (_, record: { key: React.Key }) =>
        (
          <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDelete(record.key)}>
            <Button
              size="small"
              shape="circle"
              icon="minus"
            />
          </Popconfirm>
        ),
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
    let modalProps = {};
    if (window.location.href.split('type=')[1] === 'detail') {
      modalProps = {
        title: '检查点编辑',
        width: 1177,
        destroyOnClose: true,
        footer: null
      };
    } else {
      modalProps = {
        title: '检查点编辑',
        width: 1177,
        destroyOnClose: true,
      };
    }
    return (
      <CommonModal
        beforeOk={this.handleSubmit}
        modalProps={...modalProps}
        btnText="编辑"
        btnProps={{ style: { height: 0 }, type: 'link' }}
        onClick={this.getDetails}
      >
        <div style={{ position: 'relative' }} className={styles.table}>
          <Button
            onClick={this.handleAdd}
            style={{
              marginBottom: '10px',
              marginLeft: '93%'
            }}
            type="primary"
            icon="plus"
          >新增
          </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            pagination={false}
            dataSource={dataSource}
            columns={column}
          />
        </div>
      </CommonModal >
    );
  }
}
export default EditableTable;