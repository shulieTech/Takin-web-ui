import { scale } from '@antv/g6/lib/util/math';
import { Col, Progress, Row, Tooltip } from 'antd';
import moment from 'moment';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import E2EBigScreenService from './service';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

interface Props { }
const getInitState = () => ({
  tabKey: null,
  time: moment().format('YYYY年MM月DD日 HH:mm:ss'),
  showData: null,
  tabs: null,
  chianWrapDatas: null,
  currentTop: 0
});

export type E2EBigScreenState = ReturnType<typeof getInitState>;
const E2EBigScreen: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<E2EBigScreenState>(getInitState());
  const itemContainerRef = useRef(null);
  const [itemsNumInOneLine, setItemsNumInOneLine] = useState(7); // 每行最多的数目
  const FLOW_ITEM_WIDTH = 174;
  const [aniIndex, setAniIndex] = useState(0);
  const aniTime = 1500;
  const mainRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setState({
        time: moment().format('YYYY年MM月DD日 HH:mm:ss')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getItemsNumInOneLine = () => {
      if (itemContainerRef.current) {
        const containerWidth = (itemContainerRef.current as HTMLElement).getBoundingClientRect()
          .width;
        const _containerWidth = containerWidth * 0.91 - 40;
        const _size = Math.floor(_containerWidth / FLOW_ITEM_WIDTH);
        setItemsNumInOneLine(_size);
      }
    };
    getItemsNumInOneLine();
    window.addEventListener('resize', getItemsNumInOneLine);
    return () => window.removeEventListener('resize', getItemsNumInOneLine);
  }, []);

  useEffect(() => {
    const tikcer = setInterval(() => {
      setAniIndex(aniIndex + 1);
    }, aniTime);
    return () => {
      if (tikcer) {
        clearInterval(tikcer);
      }
    };
  }, [aniIndex]);

  useEffect(() => {
    queryTotalNums();
    queryBoardDatas();
    // autoScrollTop();
    if (state.tabKey) {
      queryBoardDetail(state.tabKey);
    }
    const timer2 = setInterval(() => {
      queryTotalNums();
      queryBoardDatas();
      if (state.tabKey) {
        queryBoardDetail(state.tabKey);
      }
    }, 5000);
    return () => clearInterval(timer2);
  }, [state.tabKey]);

  const autoScrollTop = () => {
    // tslint:disable-next-line:no-unused-expression
    const chainWrapDom = document.getElementById('chainWrap');
    if (chainWrapDom) {
      if (
        chainWrapDom.scrollHeight -
        chainWrapDom.offsetHeight -
        state.currentTop >
        0
      ) {
        const newCurrentTop = state.currentTop + 290;
        chainWrapDom.scrollTo({
          top: newCurrentTop,
          behavior: 'smooth'
        });
        setState({ currentTop: newCurrentTop });
      } else if ((state.tabs || []).length > 0) {
        // 切换tab
        const currentTabIndex = state.tabs.findIndex(
          x => x.patrolBoardId === state.tabKey
        );
        const nextTabIndex =
          currentTabIndex + 1 >= state.tabs.length ? 0 : currentTabIndex + 1;
        handleChangeTab(state.tabs[nextTabIndex].patrolBoardId);
        chainWrapDom.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setState({ currentTop: 0 });
      } else {
        chainWrapDom.scrollTo({
          top: state.currentTop,
          behavior: 'smooth'
        });
        setState({ currentTop: 0 });
      }
    }
  };

  useEffect(() => {
    let timer3 = setInterval(() => {
      autoScrollTop();
    }, 5000);
    let timer4;
    const pauseScroll = () => {
      clearInterval(timer3);
      clearTimeout(timer4);
      timer4 = setTimeout(() => {
        timer3 = setInterval(() => {
          autoScrollTop();
        }, 5000);
      });
    };
    // 有用户操作时，暂停滚动，并在5s后重新开始
    const userEvents = ['mousedown', 'mousemove', 'mousewheel'];
    userEvents.forEach(x => {
      window.addEventListener(x, pauseScroll);
    });
    return () => {
      userEvents.forEach(x => {
        window.removeEventListener(x, pauseScroll);
      });
      clearInterval(timer3);
      clearTimeout(timer4);
    };
  }, [state.currentTop, state?.tabs?.length]);

  const transformArr = (baseArray, n) => {
    const len = baseArray.length;
    // const n = 7; // 假设每行显示n个
    const lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
    const res = [];
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < lineNum; i++) {
      // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
      const temp = baseArray.slice(i * n, i * n + n);
      res.push({ key: i, value: temp });
    }
    return res;
  };

  /**
   * @name 切换tab
   */
  const handleChangeTab = async k => {
    state.tabKey = k;
    setState({
      tabKey: k
    });
  };

  /**
   * @name 获取所有汇总数据
   */
  const queryTotalNums = async () => {
    const {
      data: { data, success }
    } = await E2EBigScreenService.queryTotalNums({});
    if (success) {
      setState({
        showData: [
          {
            title: '严重瓶颈',
            value: data && data.seriousBottleneck,
            suffix: '个',
            // color: 'linear-gradient(360deg, #FF0000 0%, #FFFFFF 100%)'
            color: '#FF0000'
          },
          {
            title: '一般瓶颈',
            value: data && data.slightBottleneck,
            suffix: '个',
            // color: 'linear-gradient(360deg, #FF8A01 0%, #FFFFFF 100%)'
            color: '#FF8A01'
          },
          {
            title: '正常业务',
            value: data && data.normalBusiness,
            suffix: '个',
            // color: 'linear-gradient(360deg, #00CFCD 0%, #FFFFFF 100%)'
            color: '#00CFCD'
          },
          {
            title: '实际业务请求',
            value: data && data.totalBusinessRequest,
            suffix: '个',
            // color: 'linear-gradient(360deg, #00CFCD 0%, #FFFFFF 100%)'
            color: '#00CFCD'
          },
          {
            title: '巡检业务请求',
            value: data && data.totalPatrolRequest,
            suffix: '个',
            // color: 'linear-gradient(360deg, #00CFCD 0%, #FFFFFF 100%)'
            color: '#00CFCD'
          }
        ]
      });
    }
  };

  /**
   * @name 获取看板数据
   */
  const queryBoardDatas = async () => {
    const {
      status,
      data: { data, success }
    } = await E2EBigScreenService.queryBoardDatas({});
    if (status === 401) {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        document?.exitFullscreen?.();
        document?.webkitExitFullscreen?.();
      }
    }
    if (success) {
      if (!state.tabKey) {
        setState({
          tabs: data,
          tabKey: data && data[0] && data[0].patrolBoardId
        });
        return;
      }
      setState({
        tabs: data
      });
    }
  };

  /**
   * @name 获取看板详情
   */
  const queryBoardDetail = async patrolBoardId => {
    const {
      data: { data, success }
    } = await E2EBigScreenService.queryBoardDetail({ patrolBoardId });
    if (success) {
      setState({
        chianWrapDatas: data
      });
    }
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      document?.exitFullscreen?.();
      document?.webkitExitFullscreen?.();
    } else {
      mainRef?.current?.requestFullScreen?.();
      mainRef?.current?.webkitRequestFullScreen?.();
    }

  };

  return (
    <div
      style={{
        height: '100%',
        background: '#001D38',
        width: '100%',
        overflow: 'hidden'
      }}
      onDoubleClick={toggleFullScreen}
      ref={mainRef}
    >
      <div className={styles.header}>
        <img
          style={{ width: '100%', height: '100%' }}
          src={require('./../../assets/e2e_header.png')}
          alt="img"
        />
        <div className={styles.headerLeft}>
          <span>实时</span>
          <span>准确</span>
          <span>高覆盖</span>
        </div>
        <div className={styles.headerRight}>
          <span className="font-digtal">{state.time}</span>
          <span className="font-digtal">每30秒取一次平均值</span>
        </div>
      </div>
      <div className={styles.showBar}>
        <img
          style={{ position: 'absolute', width: '77px', left: 0, top: 0 }}
          src={require('./../../assets/e2e_bar_left_bg.png')}
          alt="img"
        />
        <img
          style={{ position: 'absolute', width: '77px', right: 0, bottom: 0 }}
          src={require('./../../assets/e2e_bar_right_bg.png')}
          alt="img"
        />
        {state.showData &&
          state.showData.map((item, k) => {
            return (
              <div
                key={k}
                className={styles.showBarItem}
                style={{ width: k === 3 ? '25%' : k === 4 ? '25%' : null }}
              >
                <span className={styles.showBarTitle}>{item.title}</span>
                <span
                  className={`${styles.numberStyle} font-digtal`}
                  style={{
                    lineHeight: '42px',
                    background: item.color,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {/* <Statistic value={item.value} /> */}
                  {item.value}
                </span>
                <span style={{ fontSize: '16px' }}>{item.suffix}</span>
                {k !== state.showData.length - 1 && (
                  <span className={styles.diverBg} />
                )}
              </div>
            );
          })}
      </div>
      <div className={styles.contentWrap}>
        <div>
          {state.tabs &&
            state.tabs.map((item, k) => {
              return (
                <div
                  key={k}
                  className={styles.tabItem}
                  onClick={() => handleChangeTab(item.patrolBoardId)}
                >
                  <img
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 191
                    }}
                    src={require(`./../../assets/${state.tabKey === item.patrolBoardId
                      ? 'e2e_tab_bg_selected'
                      : 'e2e_tab_bg'
                      }.png`)}
                    alt="img"
                  />
                  <div className={styles.tabContent}>
                    <span style={{ marginRight: 8 }}>
                      {item.patrolBoardName}
                    </span>
                    <span style={{ color: '#FF1818' }}>
                      {item.seriousBottleneck}
                    </span>
                    <span> / </span>
                    <span style={{ color: '#FF9315' }}>
                      {item.slightBottleneck}
                    </span>
                    <span> / </span>
                    <span style={{ color: '#1AD4D2' }}>
                      {item.normalBusiness}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <div className={styles.chainWrap} id="chainWrap" ref={itemContainerRef}>
          {state.chianWrapDatas &&
            state.chianWrapDatas.map((item, k) => {
              return (
                <Row type="flex" key={k}>
                  <Col
                    span={2}
                    style={{
                      height: '100%',
                      position: 'relative'
                    }}
                  >
                    {transformArr(item.activityDetails, itemsNumInOneLine).map(
                      (item1, k1, arr1) => {
                        return (
                          <div key={k1} style={{ position: 'relative' }}>
                            <div
                              className={
                                k1 === arr1.length - 1 ? '' : styles.dottedLine
                              }
                            />
                            <div
                              className={styles.chainTitleWrap}
                              style={{ opacity: k1 === 0 ? 1 : 0.5 }}
                            >
                              <span>
                                {item.patrolSceneName}
                                {k1 === 0 && item.activityDetails && (
                                  <div>({item.activityDetails.length}个)</div>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </Col>
                  <Col span={22} style={{ position: 'relative' }}>
                    {/* <div className={styles.chainItemRight} /> */}
                    {transformArr(item.activityDetails, itemsNumInOneLine).map(
                      (item1, k1, arr1) => {
                        return (
                          <ul
                            key={k1}
                            style={{
                              display: 'flex',
                              margin: '10px 0 70px',
                              justifyContent: 'space-between',
                              flexDirection:
                                item1.key % 2 === 0 ? 'row' : 'row-reverse'
                            }}
                            className={classnames(
                              item1.key % 2 === 0
                                ? styles['flow-row-odd']
                                : styles['flow-row-even']
                            )}
                          >
                            {item1.value &&
                              item1.value.map((item2, k2, arr2) => {
                                const isEven = item1.key % 2 !== 0;
                                let flowDrectionClassName: string =
                                  styles['flow-right'];
                                switch (true) {
                                  case (k2 + 1) % itemsNumInOneLine === 0:
                                    flowDrectionClassName = 'flow-down';
                                    break;
                                  case isEven:
                                    flowDrectionClassName = 'flow-left';
                                    break;
                                  default:
                                    flowDrectionClassName = 'flow-right';
                                }
                                const nodeItem = (
                                  <div className={styles.chainItem}>
                                    {renderNode(
                                      item2,
                                      k2,
                                      item1.value.length,
                                      item1.key
                                    )}
                                  </div>
                                );
                                return (
                                  <li
                                    key={k2}
                                    className={classnames(
                                      styles['flow-item'],
                                      styles[flowDrectionClassName],
                                      {
                                        [styles['flow-last']]:
                                          k1 === arr1.length - 1 &&
                                          k2 === arr2.length - 1,
                                        [styles['flow-ani-running']]:
                                          aniIndex %
                                          item.activityDetails.length ===
                                          k1 * itemsNumInOneLine + k2
                                      }
                                    )}
                                  >
                                    {item2.chainId &&
                                      item2.errorLevel > 0 ? (
                                      <Link
                                        to={`/bottleneckTable/bottleneckDetails?chainId=${item2.chainId}`}
                                      >
                                        {nodeItem}
                                      </Link>
                                    ) : (
                                      nodeItem
                                    )}
                                  </li>
                                );
                              })}
                            {/* 补齐为itemsNumInOneLine的整数 */}
                            {item1.value &&
                              item1.value.length % itemsNumInOneLine !== 0 &&
                              Array.from({
                                length:
                                  itemsNumInOneLine -
                                  (item1.value.length % itemsNumInOneLine)
                              }).map((item2, k2) => {
                                return (
                                  <li
                                    key={k2}
                                    style={{ width: FLOW_ITEM_WIDTH }}
                                  />
                                );
                              })}
                          </ul>
                        );
                      }
                    )}
                  </Col>
                </Row>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default E2EBigScreen;

const renderNode = (item, k, len, lineNumber) => {
  const node = (
    <div style={{ position: 'relative' }}>
      <div
        className={classnames(styles.chainItemTop, {
          [styles['scan-bg-ani']]: item.errorLevel > 0
        })}
      >
        <img
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          src={require(`./../../assets/${item.errorLevel === 0
            ? 'e2e_chain_normal_bg'
            : item.errorLevel === 2
              ? 'e2e_chain_error_bg'
              : item.errorLevel === 1
                ? 'e2e_chain_warn_bg'
                : 'e2e_chain_config_bg'
            }.png`)}
          alt="img"
        />
        <div
          style={{
            textAlign: 'left',
            paddingLeft: 16,
            height: 28,
            position: 'relative',
            fontSize: '14px',
            top: 8,
            fontWeight: 500,
            color:
              item.errorLevel === 0
                ? '#0097a4'
                : item.errorLevel === 2
                  ? '#BF0505'
                  : item.errorLevel === 1
                    ? '#E58D13'
                    : 'rgba(255,255,255,0.5)'
          }}
        >
          {item.errorLevel !== 0 && (
            <span className={styles['breath-latern']} />
            // <img
            //   style={{
            //     width: 18,
            //     position: 'relative',
            //     top: -1,
            //     marginRight: 4
            //   }}
            //   src={require(`./../../assets/${
            //     item.errorLevel === 1
            //       ? 'e2e_chain_warn_icon'
            //       : item.errorLevel === 2
            //       ? 'e2e_chain_error_icon'
            //       : 'e2e_chain_config_icon'
            //   }.png`)}
            //   alt="img"
            // />
          )}
          {item.errorLevel !== 0 &&
            item.errorInfos &&
            item.errorInfos[0] &&
            item.errorInfos[0].errorType}
        </div>
        <Row type="flex" style={{ padding: '10px 12px' }}>
          <Col style={{ position: 'relative' }}>
            <div className={styles.progress}>
              <Progress
                type="circle"
                percent={parseFloat(item.successRate) || 0}
                width={45}
                trailColor={{
                  0: 'rgba(0, 151, 164, .5)',
                  1: 'rgba(229, 113, 19, .5)',
                  2: 'rgba(191, 5, 5, .4)'
                }[item.errorLevel]}
                strokeWidth={8}
                strokeColor={{
                  0: '#0097a4',
                  1: '#E58D13',
                  2: '#BF0505'
                }[item.errorLevel] || 'rgba(255,255,255,.6)'
                }
                format={value => (
                  <span
                    style={{
                      color:
                        item.errorLevel === 0
                          ? '#0097a4'
                          : 'rgba(255,255,255,0.6)',
                      fontWeight: 600
                    }}
                  >
                    {item.successRate && item.successRate.slice(0, item.successRate.length - 2)}%
                  </span>
                )}
              />
            </div>
            <p
              className={styles.fz10}
              style={{
                textAlign: 'center',
                position: 'absolute',
                color:
                  item.errorLevel === 0 ? '#0097a4' : 'rgba(255,255,255,0.6)',
                width: 80,
                height: 28,
                left: -17,
                top: 40
              }}
            >
              成功率{item.isLow && '↓'}
            </p>
          </Col>
          <Col
            style={{
              textAlign: 'left',
              color:
                item.errorLevel === 0 ? '#0097a4' : 'rgba(255,255,255,0.6)',
              marginLeft: 10,
              marginTop: 2
            }}
          >
            {item.chainItemData &&
              item.chainItemData.map((item1, k1) => {
                return (
                  <p
                    key={k1}
                    style={{
                      position: 'relative',
                      width: 85,
                      height: 14,
                      marginBottom: 6
                    }}
                  >
                    <span
                      className={`${styles.fz10} ${styles.chainItemTopLetfText}`}
                    >
                      {item1.label}
                    </span>
                    <span
                      className={`${styles.fz10} ${styles.chainItemTopRightNum}`}
                    >
                      {item1.value}
                    </span>
                  </p>
                );
              })}
          </Col>
        </Row>
      </div>
      <div className={styles.chainItemBottom}>
        <div
          style={{
            display: 'inline-block',
            width: 72,
            background: '#001a32',
            position: 'relative',
            zIndex: 20000
          }}
        >
          <img
            style={{ width: 72 }}
            src={require(`./../../assets/${item.nodeType === 1 && item.errorLevel === 0
              ? 'e2e_chain_tech_normal'
              : item.nodeType === 1 && item.errorLevel === 1
                ? 'e2e_chain_tech_warn'
                : item.nodeType === 1 && item.errorLevel === 2
                  ? 'e2e_chain_tech_error'
                  : item.nodeType === 1 && item.errorLevel === 3
                    ? 'e2e_chain_tech_config'
                    : item.nodeType === 0 && item.errorLevel === 0
                      ? 'e2e_chain_business_normal'
                      : item.nodeType === 0 && item.errorLevel === 1
                        ? 'e2e_chain_business_warn'
                        : item.nodeType === 0 && item.errorLevel === 2
                          ? 'e2e_chain_business_error'
                          : 'e2e_chain_business_config'
              }.png`)}
            alt="img"
          />
        </div>

        <p className={styles.chainItemLabel} title={item.nodeName}>
          {item.nodeName}
        </p>
        {item.duration && (
          <p className={`${styles.chainItemTime} ${styles.fz10}`}>
            持续时间：{item.duration}分钟
          </p>
        )}
      </div>
    </div>
  );
  if (item.errorInfos &&
    item.errorInfos[0] &&
    item.errorInfos[0].errorInfo === '') {
    return node;
  }
  return (
    <Tooltip
      title={item.errorInfos &&
        item.errorInfos[0] &&
        item.errorInfos[0].errorInfo}
    >
      {node}
    </Tooltip>
  );

};
