import { Button, Card } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AppAccessContext } from '../indexPage';
import CardTitle from './CardTitle';
import styles from './../index.less';
import moment from 'moment';
import request, { getUrl } from 'src/utils/request';

interface Props {
  state: any;
  setState: (value: any) => void;
}
declare var serverUrl: string;
const SecondContent: React.FC<Props> = props => {
  const { state, setState } = props;
  const downloadFile = async fileName => {
    const { data, status, headers } = await request({
      url: getUrl(`/fast/agent/access/installScript/download`),
      responseType: 'blob',
      headers: {
        'x-token': localStorage.getItem('full-link-token'),
        'Auth-Cookie': localStorage.getItem('auth-cookie'),
        'tenant-code': localStorage.getItem('tenant-code'),
        'env-code': localStorage.getItem('env-code'),
      },
      params: {
        projectName: state.appName,
        urlPrefix: `${window.location.href.split('#')[0]}takin-web/api`,
        version: state.agentVersionInfo.version
      }
    });
    const blob = new Blob([data], {
      type: ``
    });

    // 获取heads中的filename文件名
    const downloadElement = document.createElement('a');
    // 创建下载的链接
    const href = window.URL.createObjectURL(blob);

    downloadElement.href = href;
    // 下载后文件名
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    // 点击下载
    downloadElement.click();
    // 下载完成移除元素
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
    window.URL.revokeObjectURL(href);
    setState({
      downloadTime: moment()
        .locale('zh-cn')
        .format('YYYY-MM-DD HH:mm:ss')
    });
  };

  return (
    <Fragment>
      <div className={styles.scriptBorder}>
        <CardTitle
          title={<div style={{ width: 84 }}>下载安装脚本</div>}
          describe={
            <p>
              注：安装脚本1小时有效
              <Button
                type="link"
                style={{ marginLeft: 16 }}
                onClick={() => downloadFile('agentInstall.sh')}
              >
                下载文件
              </Button>
            </p>
          }
        />
      </div>
      <div className={styles.card}>
        <Card
          style={{ marginBottom: 16 }}
          headStyle={{ height: 'inherits' }}
          title={
            <CardTitle
              title={<div style={{ width: 56 }}>执行脚本</div>}
              describe={
                <p>
                  请在名称为
                  <span className={styles.tagBg}>{state.appName}</span>
                  的应用所在服务器指定目录下
                  <span className={styles.tagBg}>[user.workspace]/</span>
                  执行探针安装脚本
                </p>
              }
            />
          }
          size="small"
        >
          <p className={styles.subTitle}>安装脚本执行后将：</p>
          <ul className={styles.ul}>
            <li>下载并解压探针包到该目录[user.workspace]/</li>
            <li>生成启动参数配置到[user.workspace]/startLinkAgent.txt</li>
          </ul>
        </Card>
      </div>

      <div className={styles.scriptBorder}>
        <CardTitle
          title={<div style={{ width: 84 }}>添加启动参数</div>}
          describe={
            <p>
              请将
              <span className={styles.tagBg}>
                [user.worvkspace]/startLinkAgent.txt
              </span>
              里的启动参数添加到
              <span className={styles.tagBg}>{state.appName}</span>
              的启动参数里
            </p>
          }
        />
      </div>
      <div className={styles.scriptBorder}>
        <CardTitle
          title={<div style={{ width: 56 }}>重启应用</div>}
          describe={<p>请重启目标应用以进行探针安装和结果验证</p>}
        />
      </div>
    </Fragment>
  );
};

export default SecondContent;
