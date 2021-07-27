import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Styles from './index.less';
import classNames from 'classnames';
import { Alert, Select, Tooltip, Button, Row, Col, Input, Icon } from 'antd';
import RouteNodeCard from './components/RouteNodeCard';
import AppNodeCard from './components/AppNodeCard';

const { Option } = Select;

export default props => {
  return (
    <div
      className={classNames('pd-2x', Styles['bg-gray-100'])}
      style={{ minHeight: '100%' }}
    >
      <div>
        <Header />
        <div
          className={classNames(
            'pd-2x mg-t2x mg-b2x',
            Styles['bg-white'],
            Styles['rounded-8px'],
            Styles.shadow
          )}
        >
          <Alert
            type="error"
            showIcon
            icon={
              <span
                className="iconfont icon-anquandefuben ft-20"
                style={{ lineHeight: 1, top: 8.5, left: 12 }}
              />
            }
            message={
              <span>
                <span
                  className={classNames(
                    'ft-16 mg-r2x',
                    Styles['text-gray-900'],
                    Styles['weight-600']
                  )}
                >
                  全链路概况
                </span>
                <span className={classNames('mg-r1x', Styles['text-gray-400'])}>
                  链路总数
                </span>
                <span
                  className={classNames(
                    'ft-16 mg-r2x',
                    Styles['text-gray-600'],
                    Styles['weight-700']
                  )}
                >
                  23
                </span>
                <span className={classNames('mg-r1x', Styles['text-gray-400'])}>
                  链路总数
                </span>
                <span
                  className={classNames(
                    'ft-16 mg-r2x',
                    Styles['text-gray-600'],
                    Styles['weight-700']
                  )}
                >
                  23
                </span>
                <span className={classNames('mg-r1x', Styles['text-red-500'])}>
                  注意： 3 条链路处于异常状态 2 条应用处于 预警 状态
                </span>
              </span>
            }
          />
          <div className="mg-t2x">
            业务域：
            <Select style={{ width: 100 }}>
              <Option value="1">全部</Option>
            </Select>
            <span className="flt-rt">
              <Tooltip title="规则说明规则说明">
                <span className="pointer mg-r2x">
                  规则说明
                  <span
                    className={classNames(
                      'iconfont icon-jieshi-3 mg-l1x',
                      Styles['text-gray-400']
                    )}
                  />
                </span>
              </Tooltip>
              <a className="mg-r2x">重置</a>
              <span className="mg-r2x">
                状态：
                <Select style={{ width: 100 }}>
                  <Option value="1">全部</Option>
                </Select>
              </span>
              <span className="mg-r2x">
                刷新时间：
                <Select style={{ width: 100 }}>
                  <Option value="1">5min</Option>
                </Select>
              </span>
              <Button style={{ padding: '0 8px' }}>
                <Icon type="reload" />
              </Button>
            </span>
          </div>

          <div className={classNames('mg-t2x')}>
            <Row gutter={8}>
              <Col span={8}>
                <div
                  className={classNames(
                    'pd-2x',
                    Styles['bg-gray-100'],
                    Styles['rounded-8px']
                  )}
                >
                  <div>
                    链路
                    <span
                      className={classNames(
                        'flt-rt',
                        Styles['text-gray-400'],
                        Styles['weight-700']
                      )}
                    >
                      3
                    </span>
                  </div>
                  <Input.Search
                    className="mg-t2x mg-b2x"
                    placeholder="搜索链路"
                  />
                  <RouteNodeCard />
                </div>
              </Col>
              <Col span={8}>
                <div
                  className={classNames(
                    'pd-2x',
                    Styles['bg-gray-100'],
                    Styles['rounded-8px']
                  )}
                >
                  <div>
                    应用
                    <span
                      className={classNames(
                        'flt-rt',
                        Styles['text-gray-400'],
                        Styles['weight-700']
                      )}
                    >
                      3
                    </span>
                  </div>
                  <Input.Search
                    className="mg-t2x mg-b2x"
                    placeholder="搜索应用"
                  />
                  <AppNodeCard/>
                </div>
              </Col>
              <Col span={8}>
                <div
                  className={classNames(
                    Styles['bg-gray-100'],
                    Styles['rounded-8px']
                  )}
                >
                  1
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
