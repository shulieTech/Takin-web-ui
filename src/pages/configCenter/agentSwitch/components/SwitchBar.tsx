import React, { Fragment } from 'react';
import { Row, Col, Badge, Divider, Switch, Modal, Tooltip, Button } from 'antd';
import styles from './../index.less';
import WhitelistSwitchService from '../service';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const SwitchBar: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const menuAuthority: any =
    localStorage.getItem('trowebUserResource') &&
    JSON.parse(localStorage.getItem('trowebUserResource'));
  const { state, setState } = props;
  const { confirm } = Modal;
  const showModal = status => {
    const content =
      status === 'OPENED'
        ? `即时生效。请确保当前没有正在进行的压测，避免出现压测数据写入生产等异常。关闭后，探针将不区分压测流量，且无法采集监控日志。无法从平台发起压测流量的压测和调试`
        : `开启过程中请不要进行压测，避免出现压测数据写入生产等异常。`;
    confirm({
      content,
      title: '风险操作，谨慎处理',
      okType: 'danger',
      okText: status === 'OPENED' ? '确认关闭' : '确认开启',
      onOk() {
        status === 'OPENED' ? closeSwitchStatus() : openSwitchStatus();
      }
    });
  };

  /**
   * @name 开启agent开关
   */
  const openSwitchStatus = async () => {
    const {
      data: { data, success }
    } = await WhitelistSwitchService.openSwitchStatus({ silenceEnable: true });
    if (success) {
      setState({
        isReload: !state.isReload
      });
    }
  };

  /**
   * @name 关闭agent开关
   */
  const closeSwitchStatus = async () => {
    const {
      data: { data, success }
    } = await WhitelistSwitchService.closeSwitchStatus({
      silenceEnable: false
    });
    if (success) {
      setState({
        isReload: !state.isReload
      });
    }
  };

  return (
    <Row type="flex" className={styles.switchWrap} align="middle">
      <Col style={{ marginRight: 24 }}>
        <img
          style={{ width: 72 }}
          src={require('./../../../../assets/switch_icon.png')}
        />
      </Col>
      <Col
        style={{
          paddingTop: 10,
          marginRight: 64,
          fontFamily: 'PingFangSC-Semibold,PingFang SC',
          color: '#393B4F'
        }}
      >
        <p className={styles.switchLabel}>开关状态</p>
        <Badge
          text={
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              {state.switchStatus === 'OPENED' ? '已开启' : '已关闭'}
            </span>}
          color={
            state.switchStatus === 'OPENED'
              ? 'var(--BrandPrimary-500)'
              : 'var(--FunctionalError-500)'
          }
        />
      </Col>
      <Col style={{ paddingTop: 10 }}>
        <p className={styles.switchLabel}>状态说明</p>
        <p>{state.statusInfo}</p>
      </Col>
      <AuthorityBtn
        isShow={state.canEnableDisable}
      >
        <Col style={{ marginRight: 40, marginLeft: 40 }}>
          <Divider type="vertical" style={{ height: 51, marginTop: 10 }} />
        </Col>
        <Col style={{ paddingTop: 10 }}>
          <Button type="primary" onClick={() => showModal(state.switchStatus)}>
            {state.switchStatus === 'OPENED' ? '关闭' : '开启'}
          </Button>
        </Col>
      </AuthorityBtn>
    </Row>
  );
};
export default SwitchBar;
