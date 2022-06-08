import React, { useState, useEffect, useContext } from 'react';
import {
  Dropdown,
  Input,
  Icon,
  Spin,
  Menu,
  Modal,
  message,
  Pagination,
} from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import styles from '../index.less';
import classNames from 'classnames';
import { router } from 'umi';
import { SenceContext } from '../indexPage';

interface Props {
  currentSence: any;
  setCurrentSence: (sence: any) => void;
}

const SenceList: React.FC<Props> = (props) => {
  const { currentSence, setCurrentSence } = props;
  const {
    hasUnsaved,
    setHasUnsaved,
    listRefreshKey,
    editSaveKey,
    setEditSaveKey,
  } = useContext(SenceContext);
  const { list, loading, total, query, getList } = useListService({
    service: service.getSenceList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
    // isQueryOnQueryChange: false,
  });

  const checkSave = (callback) => {
    if (hasUnsaved) {
      Modal.confirm({
        title: '提示',
        content: '您的场景有内容修改，切换场景将清空修改内容，是否保存场景？',
        okText: '保存场景',
        onOk: async () => {
          // 保存场景
          setEditSaveKey(editSaveKey + 1);
        },
        onCancel: () => {
          callback();
          setHasUnsaved(false);
        },
      });
    } else {
      callback();
    }
  };

  const toLive = (sence, event) => {
    event.stopPropagation();
    checkSave(() => {
      router.push(
        `/pressureTestManage/pressureTestReport/pressureTestLive?id=${sence.bindSceneId}`
      );
    });
  };

  const deleteSence = async (sence, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: '提示',
      content: '确认删除？',
      onOk: async () => {
        const {
          data: { success },
        } = await service.deleteSence({ id: sence.id });
        if (success) {
          message.success('操作成功');
          getList({ current: 0 });
          if (sence.id === currentSence.id) {
            setCurrentSence(null);
          }
        }
      },
    });
  };

  useEffect(() => {
    if (listRefreshKey) {
      getList();
    }
  }, [listRefreshKey]);

  useEffect(() => {
    // 有定时压测或者非待启动压测时启用定时刷新
    const needRefresh = list.some(
      (x) => x.isScheduler || x.pressureStatus !== 0
    );
    if (needRefresh) {
      const refreshTimer = setInterval(() => {
        getList();
      }, 10000);
      return () => clearInterval(refreshTimer);
    }
  }, [JSON.stringify(list)]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
        <Input.Search
          style={{ flex: 1 }}
          placeholder="请输入"
          onSearch={(val) =>
            getList({
              queryName: val?.trim(),
            })
          }
        />
        <Icon
          type="plus"
          className="pointer"
          style={{ marginLeft: 16, marginRight: 8 }}
          onClick={() => checkSave(() => setCurrentSence({}))}
        />
      </div>
      <div>
        <Spin spinning={loading}>
          {total === 0 && !query.queryName && (
            <div
              style={{
                textAlign: 'center',
                padding: '70px 40px',
                lineHeight: '24px',
                color: 'var(--Netural-800, ##5A5E62)',
              }}
            >
              当前场景列表还是空的哦，试着创建一个单接口压测场景吧
            </div>
          )}
          {list.map((x) => {
            return (
              <div
                key={x.id}
                className={classNames(styles['sence-item'], {
                  [styles.active]: x.id === parseInt(currentSence?.id, 10),
                })}
                onClick={() => {
                  checkSave(() => {
                    setCurrentSence(x);
                  });
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {x.pressureStatus === 2 && (
                    <Icon
                      type="play-circle"
                      theme="filled"
                      style={{ marginRight: 8, color: '#11BBD5' }}
                    />
                  )}
                  <span
                    style={{
                      color: 'var(--Netural-850, #414548)',
                      fontWeight: 500,
                      marginRight: 12,
                    }}
                  >
                    {x.httpMethod}
                  </span>
                  <span style={{ flex: 1 }} className="truncate" title={x.name}>
                    {x.name}
                  </span>
                  <Dropdown
                    overlay={
                      <Menu style={{ width: 140 }}>
                        {x.pressureStatus === 2 && (
                          <Menu.Item
                            onClick={({ domEvent }) => toLive(x, domEvent)}
                          >
                            查看实况
                          </Menu.Item>
                        )}
                        <Menu.Item
                          style={{ color: 'red' }}
                          onClick={({ domEvent }) => deleteSence(x, domEvent)}
                        >
                          删除
                        </Menu.Item>
                      </Menu>}
                  >
                    <Icon type="more" className={styles['icon-more']} />
                  </Dropdown>
                </div>
                <div
                  className="truncate"
                  style={{
                    color: 'var(--Netural-600, #90959A)',
                  }}
                >
                  {x.requestUrl}
                </div>
              </div>
            );
          })}
          <Pagination
            style={{
              padding: 16,
              textAlign: 'center',
            }}
            simple
            hideOnSinglePage
            size="small"
            total={total}
            pageSize={query.pageSize}
            current={query.current + 1}
            onChange={(page, pageSize) => {
              getList({ pageSize, current: page - 1 });
            }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default SenceList;
