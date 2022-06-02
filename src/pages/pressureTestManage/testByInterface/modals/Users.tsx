import React, { useEffect, useState } from 'react';
import { Modal, Input, Cascader, message, Form, Button } from 'antd';
import CustomTable from 'src/components/custom-table';
import service from '../service';

import { ModalProps } from 'antd/lib/modal';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import useListService from 'src/utils/useListService';

const FormItem = Form.Item;

interface Props extends ModalProps {
  form: WrappedFormUtils;
  defaultValue?: any;
  cancelCallback: () => void;
  okCallback: (reuslt: any) => void;
}

const UsersModal: React.FC<Props> = (props) => {
  const {
    okCallback,
    cancelCallback,
    form,
    defaultValue = [],
    ...rest
  } = props;
  const [depts, setDepts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(defaultValue);
  const { getFieldDecorator } = form;
  /**
   * @name 获取部门列表
   */
  const queryDepartmentList = async (params = {}) => {
    const {
      data: { data, success },
    } = await service.queryDepartmentList(params);
    if (success) {
      setDepts(data);
    }
  };

  const { query, total, list, getList, loading } = useListService({
    defaultQuery: {
      pageSize: -1,
    },
    service: service.queryAccountList,
    isQueryOnMount: true,
  });

  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        getList({
          ...values,
          departmentId: values?.departmentId?.[values.departmentId.length - 1],
        });
      }
    });
  };

  const handleOk = () => {
    okCallback(selectedUsers);
  };

  useEffect(() => {
    queryDepartmentList();
  }, []);

  return (
    <Modal
      title="选择人员"
      visible
      onCancel={cancelCallback}
      onOk={handleOk}
      width={600}
      {...rest}
    >
      <Form
        layout="inline"
        onSubmit={handleSubmit}
        onReset={() => form.resetFields()}
      >
        <FormItem>
          {getFieldDecorator(
            'departmentId',
            {}
          )(
            <Cascader
              placeholder="请选择部门"
              options={depts}
              fieldNames={{ label: 'title', value: 'id', children: 'children' }}
              changeOnSelect
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator(
            'accountName',
            {}
          )(<Input placeholder="请输入账号名称" />)}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 8 }}
            loading={loading}
          >
            搜索
          </Button>
          <Button type="default" htmlType="reset">
            重置
          </Button>
        </FormItem>
      </Form>
      <CustomTable
        rowKey="id"
        columns={[
          {
            title: '',
            dataIndex: 'accountName',
          },
          {
            title: '',
            dataIndex: 'department',
          },
        ]}
        dataSource={list}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedUsers.map((x) => x.id),
          onChange: (keys, rows) => {
            setSelectedUsers(rows);
          },
        }}
        loading={loading}
      />
    </Modal>
  );
};

export default Form.create()(UsersModal);
