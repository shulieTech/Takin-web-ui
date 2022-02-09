import { Col, Icon, Input, Tabs, notification, Popover, Row } from 'antd';
import { connect } from 'dva';
import { CommonForm } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment } from 'react';
import Loading from 'src/common/loading';
import DvaComponent from 'src/components/basic-component/DvaComponent';
import UserService from 'src/services/user';
import request from 'src/utils/request';
import router from 'umi/router';
import queryString from 'query-string';
import _ from 'lodash';
import styles from './indexPage.less';
const { TabPane } = Tabs;
interface Props { }

const state = {
  nums: null,
  color: null,
  rotate: null,
  fz: null,
  imgSrc: '',
  takinAuthority: null,
  arr: []
};
type State = Partial<typeof state>;
const getFormData = (that: Login): FormDataType[] => {
  return [
    {
      key: 'username',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入账号'
          }
        ]
      },
      node: (
        <Input
          className={styles.inputStyle}
          onBlur={that.onBlur}
          prefix={<Icon type="user" className={styles.prefixIcon} />}
          placeholder="<用户名>@<企业别名>，例如： username@shulie"
        />
      )
    },
    {
      key: 'password',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入密码'
          }
        ]
      },
      node: (
        <Input
          className={styles.inputStyle}
          prefix={<Icon type="lock" className={styles.prefixIcon} />}
          placeholder="密码"
          type="password"
        />
      )
    },
    {
      key: 'code',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入验证码'
          }
        ]
      },
      node: (
        <Input
          style={{ width: 205 }}
          className={styles.inputStyle}
          prefix={<Icon type="safety" className={styles.prefixIcon} />}
          placeholder="验证码"
        />
      ),
      extra: (
        <div style={{ display: 'inline-block' }}>
          <img style={{ marginLeft: 16 }} src={that.state.imgSrc} />
          <span
            style={{ marginLeft: 8, cursor: 'pointer' }}
            onClick={that.refresh}
          >
            <Icon type="redo" />
          </span>
        </div>
      )
    }
  ];
};
declare var serverUrl: string;

@connect()
export default class Login extends DvaComponent<Props, State> {
  namespace = 'user';
  state = state;

  componentDidMount = () => {
    this.queryMenuList();
    this.thirdParty(location.hash.split('=')[1]);
  };

  refresh = () => {
    this.queryCode();
  };

  onBlur = async (e) => {
    const code = _.split(e.target.value, '@');
    const {
      data: { data, success }
    } = await UserService.thirdParty({
      tenantCode: code[code.length - 1]
    });
    if (success) {
      this.setState({
        arr: data,
      });
    }
  };

  thirdParty = async (tenantCode) => {
    const {
      data: { data, success }
    } = await UserService.thirdParty({
      tenantCode: tenantCode || undefined
    });
    if (success) {
      this.setState({
        arr: data,
      });
    }
  };

  queryMenuList = async () => {
    const {
      headers,
      data: { data, success }
    } = await UserService.queryHealth({});
    const headerTakin = headers['takin-authority'];
    if (headerTakin === 'true') {
      localStorage.setItem('takinAuthority', 'true');
      this.queryCode();
    }
    // 权限判断
    if (headerTakin === 'false') {
      router.push('#/');
    }
  };

  queryCode = async () => {
    const { data, status, headers } = await request({
      url: `${serverUrl}/verification/code`,
      responseType: 'blob',
      headers: {
        'Access-Token': localStorage.getItem('Access-Token')
      }
    });

    const url = URL.createObjectURL(data);
    this.setState({
      imgSrc: url,
      takinAuthority: 'true'
    });
    localStorage.setItem('Access-Token', headers['access-token']);
  };

  handleSubmit = async (err, value) => {
    if (err) {
      return;
    }
    const {
      data: { success, data }
    } = await UserService.troLogin({ ...value });
    if (success) {
      notification.success({
        message: '通知',
        description: '登录成功',
        duration: 1.5
      });
      localStorage.setItem('troweb-userName', data.name);
      localStorage.setItem('troweb-userId', data.id);
      localStorage.setItem('troweb-role', data.userType);
      localStorage.setItem('isAdmin', data.isAdmin);
      localStorage.setItem('isSuper', data.isSuper);
      localStorage.setItem('tenant-code', data.tenantCode);
      localStorage.setItem('env-code', data.envCode);
      localStorage.setItem('full-link-token', data.xToken);
      localStorage.setItem('troweb-expire', data.expire);
      localStorage.removeItem('Access-Token');
      router.push('/');
      return;
    }
    this.refresh();
  };

  content = () => {
    return (
      <div style={{ position: 'relative', zIndex: 100000 }}>
        <p className={styles.wechat}>微信扫码联系</p>
        <img
          style={{ width: 100 }}
          src={require('./../../assets/wechat.png')}
        />
      </div>
    );
  };

  render() {
    // 权限判断
    if (this.state.takinAuthority === null) {
      return <Loading />;
    }
    return (
      <div className={styles.mainWrap}>
        <img
          className={styles.bg1}
          src={require('./../../assets/login_bg.png')}
        />
        <img
          className={styles.bg2}
          src={require('./../../assets/login_bg2.png')}
        />
        <img
          className={styles.bg3}
          src={require('./../../assets/login_img.png')}
        />
        <img className={styles.bg4} src={require('./../../assets/logo.png')} />
        <div className={styles.main}>
          <div className={styles.login}>
            <p className={styles.sysName}>全链路压测</p>
            <Tabs
              tabBarGutter={0}
              tabBarExtraContent={<Popover
                content={this.content()}
                trigger="click"
                placement="top"
              >
                <a>申请账号</a>
              </Popover>}
            >
              <TabPane tab="SSO登录" key="1">
                <CommonForm
                  formData={getFormData(this)}
                  rowNum={1}
                  onSubmit={this.handleSubmit}
                  btnProps={{
                    isResetBtn: false,
                    isSubmitBtn: true,
                    submitText: '登录',
                    submitBtnProps: {
                      style: { width: 329, marginTop: 20 },
                      type: 'primary'
                    }
                  }}
                />
              </TabPane>
              <TabPane tab="短信登录" key="3">
                Content of Tab 3
              </TabPane>
            </Tabs>
            <center className={styles.other}>其他登录方式</center>
            <Row className={styles.otherimg} type="flex" justify="center">
              {
                this.state.arr.map(ite => {
                  return (
                    <Col key={ite.id} span={3}>
                      <img className={styles.img} src={ite.logo} />
                    </Col>
                  );
                })
              }
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
