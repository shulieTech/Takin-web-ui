/* tslint:disable */
import React, { useState, useContext } from 'react';
import { Button, Tooltip, Row, Col } from 'antd';
import styles from '../index.less';
import classNames from 'classnames';
import { PrepareContext } from '../indexPage';

interface Props {
  showAddBtn?: boolean;
}

export default (props: Props) => {
  const { showAddBtn = true } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [activeKey, setActiveKey] = useState(0);

  const list = [
    {
      title: '链路创建',
      cards: [
        {
          title: '应用接入',
          infos: [
            <>
              确认所需压测应用范围
              <br />
              与团队沟通获得压测相关准确的应用范围
            </>,
            <>
              推进运维
              <br />
              使用正确的安装方式接入应用
            </>,
          ],
        },
        {
          title: '创建链路',
          infos: [
            <>
              选择创建方式
              <br />
              Takin提供手动串联接口和Jmeter两种方式
            </>,
            <>
              创建链路
              <br />
              可以通过添加Takin获得的入口进行链路串联，编辑成你想要的链路
            </>,
          ],
        },
      ],
    },
    {
      title: '应用检查',
      cards: [
        {
          title: '应用接入',
          infos: [
            <>
              确认所需压测应用范围
              <br />
              与团队沟通获得压测相关准确的应用范围
            </>,
            <>
              推进运维
              <br />
              使用正确的安装方式接入应用
            </>,
          ],
        },
        {
          title: '创建链路',
          infos: [
            <>
              选择创建方式
              <br />
              Takin提供手动串联接口和Jmeter两种方式
            </>,
            <>
              创建链路
              <br />
              可以通过添加Takin获得的入口进行链路串联，编辑成你想要的链路
            </>,
          ],
        },
      ],
    },
    {
      title: '隔离配置',
      cards: [
        {
          title: '设置隔离方式',
          infos: [<>-</>, <>-</>],
        },
        {
          title: '修改隔离数据',
          infos: [<>-</>, <>-</>],
        },
      ],
    },
    {
      title: '完成准备',
      cards: [
        {
          title: '开始压测',
          infos: [<>-</>, <>-</>],
        },
      ],
    },
  ];
  return (
    <div style={{ padding: 32 }}>
      <div className={styles.banner}>
        <div
          style={{
            fontSize: 20,
            color: 'var(--Netural-990, #25282A)',
            fontWeight: 600,
          }}
        >
          链路资源准备
        </div>
        <div
          style={{
            color: 'var(--Netural-600, #90959A)',
            padding: '16px 0',
            marginBottom: 24,
            paddingRight: 24,
          }}
        >
          无需Jmeter
          <span className={styles.divider} />
          无需手动梳理隔离数据
          <span className={styles.divider} />
          数据变更后也能精准识别
          <span className={styles.divider} />
          整体效率提升50%
        </div>
        {showAddBtn && (
          <div>
            <Button
              type="primary"
              onClick={() => setPrepareState({ currentLink: {} })}
            >
              创建链路
            </Button>
          </div>
        )}
      </div>

      <div>
        <div style={{ marginBottom: 40 }}>
          {list.map((x, i) => {
            return (
              <Button
                key={x.title}
                shape="round"
                className={classNames(styles['round-btn'], {
                  [styles.active]: activeKey === i,
                })}
                style={{
                  marginRight: 64,
                }}
                onClick={() => setActiveKey(i)}
              >
                {x.title}
              </Button>
            );
          })}
        </div>

        <div>
          {list.map((x, i) => {
            return (
              activeKey === i && (
                <Row gutter={40} key={i}>
                  {x.cards.map((y, j) => {
                    return (
                      <Col span={12} key={`${i}-${j}`}>
                        <div className={styles.card}>
                          <span className={styles.order}>{j + 1}</span>
                          <div className={styles.title}>{y.title}</div>
                          <div style={{ marginTop: 40 }}>
                            {y.infos.map((z, m) => {
                              return (
                                <div
                                  key={`${i}-${j}-${m}`}
                                  style={{ display: 'flex' }}
                                >
                                  <span
                                    className={classNames(
                                      styles.icon,
                                      'iconfont '
                                    )}
                                  />
                                  <div
                                    style={{
                                      flex: 1,
                                      padding: 16,
                                      borderTop: '1px solid #F7F8FA',
                                      lineHeight: '28px',
                                    }}
                                  >
                                    {z}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};
