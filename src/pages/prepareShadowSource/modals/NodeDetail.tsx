import React, { useState, useEffect } from 'react';
import { Modal, Table, Badge } from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';

interface Props {
  detail: any;
  cancelCallback: () => void;
}

export default (props: Props) => {
  const { detail, cancelCallback } = props;

  const { list, loading, total, query, getList } = useListService({
    // TODO 节点详情列表接口
    service: service.appCheckList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      id: detail.id,
    },
    isQueryOnMount: false,
  });

  const columns = [
    { title: '实例名', dataIndex: 'name' },
    {
      title: '探针状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          {
            0: <Badge status="default">未知状态</Badge>,
            1: <Badge status="success">探针在线</Badge>, // 在线
            2: <Badge status="error">探针离线</Badge>, // 离线
          }[text] || '-'
        );
      },
    },
    {
      title: '探针版本号',
      dataIndex: 'version',
      render: (text) => text || '-',
    },
  ];

  useEffect(() => {
    if (detail?.id) {
      getList({ id: detail.id });
    }
  }, [detail?.id]);

  return (
    <Modal
      visible
      title="节点详情"
      onCancel={cancelCallback}
      destroyOnClose
      footer={null}
      width={600}
      bodyStyle={{
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        pagination={{
          total,
          pageSize: query.pageSize,
          current: query.current + 1,
          hideOnSinglePage: true,
          onChange: (page, pageSize) =>
            getList({
              pageSize,
              current: page - 1,
            }),
          style: { marginRight: 60 },
        }}
        loading={loading}
        size="small"
        scroll={{ x: 'max-content' }}
      />
    </Modal>
  );
};
