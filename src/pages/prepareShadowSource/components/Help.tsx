import React, { useState, useContext, useEffect } from 'react';
import { Modal, Tooltip, Icon, Divider } from 'antd';
import Introduce from './Introduce';
import { PrepareContext } from '../_layout';
import moment from 'moment';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const { helpInfo = {} } = prepareState;
  const [showModal, setShowModal] = useState(false);
  const [fromNowStr, setFromNowStr] = useState('-');

  useEffect(() => {
    // 更新检测时间显示
    if (helpInfo?.checkTime) {
      const refreshTimeText = () => {
        setFromNowStr(moment(helpInfo?.checkTime).fromNow());
      };
      refreshTimeText();
      const timer = setInterval(refreshTimeText, 10000);
      return () => {
        clearInterval(timer);
        setFromNowStr('-');
      };
    }
  }, [helpInfo?.checkTime]);

  if (!helpInfo.show) {
    return null;
  }
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
        <Tooltip title="">
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
        {helpInfo?.text || '暂无数据'}
        {/* <span>
          识别应用：<b>24</b>
        </span>
        <span style={{ marginLeft: 32 }}>
          正常： <b>24</b>
        </span> */}
      </div>
      <div>
        <span>
          检测时间：
          {fromNowStr}
        </span>
        <span style={{ marginLeft: 40 }}>
          负责人：{helpInfo?.userName || '-'}
        </span>
      </div>
    </div>
  );
};
