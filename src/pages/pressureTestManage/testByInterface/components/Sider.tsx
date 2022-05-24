import React, { useState, useEffect } from 'react';
import { Tooltip, Icon, message } from 'antd';
import ParamsModal from '../modals/Params';

interface Props {
  detail: any;
}

const Sider = (props: Props) => {
  const { detail } = props;
  const [modalIndex, setModalIndex] = useState(null);

  const icons = [
    {
      title: '参数编辑',
      icon: 'code',
    },
    {
      title: '基本信息设置',
      icon: 'control',
    },
    {
      title: '压测报告',
      icon: 'history',
    },
  ];
  return (
    <>
      <div
        style={{
          width: 50,
          textAlign: 'center',
          borderLeft: '1px solid #EEF0F2',
        }}
      >
        {icons.map((item, index) => {
          return (
            <Tooltip key={item.title} title={item.title} placement="left">
              <div
                style={{ lineHeight: '50px', cursor: 'pointer' }}
                onClick={() => {
                  // if (!detail?.id) {
                  //   message.warn('请先保存压测场景');
                  //   return;
                  // }
                  setModalIndex(index);
                }}
              >
                <Icon type={item.icon} />
              </div>
            </Tooltip>
          );
        })}
      </div>
      {modalIndex === 0 && (
        <ParamsModal
          detail={detail}
          okCallback={() => setModalIndex(null)}
          cancelCallback={() => setModalIndex(null)}
        />
      )}
    </>
  );
};

export default Sider;
