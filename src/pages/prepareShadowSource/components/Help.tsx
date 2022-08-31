import React, { useState } from 'react';
import { Modal, Tooltip, Icon, Divider } from 'antd';
import Introduce from './Introduce';

export default (props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div
      style={{
        padding: '8px 32px',
        borderTop: '1px solid #F7F8FA',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1 }}>
        <Tooltip title="222">
          <Icon
            type="info-circle"
            style={{ marginLeft: 8, cursor: 'pointer' }}
          />
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
        <Modal
          title="「 链路资源准备 」如何使用？"
          width={1082}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <Introduce showAddBtn={false} />
        </Modal>
        <Divider type="vertical" style={{ height: 24, margin: '0 36px' }} />

        <span>
          识别应用：<b>24</b>
        </span>
        <span style={{ marginLeft: 32 }}>
          正常： <b>24</b>
        </span>
      </div>
      <div>
        <span>检测时间：3 分钟前</span>
        <span style={{ marginLeft: 40 }}>负责人：朱七七</span>
      </div>
    </div>
  );
};
