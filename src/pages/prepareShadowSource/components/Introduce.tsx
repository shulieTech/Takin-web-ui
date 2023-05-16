/* tslint:disable */
import React, { useState, useContext } from 'react';
import { Button, Tooltip, Row, Col, Icon } from 'antd';
import styles from '../index.less';
import classNames from 'classnames';
import { PrepareContext } from '../_layout';

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
            {
              icon: 'icon-a-ziyuanzhunbeishuoming01-01shulilianlu',
              text: (
                <>
                  梳理链路
                  <br />
                  与团队沟通，获得需压测链路的入口url，以及压测范围内的应用信息和节点总数
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming01-02jieruyingyong',
              text: (
                <>
                  接入应用
                  <br />
                  推进运维，使用正确的安装方式接入需要的应用
                </>
              ),
            },
          ],
        },
        {
          title: '创建链路',
          infos: [
            {
              icon: 'icon-a-ziyuanzhunbeishuoming02-01chuangjianlianlu',
              text: (
                <>
                  创建链路
                  <br />
                  手动创建链路(串联业务环节)、jmeter脚本扫描2种方式创建
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming02-02weihulianlu',
              text: (
                <>
                  维护链路
                  <br />
                  修改链路名称、入口url对应的业务环节名称
                </>
              ),
            },
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
            {
              icon: 'icon-a-ziyuanzhunbeishuoming03-01heduijiedianxinxi',
              text: (
                <>
                  核对节点信息
                  <br />
                  检查各应用节点数是否为预期要接入数量，检查已接入探针数是否符合预期
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming03-02jianchayingyongzhuangtai',
              text: (
                <>
                  检查应用状态
                  <br />
                  检查应用状态是否正常，可通过应用详情查看具体异常
                </>
              ),
            },
          ],
        },
        {
          title: '压测范围设置',
          infos: [
            {
              icon: 'icon-a-ziyuanzhunbeishuoming04-01chakanyingyongfanwei',
              text: (
                <>
                  查看应用范围
                  <br />
                  检查链路上的应用是否需要加入压测范围
                </>
              ),
            },
          ],
        },
      ],
    },
    {
      title: '隔离配置',
      cards: [
        {
          title: '选择隔离方式',
          infos: [
            {
              icon: 'icon-a-ziyuanzhunbeishuoming05-01goutongquerengelifangan',
              text: (
                <>
                  沟通确认隔离方案
                  <br />
                  与项目成员沟通一致的隔离配置方案，建议项目范围内使用一种隔离方案
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming05-02zaiTakinzhongshezhilianlugelifangan',
              text: (
                <>
                  在PTS中设置链路隔离方案
                  <br />
                  初始化链路需要进行链路隔离方案设置，设置后
                  PTS自动识别数据源信息和链接状态
                </>
              ),
            },
          ],
        },
        {
          title: '配置隔离方案',
          infos: [
            {
              icon: 'icon-a-ziyuanzhunbeishuoming06-01jianchashujuyuan',
              text: (
                <>
                  检查数据源
                  <br />
                  检查自动识别的数据源是否齐全，可手工新增
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming06-02xietongtuijin',
              text: (
                <>
                  协同推进
                  <br />
                  导出配置方案，并联系DBA协助完成隔离配置
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming06-03peizhiyingzishujuyuan',
              text: (
                <>
                  配置
                  <br />
                  DBA按照需求进行隔离配置
                </>
              ),
            },
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
            {
              icon: 'icon-a-ziyuanzhunbeishuoming07-01yingyongjiancha',
              text: (
                <>
                  应用检查
                  <br />
                  接入应用与预期接入数一致，加入压测范围的应用状态都正常
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming07-02yingziziyuanjiancha',
              text: (
                <>
                  影子资源检查
                  <br />
                  数据源配置信息完整，检查影子资源连通、配置生效
                </>
              ),
            },
          ],
        },
        {
          title: '开始下一环节',
          infos: [
            {
              icon: 'icon-a-ziyuanzhunbeishuoming08-01lianlutiaoshi',
              text: (
                <>
                  链路调试
                  <br />
                  链路压测资源准备完成后可以线进行调试，可以发现一些
                </>
              ),
            },
            {
              icon: 'icon-a-ziyuanzhunbeishuoming08-02yace',
              text: (
                <>
                  压测
                  <br />
                  调试完成后，在进行简单的压测配置，就可以进行压测啦
                </>
              ),
            },
          ],
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
          链路资源准备使用说明
        </div>
        <div
          style={{
            color: 'var(--Netural-600, #90959A)',
            padding: '16px 0',
            marginBottom: 24,
            paddingRight: 24,
          }}
        >
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
        <div
          style={{ marginBottom: 40, display: 'flex', alignItems: 'center' }}
        >
          {list.map((x, i, arr) => {
            return (
              <span key={x.title}>
                <Button
                  shape="round"
                  className={classNames(styles['round-btn'], {
                    [styles.active]: activeKey === i,
                  })}
                  style={{
                    color:
                      activeKey === i
                        ? 'var(--Netural-900, #303336)'
                        : 'inherit',
                  }}
                  onClick={() => setActiveKey(i)}
                >
                  <span
                    style={{
                      color: 'var(--Brandprimary-500, #0FBBD5)',
                      marginRight: 16,
                      fontWeight: 500,
                    }}
                  >
                    Step {i + 1}
                  </span>
                  <span>{x.title}</span>
                </Button>
                {i < arr.length - 1 && (
                  <Icon type="right" style={{ margin: '0 24px' }} />
                )}
              </span>
            );
          })}
        </div>

        <div>
          {list.map((x, i) => {
            return (
              activeKey === i && (
                <div
                  key={i}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {x.cards.map((y, j) => {
                    return (
                      <div
                        className={styles.card}
                        style={{ width: '48%' }}
                        key={`${i}-${j}`}
                      >
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
                                    'iconfont',
                                    z.icon
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
                                  {z.text}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};
