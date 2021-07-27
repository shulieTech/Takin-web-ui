import React, { FC, CSSProperties } from 'react';
import Styles from '../index.less';
import classNames from 'classnames';
import { Button } from 'antd';
import { router } from 'umi';

interface CardProps {
  style?: CSSProperties;
  className?: string;
}

const AppNodeCard: FC<CardProps> = props => {
  const { className, style } = props;
  return (
    <div
      className={classNames(
        'pd-2x mg-b2x pointer flex',
        Styles['rounded-8px'],
        Styles['bg-white'],
        Styles['hover-shadow'],
        Styles['card-bg-yellow'],
        className
      )}
      style={style}
    >
      <div>
        <div
          className={classNames(
            'ft-ct mg-r2x',
            Styles.rounded,
            Styles['bg-yellow-100'],
            Styles['card-icon']
          )}
          style={{ width: 40, height: 40, lineHeight: '40px' }}
        >
          <span
            className={classNames(
              'ft-20 iconfont icon-yingyong',
              Styles['text-yellow-500']
            )}
          />
        </div>
      </div>
      <div className="flex-1">
        <div
          className={classNames(
            'pd-b1x',
            Styles['text-gray-600'],
            Styles['card-content']
          )}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae ipsam
          ipsa a aliquam cum doloremque voluptates rem provident officiis natus
          assumenda voluptatibus ratione, placeat perspiciatis, id facere
          corrupti rerum atque?
        </div>
        <div className="flex">
          <div className={classNames('flex-1')}>
            <span
              className={classNames(
                'mg-r2x ft-ct',
                Styles['bg-gray-100'],
                Styles['rounded-4px']
              )}
              style={{
                display: 'inline-block',
                lineHeight: '14px',
                width: 16,
                height: 16
              }}
            >
              «
            </span>
            <span>990 / 34.60</span>
          </div>
          <div
            className={classNames('flex-1 mg-l2x', Styles['text-yellow-500'])}
          >
            <span
              className={classNames(
                'mg-r2x ft-ct',
                Styles['bg-yellow-100'],
                Styles['rounded-4px']
              )}
              style={{
                display: 'inline-block',
                lineHeight: '14px',
                width: 16,
                height: 16
              }}
            >
              «
            </span>
            <span>990 / 34.60</span>
          </div>
        </div>

        <div className="flex mg-t2x">
          <Button
            type="dark"
            className={classNames('flex-1', Styles['card-btn'])}
          >
            应用详情
          </Button>
          <Button
            type="primary"
            className={classNames('flex-1', Styles['card-btn'])}
            onClick={() => {
              router.push('/visionalize/relation?id=111');
            }}
          >
            调用关系
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppNodeCard;
