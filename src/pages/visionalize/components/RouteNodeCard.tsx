import React, { FC, CSSProperties } from 'react';
import Styles from '../index.less';
import classNames from 'classnames';
import { Button } from 'antd';

interface CardProps {
  style?: CSSProperties;
  className?: string;
}

const RouteNodeCard: FC<CardProps> = props => {
  const { className, style } = props;
  return (
    <div
      className={classNames(
        'pd-2x mg-b2x pointer',
        Styles['rounded-8px'],
        Styles['bg-white'],
        Styles['hover-shadow'],
        Styles['card-bg-red'],
        className
      )}
      style={style}
    >
      <div
        className={classNames('flex', Styles['items-center'])}
      >
        订单域
        <span className="flex-1">
          <span
            className={classNames(
              'flt-rt ft-12',
              Styles['rounded-4px'],
              Styles.tag,
              Styles.red
            )}
            style={{ padding: '2px 4px' }}
          >
            瓶颈
          </span>
        </span>
      </div>

      <div className={classNames('pd-t1x pd-b1x', Styles['text-gray-600'])}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae ipsam
        ipsa a aliquam cum doloremque voluptates rem provident officiis natus
        assumenda voluptatibus ratione, placeat perspiciatis, id facere corrupti
        rerum atque?
      </div>

      <div
        className={classNames(
          'flex',
          Styles['bg-gray-100'],
          Styles['rounded-8px']
        )}
      >
        <div className="flex-1 pd-2x">
          <div className={classNames('ft-12', Styles['text-gray-300'])}>
            TPS
          </div>
          <div>
            <span
              className={classNames(
                'iconfont mg-r1x icon-huancun1 ft-20',
                Styles['text-green-500']
              )}
            />
            <span
              className={classNames(
                'ft-20',
                Styles['weight-700'],
                Styles['text-gray-500']
              )}
            >
              900
            </span>
          </div>
        </div>
        <div className="flex-1 pd-2x">
          <div className={classNames('ft-12', Styles['text-gray-300'])}>RT</div>
          <div>
            <span
              className={classNames(
                'iconfont mg-r1x icon-huancun1 ft-20',
                Styles['text-red-500']
              )}
            />
            <span
              className={classNames(
                'ft-20',
                Styles['weight-700'],
                Styles['text-gray-500']
              )}
            >
              900
            </span>
          </div>
        </div>
      </div>

      <div className="flex mg-t1x">
        <Button
          type="dark"
          className={classNames('flex-1', Styles['card-btn'])}
        >
          链路详情
        </Button>
        <Button
          type="primary"
          className={classNames('flex-1', Styles['card-btn'])}
        >
          链路监控详情
        </Button>
      </div>
    </div>
  );
};

export default RouteNodeCard;
