import React, { useState, useRef } from 'react';
import { message, Modal, Input, Alert, Tooltip } from 'antd';
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
      dataIndex: 'suite',
    },
    {
      title: '适用产品',
      dataIndex: 'suiteDescribe',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <div
              style={{
                whiteSpace: 'nowrap',
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {text || '-'}
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    if (!(Array.isArray(selectedSuites) && selectedSuites.length > 0)) {
      message.warn('请选择命令');
      return;
    }
    const {
      data: { success },
    } = await service.deployToBenchmark({
      benchmarkSuiteId: selectedSuites[0]?.id,
      benchmarkSuiteName: selectedSuites[0]?.suite,
      id: machine.id,
    });
    if (success) {
      message.success('操作成功');
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
      <Alert
        style={{ marginBottom: 16 }}
        showIcon
        type="info"
        message={
          <span>
            请确认系统环境为centos7.6+，否则存在部署失败的风险！
            <br />
            部署时系统会自动上传组件docker镜像至对应服务器，请耐心等待。
          </span>
        }
      />
      <div>
        <Input.Search
          onSearch={(val) =>
            tableRef?.current?.getList({
              current: 0,
              suite: val,
            })
          }
          placeholder="搜索组件名称"
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
            setSelectedSuites(selectRows);
          },
        }}
      />
    </Modal>
  );
};

export default DeployToBenchmark;
