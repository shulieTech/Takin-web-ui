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
          title: '链路梳理',
          infos: [
            <>
              梳理链路
              <br />
              先梳理压测链路，将链路的入口url梳理出来
            </>,
            <>
              接应用
              <br />
              开始接入链路涉及的应用
            </>,
          ],
        },
        {
          title: '创建链路',
          infos: [
            <>
              创建链路
              <br />
              手动创建链路(串联业务环节)、jmeter脚本扫描2种方式创建
            </>,
            <>
              维护链路
              <br />
              修改链路名称、入口url对应的业务环节名称
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
              接入应用
              <br />
              检查链路上的应用是否都已接入
            </>,
            <>
              节点信息
              <br />
              检查节点数是否为预期要接入数量，检查已接入探针数是否符合预期
            </>,
            <>
              应用状态
              <br />
              检查应用状态是否正常
            </>,
          ],
        },
        {
          title: '压测范围设置',
          infos: [
            <>
              查看应用范围
              <br />
              检查链路上的应用是否需要加入压测范围
            </>,
          ],
        },
      ],
    },
    {
      title: '隔离配置',
      cards: [
        {
          title: '选择隔离方案',
          infos: [
            <>
              隔离方案
              <br />
              影子库、影子表、影子库/表3种方案
            </>,
          ],
        },
        {
          title: '配置隔离方案',
          infos: [
            <>
              检查数据源
              <br />
              检查自动识别的数据源是否齐全，可手工新增
            </>,
            <>
              协同推进
              <br />
              导出配置方案，并联系DBA协助完成隔离配置
            </>,
            <>
              配置
              <br />
              DBA按照需求进行隔离配置
            </>,
          ],
        },
      ],
    },
    {
      title: '完成准备',
      cards: [
        {
          title: '配置准备检查',
          infos: [
            <>
              应用检查
              <br />
              接入应用与预期接入数一致，加入压测范围的应用状态都正常
            </>,
            <>
              影子资源检查
              <br />
              数据源配置信息完整，检查影子资源连通、配置生效
            </>,
          ],
        },
        {
          title: '开始下一环节',
          infos: [<>链路全部检查完成后，便可进入链路调试或开始压测</>],
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
