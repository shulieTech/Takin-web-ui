import { Button, Card } from 'antd';
import React, { Fragment, useEffect } from 'react';
import AppAccessService from '../service';
import CardTitle from './CardTitle';
import styles from './../index.less';
import { router } from 'umi';
import moment from 'moment';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const liList = [1, 1, 1, 1, 1, 1, 1, 1];
const ThirdContent: React.FC<Props> = props => {
  const { state, setState } = props;
  useEffect(() => {
    // 自动轮播
    let timer = null;
    if (state.checkStatus === 0) {
      timer = setInterval(() => {
        next();
      }, 500);
    }
    return () => clearInterval(timer);
  }, [state.showIndex, state.checkStatus]);

  useEffect(() => {
    let timer1 = null;
    if (state.checkStatus === 0) {
      timer1 = setInterval(() => {
        handleCheckAppAccess();
      }, 5000);
    }
    return () => clearInterval(timer1);
  }, [state.checkStatus]);

  const next = () => {
    // 下一个
    let { showIndex } = state;
    if (showIndex >= 7) {
      showIndex = 0;
    } else {
      showIndex = showIndex + 1;
    }
    setState({
      showIndex
    });
  };

  const handleCheckAppAccess = async () => {
    if (!localStorage.getItem('checkDate')) {
      localStorage.setItem(
        'checkDate',
        moment()
          .locale('zh-cn')
          .format('YYYY-MM-DD HH:mm:ss')
      );
    }

    setState({
      checkStatus: 0
    });
    const {
      data: { success, data }
    } = await AppAccessService.checkAppAccess({
      downloadScriptDate: state.downloadTime,
      projectName: state.appName,
      checkDate: localStorage.getItem('checkDate')
        ? localStorage.getItem('checkDate')
        : moment()
            .locale('zh-cn')
            .format('YYYY-MM-DD HH:mm:ss')
    });
    if (success) {
      if (data !== 0) {
        if (data === 1) {
          setState({
            checkStatus: data
          });
          setTimeout(() => {
            setState({
              visible: false,
              isReload: !state.isReload,
              downloadTime: null,
              checkStatus: null,
              currentStep: 0,
              appList: [], // 应用列表
              appName: null, // 应用名称
              stepIsDisabled: true, // 下一步是否禁用
              showIndex: 0, // 显示第几个dot
              selectedRowKeys: undefined
            });
            localStorage.removeItem('checkDate');
            router.push('/agentManage');
          }, 3000);
          return;
        }
        setState({
          checkStatus: data
        });
        return;
      }
    }
  };

  return (
    <Fragment>
      <Card title={<CardTitle title="确认重启应用" />} size="small">
        <Button
          type="primary"
          onClick={handleCheckAppAccess}
          disabled={state.checkStatus === null ? false : true}
        >
          确认已重启应用，开始检测
        </Button>
        <ul className={styles.ul} style={{ width: 488 }}>
          <li>
            点击后系统会进行探针检测，探针安装的任务，过程大约持续一分钟，请耐心等待
          </li>
          <li>
            若6分钟内未检测到探针，请前往检查 <br />
            [user.workspace]/pradarlog/{state.appName}/simulator.log日志文件
          </li>
          <li>若该窗口被关闭，您还可以前往「 探针列表 」查看探针状态</li>
        </ul>
      </Card>
      {state.checkStatus === 0
        ? renderLoadingStatus(state)
        : state.checkStatus === 1
        ? renderSuccessStatus()
        : state.checkStatus === 2
        ? renderFailStatus(state)
        : null}
    </Fragment>
  );
};

export default ThirdContent;

const renderLoadingStatus = state => {
  return (
    <div className={styles.loadingWrap}>
      <img
        style={{ width: 144, height: 144 }}
        src={require('./../../../assets/app_access_from.png')}
      />
      <ul className={`${styles.loadingLine} ${styles.ul} `}>
        {liList.map((item, k) => {
          return (
            <li
              key={k}
              className={`${styles.dot} ${
                k === state.showIndex ? styles.active : ''
              }`}
            />
          );
        })}

        <p className={styles.loadingInfo}>正在检测</p>
        <p className={styles.loadingDesc}>正在检测是否接入成功，请稍后</p>
      </ul>
      <img
        style={{ width: 144, height: 144 }}
        src={require('./../../../assets/app_access_to.png')}
      />
    </div>
  );
};

const renderFailStatus = state => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        style={{ width: 280 }}
        src={require('./../../../assets/app_access_fail.png')}
      />
      <ul className={`${styles.loadingLine} ${styles.ul}`}>
        <p className={styles.loadingInfo} style={{ marginTop: 0 }}>
          暂未检测到应用
        </p>
        <p
          className={styles.loadingDesc}
          style={{ width: 240, display: 'inline-block' }}
        >
          请前往检查
          <br />
          [user.workspace]/pradarlog/{state.appName}/simulator.log日志文件
        </p>
      </ul>
    </div>
  );
};

const renderSuccessStatus = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <img
        style={{ width: 144 }}
        src={require('./../../../assets/app_access_success.png')}
      />
      <ul className={`${styles.loadingLine} ${styles.ul}`}>
        <p className={styles.loadingInfo}>检测到探针正在安装</p>
        <p
          className={styles.loadingDesc}
          style={{ width: 240, display: 'inline-block' }}
        >
          将跳转至
          <span style={{ color: 'var(--Netural-14)' }}>「探针列表」</span>
          查看探针状态
        </p>
      </ul>
    </div>
  );
};
