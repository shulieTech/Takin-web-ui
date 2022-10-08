import React, { useState, useEffect, useContext } from 'react';
import { Modal, Icon, Tag } from 'antd';
import styles from '../index.less';
import classNames from 'classnames';
import img1 from 'src/assets/link-type-0.png';
import img2 from 'src/assets/link-type-1.png';
import { PrepareContext } from '../_layout';

interface SelectTypeModalProps {
  detail: any;
  cancelCallback: () => void;
}
export default (props: SelectTypeModalProps) => {
  const { detail, cancelCallback } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [showTypeSelectModal, setShowTypeSelectModal] = useState<boolean>(
    detail && !detail.id
  );
  const [selectType, setSelectType] = useState(0);

  useEffect(() => {
    setShowTypeSelectModal(detail && !detail.id);
  }, [detail]);

  return (
    <>
      <Modal
        title="新建链路"
        width={734}
        visible={showTypeSelectModal}
        onCancel={() => {
          cancelCallback();
          setShowTypeSelectModal(false);
        }}
        onOk={() => {
          setShowTypeSelectModal(false);
          setPrepareState({
            editLink: detail,
          });
        }}
      >
        <div
          style={{
            color: 'var(--Netural-850, #414548)',
            fontSize: 16,
            marginBottom: 16,
          }}
        >
          选择链路新建方式
        </div>
        <div>
          <div
            className={classNames(styles['card-checkbox'], {
              [styles.checked]: selectType === 0,
            })}
            style={{ cursor: 'pointer', marginBottom: 16 }}
            onClick={() => setSelectType(0)}
          >
            <Icon
              type="check-square"
              theme="filled"
              className={styles['icon-checked']}
            />
            <div
              style={{ display: 'flex', color: 'var(--Netural-600, #90959A)' }}
            >
              <img
                src={img1}
                style={{ width: 80, height: 80, marginRight: 48 }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    color: 'var(--Netural-850, #414548)',
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  手工创建
                </div>
                <div
                  style={{
                    marginBottom: 24,
                    lineHeight: '24px',
                  }}
                >
                  接入应用后，Takin会自动获取接口数据，您可以通过手工串联入口的方式进行链路创建。
                </div>
                <div>
                  适用于
                  <Tag style={{ margin: '0 16px 0 24px' }}>
                    无现成Jmeter脚本
                  </Tag>
                  <Tag>Takin压测方式</Tag>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(styles['card-checkbox'], {
              [styles.checked]: selectType === 1,
            })}
            style={{ cursor: 'not-allowed' }}
            // onClick={() => setSelectType(1)}
          >
            <Icon
              type="check-square"
              theme="filled"
              className={styles['icon-checked']}
            />
            <div style={{ display: 'flex' }}>
              <img
                src={img2}
                style={{ width: 80, height: 80, marginRight: 48 }}
              />
              <div style={{ flex: 1, color: 'var(--Netural-600, #90959A)' }}>
                <div
                  style={{
                    fontSize: 16,
                    color: 'var(--Netural-850, #414548)',
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Jemeter扫描
                </div>
                <div
                  style={{
                    marginBottom: 24,

                    lineHeight: '24px',
                  }}
                >
                  已有jmeter脚本可以使用此种模式新建，Takin会自动匹配接口 <br />
                  <span style={{ color: '#FFA73B' }}>本期暂无，敬请期待</span>
                </div>
                <div>
                  适用于
                  <Tag style={{ margin: '0 16px 0 24px' }}>已有Jmeter脚本</Tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
