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

  const icons = [
    {
      title: '参数编辑',
      icon: 'code',
      onClick: () => setModalIndex(0),
    },
    {
      title: '基本信息设置',
      icon: 'control',
      onClick: () => setModalIndex(1),
    },
    {
      title: '压测报告',
      icon: 'history',
      onClick: () => {
        router.push(
          `/pressureTestManage/pressureTestReport?sceneId=${detail.id}`
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
