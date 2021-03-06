import React, { useState, useEffect } from 'react';
import { Alert, Icon, Tooltip } from 'antd';
import styles from '../index.less';
import classNames from 'classnames';
import { DOC_HELP_URL, DOC_UPDATE_URL, DOC_FEEDBACK_URL } from 'src/constants';
import service from './service';

const NewVersionHelp: React.FC = (props) => {
  const [isHover, setIsHover] = useState(false);
  const [isShowNewVersion, setIsShowNewVersion] = useState(false);
  const [machineError, setMachineError] = useState('');

  const checkShowNewVersion = async () => {
    const {
      data: { data, success },
    } = await service.checkNewVersion();
    if (success && data?.show) {
      setIsShowNewVersion(true);
    }
  };

  const confirmNewVersion = async () => {
    const {
      data: { data, success },
    } = await service.confirmNewVersion();
    if (success) {
      setIsShowNewVersion(false);
    }
  };

  const checkMachineStatus = async () => {
    const {
      data: { data, success },
    } = await service.checkMachineStatus();
    if (success) {
      setMachineError(data);
      return data;
    }
    return '';
  };

  useEffect(() => {
    (async () => {
      const data = await checkMachineStatus();
      if (!data) {
        checkShowNewVersion();
      }
    })();
  }, []);

  return (
    <>
      {machineError && (
        <Alert
          type="error"
          style={{
            border: 'none',
            backgroundColor: 'var(--FunctionalError-50, #FFF7F8)',
            borderRadius: 0,
          }}
          showIcon
          icon={
            <span
              className="iconfont icon-anquandefuben"
              style={{
                fontSize: 20,
                color: 'var(--FunctionalError-500, #F15F4A)',
                top: 6,
              }}
            />
          }
          message={
            <div>
              <span
                style={{
                  fontSize: 16,
                  marginRight: 8,
                  marginLeft: 8,
                  color: 'var(--Netural-14, #424242)',
                }}
              >
                ?????????????????????
              </span>
              <span
                style={{ marginRight: 8, color: 'var(--Netural/850, #414548)' }}
              >
                {machineError}
              </span>
            </div>
          }
        />
      )}
      {isShowNewVersion && (
        <Alert
          type="info"
          banner
          closable
          onClose={() => confirmNewVersion()}
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
                Takin??????????????????
              </span>
              <span style={{ color: '#666', marginRight: 8 }}>
                ????????????Takin???????????????????????????????????????????????????????????????
              </span>
              <a
                href={DOC_UPDATE_URL}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 14 }}
              >
                ????????????
              </a>
            </div>
          }
        />
      )}
      <div
        style={{
          position: 'fixed',
          bottom: 48,
          right: 24,
          zIndex: 2,
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={classNames(styles['icon-slide'], {
            [styles.active]: isHover,
          })}
        >
          <Tooltip title="Takin????????????" placement="left" arrowPointAtCenter>
            <a href={DOC_HELP_URL} target="_blank" rel="noreferrer">
              <Icon className={styles['icon-cycle']} type="file-text" />
            </a>
          </Tooltip>

          <Tooltip
            title="Takin??????????????????"
            placement="left"
            arrowPointAtCenter
          >
            <a href={DOC_UPDATE_URL} target="_blank" rel="noreferrer">
              <Icon className={styles['icon-cycle']} type="project" />
            </a>
          </Tooltip>

          <Tooltip title="????????????" placement="left" arrowPointAtCenter>
            <a href={DOC_FEEDBACK_URL} target="_blank" rel="noreferrer">
              <Icon className={styles['icon-cycle']} type="message" />
            </a>
          </Tooltip>
        </div>

        <Icon
          className={styles['icon-cycle']}
          type={isHover ? 'close' : 'question-circle'}
          onClick={() => setIsHover(!isHover)}
        />
      </div>
    </>
  );
};

export default NewVersionHelp;
