import { message, Modal, Table } from 'antd';
import React, { Fragment, useState } from 'react';
import service from '../service';
interface Props {
  btnText?: string;
  id?: any;
  onSuccess?: () => void;
  visible?: boolean;
  setVisible?: (value) => void;
  data?: any;
}

const TagDepolyModal: React.FC<Props> = props => {

  const [selectedKeys, setSelectedKeys] = useState([]);  

  const handleChangeKeys = (keys) => {
    setSelectedKeys(keys);
  };

  /**
   * @name 按照标签部署
   */
  const handleChange = async (tag) => {
    const {
      data: { data, success, error }
    } = await service.deployByTag({ tag });
    if (success) {
      message.success('部署成功');
      props.setVisible(false);
      props.onSuccess();
      return;
    }
  };

  const columns = [
    { 
      title: '标签',
      dataIndex: 'tag'
    }
  ];

  return (
    <Modal
      title={props?.btnText}
      width={560}
      visible={props.visible}
      onCancel={() => {
        props.setVisible(false);
        setSelectedKeys([]);
      }}
      onOk={() => handleChange(selectedKeys?.[0])}
    >
        <Fragment>
          <div style={{ marginTop: 12 }}>
          <Table
            key={'tag'}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedKeys,
              onChange: (selectedRowKeys) => { handleChangeKeys(selectedRowKeys); }
            }}
            
            pagination={false}
            columns={columns}
            dataSource={props?.data || []}
          />
          </div>
        </Fragment>
    </Modal>
  );
};
export default TagDepolyModal;
