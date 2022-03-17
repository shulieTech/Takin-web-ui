import React, { useState, useEffect } from 'react';
import { Alert, Icon, Tooltip } from 'antd';
import styles from '../index.less';
import classNames from 'classnames';
import { DOC_HELP_URL, DOC_UPDATE_URL, DOC_FEEDBACK_URL } from 'src/constants';

const NewVersionHelp: React.FC = (props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <>
      <Alert
        type="info"
        banner
        closable
        icon={
          <Icon
            type="exclamation-circle"
            theme="filled"
            style={{ fontSize: 18 }}
          />
        }
        message={
          <div>
            <span style={{ fontSize: 16, marginRight: 8, marginLeft: 8 }}>
              Takin版本升级通知
            </span>
            <span style={{ color: '#666', marginRight: 8 }}>
              亲，您的Takin版本已是最新版，您可以点击链接查看功能变化
            </span>
            <a
              href={DOC_UPDATE_URL}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14 }}
            >
              版本详情
            </a>
          </div>
        }
      />
      <div
        style={{
          position: 'fixed',
          bottom: 48,
          right: 24,
          zIndex: 1,
        }}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={classNames(styles['icon-slide'], {
            [styles.active]: isHover,
          })}
        >
          <Tooltip title="Takin帮助中心" placement="left" arrowPointAtCenter>
            <a href={DOC_HELP_URL} target="_blank" rel="noreferrer">
              <Icon className={styles['icon-cycle']} type="file-text" />
            </a>
          </Tooltip>

          <Tooltip
            title="Takin功能变化路径"
            placement="left"
            arrowPointAtCenter
          >
            <a href={DOC_UPDATE_URL} target="_blank" rel="noreferrer">
              <Icon className={styles['icon-cycle']} type="project" />
            </a>
          </Tooltip>

          <Tooltip title="用户反馈" placement="left" arrowPointAtCenter>
            <a href={DOC_FEEDBACK_URL} target="_blank" rel="noreferrer">
              <Icon className={styles['icon-cycle']} type="message" />
            </a>
          </Tooltip>
        </div>

        <Icon
          className={styles['icon-cycle']}
          type={isHover ? 'close' : 'question-circle'}
        />
      </div>
    </>
  );
};

export default NewVersionHelp;
