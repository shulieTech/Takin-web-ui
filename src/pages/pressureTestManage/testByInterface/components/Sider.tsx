import React, { useState, useEffect } from 'react';
import { Tooltip, Icon, message } from 'antd';
import ParamsDrawer from '../modals/Params';
import BaseDrawer from '../modals/Base';
import { router } from 'umi';

interface Props {
  detail: any;
}

const Sider = (props: Props) => {
  const { detail } = props;
  const [modalIndex, setModalIndex] = useState(null);
  const checkNew = (callback) => {
    if (!detail.id) {
      message.warn('请先保存场景');
    } else {
      callback();
    }
  };

  const icons = [
    {
      title: '参数编辑',
      icon: 'code',
      onClick: () => {
        checkNew(() => setModalIndex(0));
      },
    },
    {
      title: '基本信息设置',
      icon: 'control',
      onClick: () => {
        checkNew(() => setModalIndex(1));
      },
    },
    {
      title: '压测报告',
      icon: 'history',
      onClick: () => {
        checkNew(() =>
          router.push(
            `/pressureTestManage/pressureTestReport?sceneId=${detail.bindSceneId}`
          )
        );
      },
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
                onClick={item.onClick}
                id={item.icon === 'code' ? 'guide-4' : undefined}
              >
                <Icon type={item.icon} />
              </div>
            </Tooltip>
          );
        })}
      </div>
      {modalIndex === 0 && (
        <ParamsDrawer
          detail={detail}
          okCallback={() => setModalIndex(null)}
          cancelCallback={() => setModalIndex(null)}
        />
      )}
      {modalIndex === 1 && (
        <BaseDrawer
          detail={detail}
          okCallback={() => setModalIndex(null)}
          cancelCallback={() => setModalIndex(null)}
        />
      )}
    </>
  );
};

export default Sider;
