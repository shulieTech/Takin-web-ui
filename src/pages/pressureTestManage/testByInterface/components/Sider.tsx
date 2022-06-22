import React, { useState, useEffect, useContext } from 'react';
import { Tooltip, Icon, message, Modal } from 'antd';
import ParamsDrawer from '../modals/Params';
import BaseDrawer from '../modals/Base';
import { SenceContext } from '../indexPage';

interface Props {
  detail: any;
}

const Sider = (props: Props) => {
  const { detail } = props;
  const [modalIndex, setModalIndex] = useState(null);
  const {
    hasUnsaved,
    setHasUnsaved,
    listRefreshKey,
    setListRefreshKey,
    detailRefreshKey,
    editSaveKey,
    setEditSaveKey,
  } = useContext(SenceContext);

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
        checkNew(() => {
          if (hasUnsaved) {
            Modal.confirm({
              title: '提示',
              content: '您的场景有内容修改，是否先保存？',
              onOk: async () => {
                // 保存后才能进参数编辑，不然进参数编辑会刷新详情，导致未保存的数据丢失
                setEditSaveKey(editSaveKey + 1);
                setModalIndex(0);
              },
            });
          } else {
            setModalIndex(0);
          }
        });
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
          window.open(
            `#/pressureTestManage/pressureTestReport?sceneId=${detail.bindSceneId}`
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
                id={item.icon === 'code' ? 'guide-3' : undefined}
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
