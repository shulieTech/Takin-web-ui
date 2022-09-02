import React, { useState, useEffect, createContext, useContext } from 'react';
import { Table, Form } from 'antd';
import { TableProps } from 'antd/lib/table';

interface Props extends TableProps<any> {}

const RowContext = createContext({
  rowState: {
    form: undefined,
    editing: false,
  },
  setRowState: undefined,
});
const EditableRow = Form.create()((props) => {
  const { children, form, ...restProps } = props;
  const [rowState, setFullRowState] = useState({
    form,
    editing: false,
  });
  return (
    <RowContext.Provider
      value={{
        rowState,
        setRowState: (partState) =>
          setFullRowState({ ...rowState, ...partState }),
      }}
    >
      <tr {...restProps}>{children}</tr>
    </RowContext.Provider>
  );
});

const EditableCell = (props) => {
  const {
    dataIndex,
    title,
    record,
    index,
    render,
    children,
    formField,
    formFieldOptions = {},
    ...restProps
  } = props;
  const { rowState, setRowState } = useContext(RowContext);

  // 有record有_edting时会一开始就启用编辑状态
  useEffect(() => {
    if (record?._edting) {
      setRowState({
        editing: true,
      });
    }
  }, [record?._edting]);

  return (
    <td {...restProps}>
      {rowState.editing && formField ? (
        <Form.Item style={{ margin: 0 }}>
          {rowState.form?.getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex],
            ...formFieldOptions,
          })(formField)}
        </Form.Item>
      ) : render ? (
        render(record[dataIndex], record, index, rowState, setRowState)
      ) : (
        children
      )}
    </td>
  );
};

export default (props: Props) => {
  const { columns, ...rest } = props;

  return (
    <Table
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      columns={columns.map((x) => ({
        ...x,
        onCell: (record, index) => ({
          record,
          dataIndex: x.dataIndex,
          title: x.title,
          render: x.render,
          formField: x.formField,
          formFieldOptions: x.formFieldOptions,
        }),
      }))}
      {...rest}
    />
  );
};
