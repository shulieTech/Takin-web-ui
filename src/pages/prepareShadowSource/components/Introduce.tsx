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
  const { currentLink, setCurrentLink } = useContext(PrepareContext);
  const [activeKey, setActiveKey] = useState(0);
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
            <Button type="primary" onClick={() => setCurrentLink({})}>
              创建链路
            </Button>
          </div>
        )}
      </div>

      <div>
        <div style={{ marginBottom: 40 }}>
          <Button
            shape="round"
            className={classNames(styles['round-btn'], {
              [styles.active]: activeKey === 0,
            })}
            style={{
              marginRight: 64,
            }}
            onClick={() => setActiveKey(0)}
          >
            链路创建
          </Button>
          <Button
            shape="round"
            className={classNames(styles['round-btn'], {
              [styles.active]: activeKey === 1,
            })}
            style={{
              marginRight: 64,
            }}
            onClick={() => setActiveKey(1)}
          >
            应用检测
          </Button>
          <Button
            shape="round"
            className={classNames(styles['round-btn'], {
              [styles.active]: activeKey === 2,
            })}
            style={{
              marginRight: 64,
            }}
            onClick={() => setActiveKey(2)}
          >
            隔离配置
          </Button>
          <Button
            shape="round"
            className={classNames(styles['round-btn'], {
              [styles.active]: activeKey === 3,
            })}
            style={{
              marginRight: 64,
            }}
            onClick={() => setActiveKey(3)}
          >
            完成准备
          </Button>
        </div>

        <div>
          <Row gutter={40}>
            <Col span={12}>
              <div className={styles.card}>
                <span className={styles.order}>1</span>
                <div className={styles.title}>应用接入</div>
                <Button
                  shape="round"
                  className={styles['round-btn']}
                  style={{ fontSize: 13 }}
                >
                  确认所需压测应用范围
                </Button>
                <div style={{ marginTop: 32 }}>
                  <div style={{ marginBottom: 24 }}>
                    与团队沟通获得压测相关准确的应用范围
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span className={classNames(styles.icon, 'iconfont ')} />
                    <div
                      style={{
                        flex: 1,
                        padding: 16,
                        borderTop: '1px solid #F7F8FA',
                        borderBottom: '1px solid #F7F8FA',
                        lineHeight: '28px',
                      }}
                    >
                      推进运维
                      <br />
                      使用正确的安装方式接入应用
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div className={styles.card}>
                <span className={styles.order}>2</span>
                <div className={styles.title}>创建链路</div>
                <div style={{ marginTop: 40 }}>
                  <div style={{ display: 'flex' }}>
                    <span className={classNames(styles.icon, 'iconfont ')} />
                    <div
                      style={{
                        flex: 1,
                        padding: 16,
                        borderTop: '1px solid #F7F8FA',
                        lineHeight: '28px',
                      }}
                    >
                      选择创建方式
                      <br />
                      Takin提供手动串联接口和Jmeter两种方式
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span className={classNames(styles.icon, 'iconfont ')} />
                    <div
                      style={{
                        flex: 1,
                        padding: 16,
                        borderTop: '1px solid #F7F8FA',
                        borderBottom: '1px solid #F7F8FA',
                        lineHeight: '28px',
                      }}
                    >
                      创建链路
                      <br />
                      可以通过添加Takin获得的入口进行链路串联，编辑成你想要的链路
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
