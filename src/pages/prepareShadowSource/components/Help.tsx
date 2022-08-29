import React, { useState } from 'react';
import { Modal, Tooltip, Icon, Divider } from 'antd';
import Introduce from './Introduce';

export default (props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Tooltip title="222">
        <Icon type="info-circle" style={{ marginLeft: 8, cursor: 'pointer' }} />
      </Tooltip>
      <span
        style={{
          textDecorationLine: 'underline',
          cursor: 'pointer',
        }}
        onClick={() => setShowModal(true)}
      >
        「 链路资源准备 」如何使用？
      </span>
      <Divider type="vertical" style={{ height: 24, margin: '0 36px' }} />
      <Modal
        title="「 链路资源准备 」如何使用？"
        width={1082}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Introduce showAddBtn={false} />
      </Modal>
    </>
  );
};
