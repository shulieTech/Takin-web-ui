import React, { useState, useEffect } from 'react';
import { Modal, Input, Popconfirm, Icon, message, Button, Tooltip } from 'antd';
import services from '../service';
import CustomTable from 'src/components/custom-table';

interface Props {}
declare var window: any;

const DomainManageModal: React.FC<Props> = (props) => {
  const [showListModal, setShowListModal] = useState(false);
  const [query, setQuery] = useState({ current: 0, pageSize: 5 });
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableLoding, setTableLoading] = useState(false);

  const getList = async () => {
    setTableLoading(true);
    const {
      headers: { 'x-total-count': count },
      data: { data, success },
    } = await services.domainList(query);
    setTableLoading(false);
    if (success) {
      setList(data);
      setTotal(+count);
    }
  };

  // const refreshDictionary = () => {
  //   window.g_app._store.dispatch({
  //     type: 'common/getDictionaries',
  //   });
  // };

  const editItem = (record) => {
    let nameValue = record.name;
    Modal.confirm({
      title: `${record.id ? '编辑' : '新增'}业务域`,
      icon: null,
      content: (
        <Input
          placeholder="请输入业务域名称"
          defaultValue={record.name}
          onChange={(e) => (nameValue = e.target.value)}
          maxLength={30}
        />
      ),
      onOk: async () => {
        if (!nameValue?.trim()) {
          message.error('请填写业务域名称');
          return Promise.reject('请填写业务域名称');
        }
        const {
          data: { data, success },
        } = await services[record.id ? 'domainUpdate' : 'domainAdd']({
          ...record,
          name: nameValue.trim(),
        });
        if (success) {
          message.success('操作成功');
          getList();
        }
      },
    });
  };

  const deleteItem = async (record) => {
    const {
      data: { success },
    } = await services.domainDelete({ id: record.id });
    if (success) {
      message.success('操作成功');
      if (query.current === 0) {
        // 可能已经在第一页了，页码没发生变化，所以这里还是得手动刷新下列表
        getList();
      } else {
        // 不在第一页，直接修改页码触发刷新
        setQuery({
          ...query,
          current: 0,
        });
      }
    }
  };

  useEffect(() => {
    if (showListModal) {
      getList();
    }
  }, [showListModal, JSON.stringify(query)]);

  return (
    <>
      <Tooltip title="业务域设置">
        <a>
          <Icon
            type="setting"
            style={{ marginLeft: 4, cursor: 'pointer' }}
            onClick={() => {
              setShowListModal(true);
            }}
          />
        </a>
      </Tooltip>
      <Modal
        destroyOnClose
        getContainer={() => document.body}
        title="业务域设置"
        visible={showListModal}
        onCancel={() => {
          setShowListModal(false);
          // 刷新业务域列表
          window.g_app._store.dispatch({
            type: 'common/getDomains',
          });
        }}
        footer={null}
      >
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => editItem({})}>
            <Icon type="plus" />
            新增业务域
          </Button>
        </div>
        <CustomTable
          size="small"
          rowKey="id"
          columns={[
            {
              title: '名称',
              dataIndex: 'name',
            },
            {
              title: '操作',
              width: 100,
              fixed: 'right',
              render: (text, record, index) => {
                return record.type === 0 ? (
                  '-'
                ) : (
                  <span>
                    <a onClick={() => editItem(record)}>编辑</a>
                    <Popconfirm
                      title="确定删除？"
                      onConfirm={() => deleteItem(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a
                        style={{
                          marginLeft: 8,
                          color: 'var(--FunctionNegative-500, #D24D40)',
                        }}
                      >
                        删除
                      </a>
                    </Popconfirm>
                  </span>
                );
              },
            },
          ]}
          dataSource={list}
          loading={tableLoding}
          pagination={{
            total,
            current: query.current + 1,
            pageSize: query.pageSize,
            onChange: (current, pageSize) => {
              setQuery({
                ...query,
                pageSize,
                current: current - 1,
              });
            },
          }}
        />
      </Modal>
    </>
  );
};
export default DomainManageModal;
