import React, { useState, useEffect, useRef } from 'react';
import { Button, Select, Input } from 'antd';
import SearchTable from 'src/components/search-table';
import service from './service';
import EditMachineModal from './modals/EditMachine';

const { Option } = Select;

export default () => {
  const [editItem, setEditItem] = useState();

  const columns = [
    { title: 'IP/Host', dataIndex: 'address' },
    { title: '配置' },
    { title: '占用情况' },
    { title: '状态' },
    { title: '所属分组', dataIndex: 'group' },
    { title: '所属区域', dataIndex: 'area' },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <a>停用</a>
          </>
        );
      },
    },
  ];

  const formData = [
    {
      key: 'status',
      node: (
        <Select allowClear placeholder="状态">
          <Option value={1}>在线</Option>
          <Option value={2}>离线</Option>
        </Select>
      ),
    },
    {
      key: 'avilable',
      node: (
        <Select allowClear placeholder="占用情况">
          <Option value={1}>未占用</Option>
          <Option value={2}>占用</Option>
        </Select>
      ),
    },
    {
      key: 'area',
      node: (
        <Select allowClear placeholder="所属区域">
          <Option value={1}>广州</Option>
          <Option value={2}>上海</Option>
        </Select>
      ),
    },
    {
      key: 'group',
      node: (
        <Select allowClear placeholder="所属分组">
          <Option value={1}>分组1</Option>
          <Option value={2}>分组2</Option>
        </Select>
      ),
    },
    {
      key: 'name',
      node: <Input placeholder="搜索" />,
    },
  ];

  return (
    <>
      <SearchTable
        commonTableProps={{
          columns,
        }}
        commonFormProps={{
          formData,
          rowNum: 4,
        }}
        ajaxProps={{ url: '/scenemanage/list', method: 'GET' }}
        // toggleRoload={state.isReload}
        tableAction={
          <Button type="primary" onClick={() => setEditItem({})}>
            定制发压机资源池
          </Button>}
      />
      {editItem && (
        <EditMachineModal
          detail={editItem}
          okCallback={() => {
            setEditItem(undefined);
            // TODO 刷新
          }}
          cancelCallback={() => {
            setEditItem(undefined);
          }}
        />
      )}
    </>
  );
};
