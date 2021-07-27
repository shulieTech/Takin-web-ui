import React from 'react';
import { Button } from 'antd';
import Styles from '../index.less';
import classNames from 'classnames';

export default props => {
  return (
    <div
      className={classNames(
        'flex pd-2x',
        Styles['bg-white'],
        Styles.shadow,
        Styles['rounded-8px']
      )}
    >
      <div
        className={classNames(
          'ft-white ft-ct ft-24 mg-r2x',
          Styles['bg-green-500'],
          Styles.rounded
        )}
        style={{
          lineHeight: '64px',
          width: 64,
          height: 64,
          fontStyle: 'italic'
        }}
      >
        F
      </div>
      <div className="flex-1">
        <div className={classNames('ft-24', Styles['text-gray-800'])}>
          全链路监控
        </div>
        <div className={classNames(Styles['text-gray-300'], 'pd-t1x')}>
          全链路监控展示相关业务域内的「链路」、「应用」、「中间件」的性能情况
        </div>
      </div>
      <div className="mg-t1x mg-b1x">
        <Button type="primary">新增链路</Button>
      </div>
    </div>
  );
};
