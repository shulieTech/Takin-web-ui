import { Card, AutoComplete, Row, Col } from 'antd';
import React, { Fragment } from 'react';
import AgentVersionWrap from './AgentVersionWrap';
import CardTitle from './CardTitle';
import styles from './../index.less';
interface Props {}
const StepLineInfo: React.FC<Props> = props => {
  return (
    <div style={{ paddingLeft: 76 }}>
      {renderStep('Step1', '填写应用名称与选择版本')}
      <div style={{ marginTop: 35, marginLeft: 60, marginBottom: 75 }}>
        <Card
          title={
            <CardTitle
              title="填写应用"
              describe="请填写正确的应用名称，用于后续启动参数的生成"
            />
          }
          size="small"
        >
          <span
            style={{
              display: 'inline-block',
              width: 320,
              height: 40,
              lineHeight: '40px',
              border: '1px solid #E8E8E8',
              borderRadius: '2px',
              color: '#ABABAB',
              paddingLeft: 8
            }}
          >
            应用名称
          </span>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          title={<CardTitle title="选择探针版本" />}
          size="small"
        >
          <div style={{ marginTop: 10 }}>
            <AgentVersionWrap
              time="2020-10-10 10:00:00"
              version="V5.4.2.1"
              feature="3.修复了BUG新：kafuka1.0、pika1.1；2.数觉得"
            />
          </div>
        </Card>
      </div>
      {renderStep('Step2', '下载安装脚本并执行，重启应用')}
      <div style={{ marginTop: 35, marginLeft: 60, marginBottom: 75 }}>
        <div className={styles.scriptBorder}>
          <CardTitle
            title={<div style={{ width: 84 }}>下载安装脚本</div>}
            describe={<p>注：安装脚本1小时有效</p>}
          />
        </div>
        <Card
          style={{ marginBottom: 16 }}
          title={
            <CardTitle
              title={<div style={{ width: 56 }}>执行脚本</div>}
              describe={
                <p>
                  请在名称为
                  <span className={styles.tagBg}>App Name</span>
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
                <span className={styles.tagBg}>App Name</span>
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
      </div>
      {renderStep('Step3', '验证结果')}
      <div style={{ marginTop: 35, marginLeft: 60, marginBottom: 75 }}>
        <Card title={<CardTitle title="确认重启应用" />} size="small">
          <p style={{ color: 'var(--FunctionalNetural-300)', fontWeight: 600 }}>
            应用重启后
          </p>
          <ul className={styles.ul} style={{ width: 488 }}>
            <li>
              点击后系统会进行探针检测，探针安装的任务，过程大约持续一分钟，请耐心等待
            </li>
            <li>
              若6分钟内未检测到探针，请前往检查 <br />
              [user.workspace]/pradarlog/App Name/simulator.log日志文件
            </li>
            <li>若该窗口被关闭，您还可以前往「 探针列表 」查看探针状态</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
export default StepLineInfo;

const renderStep = (name, title) => {
  return (
    <Row type="flex">
      <Col className={styles.stepIcon}>{name}</Col>
      <Col style={{ marginLeft: 16 }} className={styles.stepTitle}>
        {title}
      </Col>
    </Row>
  );
};
