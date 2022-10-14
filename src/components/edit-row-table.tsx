import React, { useState, useEffect, createContext, useContext } from 'react';
import { Table, Form } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

interface Props extends TableProps<any> {
  columns: EditableColumnProps[];
}
export interface EditableColumnProps extends ColumnProps<any> {
  record?: any;
  index?: number;
  formField?: React.ReactNode;
  getFormField?: (record, dataIndex, index, rowState, setRowState) => React.ReactNode;
  formFieldOptions?: GetFieldDecoratorOptions;
  getFormFieldOptions?: (record, dataIndex, index, rowState, setRowState) => GetFieldDecoratorOptions;
}

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

const EditableCell = (props: EditableColumnProps) => {
  const {
    dataIndex,
    title,
    record,
    index,
    render,
    children,
    formField,
    getFormField,
    formFieldOptions = {},
    getFormFieldOptions,
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

  const finalFormField = getFormField
    ? getFormField(record, dataIndex, index, rowState, setRowState)
    : formField;

  return (
    <td {...restProps}>
      {rowState.editing && finalFormField ? (
        <Form.Item style={{ margin: 0 }}>
          {rowState.form?.getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex],
            ...formFieldOptions,
            ...(getFormFieldOptions
              ? getFormFieldOptions(
                  record,
                  dataIndex,
                  index,
                  rowState,
                  setRowState
                )
              : {}),
          })(finalFormField)}
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
          getFormField: x.getFormField,
          formFieldOptions: x.formFieldOptions,
          getFormFieldOptions: x.getFormFieldOptions,
        }),
      }))}
      {...rest}
    />
  );
};
