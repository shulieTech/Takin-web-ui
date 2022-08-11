import React, { useState, useRef } from 'react';
import { message, Modal, Input } from 'antd';
import service from '../service';
import ServiceCustomTable from 'src/components/service-custom-table';

interface Props {
  machine: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

const DeployToBenchmark: React.FC<Props> = (props) => {
  const { machine, okCallback, cancelCallback, ...rest } = props;
  const [selectedSuites, setSelectedSuites] = useState(undefined);
  const tableRef = useRef();

  const columns = [
    {
      title: '支持组件',
      dataIndex: 'machineName',
    },
    {
      title: '适合产品',
      dataIndex: '',
    },
  ];

  const handleSubmit = async () => {
    if (selectedSuites) {
      message.warn('请选择组件');
      return;
    }
    const {
      data: { success },
    } = await service.deployToBenchmark({
      selectedSuites,
      machineId: machine.id,
    });
    if (success) {
      message.success('操作成功');
      // TODO 显示进度
      okCallback();
    }
  };

  return (
    <Modal
      title="一键部署到benchmark"
      visible={!!machine}
      onOk={handleSubmit}
      onCancel={cancelCallback}
      destroyOnClose
      width={640}
      bodyStyle={{
        minHeight: 320,
        maxHeight: '80vh',
        overflow: 'auto',
      }}
      {...rest}
    >
      <div style={{ marginBottom: 16 }}>
        请提前确认xx以上环境，如果不符合环境要求，部署不成功
      </div>
      <div>
        <Input.Search
          onSearch={(val) =>
            tableRef?.current?.getList({
              current: 0,
              suite: val,
            })
          }
          placeholder="搜索名称"
          style={{
            width: 240,
            marginBottom: 8,
          }}
        />
      </div>
      <ServiceCustomTable
        ref={tableRef}
        size="small"
        rowKey="id"
        service={service.suiteList}
        columns={columns}
        rowSelection={{
          type: 'radio',
          onChange: (selectKeys, selectRows) => {
            setSelectedSuites(selectKeys);
          },
        }}
      />
    </Modal>
  );
};

export default DeployToBenchmark;
