import {
  Col,
  Icon,
  Input,
  Tabs,
  notification,
  Popover,
  Row,
  Tooltip,
  Button,
  message,
} from 'antd';
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
import { getThemeByKeyName } from 'src/utils/useTheme';
import { encryptStr } from 'src/utils/encrypt';

const { TabPane } = Tabs;
interface Props {}

const state = {
  nums: null,
  color: null,
  rotate: null,
  fz: null,
  imgSrc: '',
  takinAuthority: null,
  arr: [],
  disabled: true,
  text: '获取短信验证码',
  settimer: 61,
  config: {
    loginType: null,
  },
  keyType: 1,
};
type State = Partial<typeof state>;
const getFormData = (that: Login): FormDataType[] => {
  const disableTenant = getThemeByKeyName('disableTenant');
  const usernamePlaceholder = disableTenant ? '请输入账号' : '用户名';
  return [
    {
      key: 'username',
      label: '',
      options: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入账号',
          },
        ],
      },
      node: (
        <Input
          className={styles.inputStyle}
          onChange={that.onBlur}
          prefix={<Icon type="user" className={styles.prefixIcon} />}
          // 人寿没有租户
          placeholder={usernamePlaceholder}
        />
      ),
    },
    {
      key: 'password',
      label: '',
      options: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入密码',
          },
        ],
      },
      node: (
        <Input
          className={styles.inputStyle}
          prefix={<Icon type="lock" className={styles.prefixIcon} />}
          placeholder="密码"
          type="password"
        />
      ),
    },
    {
      key: 'code',
      label: '',
      options: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入验证码',
          },
        ],
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
      ),
    },
  ];
};
const getFormDatatre = (that: Login): FormDataType[] => {
  return [
    {
      key: 'username',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入用户名',
          },
        ],
      },
      node: (
        <Input
          className={styles.inputStyle}
          onChange={that.onBlurs}
          placeholder="用户名"
        />
      ),
    },
    {
      key: 'code',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入手机验证码',
          },
        ],
      },
      node: (
        <Input
          style={{ width: 205 }}
          className={styles.inputStyle}
          prefix={<Icon type="safety" className={styles.prefixIcon} />}
          placeholder="手机验证码"
        />
      ),
      extra: (
        <div style={{ display: 'inline-block' }}>
          <Button
            style={{ marginLeft: 10 }}
            type="link"
            onClick={that.sms}
            disabled={that.state.disabled}
          >
            {that.state.text}
          </Button>
          <Tooltip title="验证码过期时间为10分钟">
            <Icon type="question-circle" style={{ marginLeft: 6 }} />
          </Tooltip>
        </div>
      ),
    },
  ];
};
const getFormDatas = (that: Login): FormDataType[] => {
  return [
    {
      key: 'phone',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入手机号',
          },
        ],
      },
      node: (
        <Input
          className={styles.inputStyle}
          addonBefore="中国+86"
          placeholder="手机号"
          onChange={that.onBlurs}
        />
      ),
    },
    {
      key: 'code',
      label: '',
      options: {
        rules: [
          {
            required: true,
            message: '请输入手机验证码',
          },
        ],
      },
      node: (
        <Input
          style={{ width: 205 }}
          className={styles.inputStyle}
          prefix={<Icon type="safety" className={styles.prefixIcon} />}
          placeholder="手机验证码"
        />
      ),
      extra: (
        <div style={{ display: 'inline-block' }}>
          <Button
            style={{ marginLeft: 10 }}
            type="link"
            onClick={that.sms}
            disabled={that.state.disabled}
          >
            {that.state.text}
          </Button>
          <Tooltip title="验证码过期时间为10分钟">
            <Icon type="question-circle" style={{ marginLeft: 6 }} />
          </Tooltip>
        </div>
      ),
    },
  ];
};
declare var serverUrl: string;

@connect()
export default class Login extends DvaComponent<Props, State> {
  namespace = 'user';
  state = state;

  componentDidMount = () => {
    this.queryMenuList();
    this.serverConfig();
    this.thirdParty(location.hash.split('=')[1]);
  };

  refresh = () => {
    this.queryCode();
  };

  thirdParty = async (tenantCode) => {
    const {
      data: { data, success },
    } = await UserService.thirdParty({
      tenantCode: tenantCode || undefined,
    });
    if (success) {
      this.setState({
        arr: data,
      });
    }
  };

  serverConfig = async () => {
    const {
      data: { data, success },
    } = await UserService.serverConfig({});
    if (success) {
      // if (data.domain) {
      //   if (_.endsWith(location.host, data.domain)) {
      //     const datas = await UserService.thirdParty({
      //       tenantCode: _.trimEnd(_.split(location.host, data.domain)[0], '.')
      //     });
      //     if (datas.data.success) {
      //       this.setState({
      //         arr: datas.data.data,
      //       });
      //     }

      //   }
      // }
      this.setState({
        config: data,
        keyType: data.loginType === 3 ? 1 : data.loginType,
      });
    }
  };

  sms = async () => {
    const obj = {};
    if (this.state.form.getFieldValue('phone')) {
      obj.phone = this.state.form.getFieldValue('phone');
      obj.type = 1;
      obj.loginType = this.state.keyType;
    } else {
      obj.username = this.state.form.getFieldValue('username');
      obj.type = 1;
      obj.loginType = this.state.keyType;
    }
    const {
      data: { success, data },
    } = await UserService.sms(obj);
    if (success) {
      const timer = setInterval(() => {
        this.setState(
          {
            disabled: true,
            settimer: this.state.settimer - 1,
          },
          () => {
            this.setState({
              text: `${this.state.settimer}秒后可重发`,
            });
            if (this.state.settimer === 0) {
              clearInterval(timer);
              this.setState({
                disabled: false,
                text: '获取短信验证码',
                settimer: 61,
              });
            }
          }
        );
      }, 1000);
    }
  };

  onBlur = async (e) => {
    if (e.target.value) {
      const code = _.split(e.target.value, '@');
      if (code.length > 1) {
        const {
          data: { data, success },
        } = await UserService.thirdParty({
          tenantCode: code[code.length - 1],
        });
        if (success) {
          this.setState({
            arr: data,
          });
        }
      }
    }
  };

  onBlurs = async (e) => {
    if (e.target.value) {
      this.setState({
        disabled: false,
      });
      const code = _.split(e.target.value, '@');
      if (code.length > 1) {
        const {
          data: { data, success },
        } = await UserService.thirdParty({
          tenantCode: code[code.length - 1],
        });
        if (success) {
          this.setState({
            arr: data,
          });
        }
      }
    }
  };

  queryMenuList = async () => {
    const {
      headers,
      data: { data, success },
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
        'Access-Token': localStorage.getItem('Access-Token'),
      },
    });

    const url = URL.createObjectURL(data);
    this.setState({
      imgSrc: url,
      takinAuthority: 'true',
    });
    localStorage.setItem('Access-Token', headers['access-token']);
  };

  handleSubmit = async (err, value) => {
    if (err) {
      return;
    }
    const {
      data: { success, data },
    } = await UserService.troLogin({
      ...value,
      loginType: this.state.keyType,
      password: encryptStr(value.password),
    });
    if (success) {
      notification.success({
        message: '通知',
        description: '登录成功',
        duration: 1.5,
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

  handleSubmits = async (err, value) => {
    if (err) {
      return;
    }
    const {
      data: { success, data },
    } = await UserService.trov2Login({
      ...value,
      loginType: this.state.keyType,
    });
    if (success) {
      notification.success({
        message: '通知',
        description: '登录成功',
        duration: 1.5,
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
    const wechatQRcode = getThemeByKeyName('wechatQRcode');
    return (
      <div style={{ position: 'relative', zIndex: 100000 }}>
        <p className={styles.wechat}>微信扫码联系</p>
        <img
          style={{ width: 100 }}
          src={wechatQRcode || require('./../../assets/wechat.png')}
        />
      </div>
    );
  };

  onClick = async (id) => {
    const {
      data: { success, data },
    } = await UserService.redirect({ thirdPartyId: id });
    if (success) {
      window.location.href = data;
    }
  };

  callback = (key) => {
    this.setState({
      keyType: key,
    });
  };

  render() {
    // 权限判断
    if (this.state.takinAuthority === null) {
      return <Loading />;
    }
    let dom = null;
    if (this.state.config.loginType === 1 || !this.state.config.loginType) {
      dom = (
        <Tabs
          tabBarGutter={0}
          onChange={this.callback}
          // tabBarExtraContent={<Popover
          //   content={this.content()}
          //   trigger="click"
          //   placement="top"
          // >
          //   <a>申请账号</a>
          // </Popover>}
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
                  type: 'primary',
                },
              }}
            />
          </TabPane>
        </Tabs>
      );
    } else if (this.state.config.loginType === 2) {
      dom = (
        <Tabs
          tabBarGutter={0}
          onChange={this.callback}
          // tabBarExtraContent={<Popover
          //   content={this.content()}
          //   trigger="click"
          //   placement="top"
          // >
          //   <a>申请账号</a>
          // </Popover>}
        >
          <TabPane tab="短信登录" key="2">
            <CommonForm
              formData={getFormDatas(this)}
              rowNum={1}
              onSubmit={this.handleSubmits}
              getForm={(f) => this.setState({ form: f })}
              btnProps={{
                isResetBtn: false,
                isSubmitBtn: true,
                submitText: '登录',
                submitBtnProps: {
                  style: { width: 329, marginTop: 20 },
                  type: 'primary',
                },
              }}
            />
          </TabPane>
        </Tabs>
      );
    } else if (this.state.config.loginType === 3) {
      dom = (
        <Tabs
          tabBarGutter={0}
          onChange={this.callback}
          // tabBarExtraContent={<Popover
          //   content={this.content()}
          //   trigger="click"
          //   placement="top"
          // >
          //   <a>申请账号</a>
          // </Popover>}
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
                  type: 'primary',
                },
              }}
            />
          </TabPane>
          <TabPane tab="短信登录" key="2">
            <CommonForm
              formData={getFormDatas(this)}
              rowNum={1}
              onSubmit={this.handleSubmits}
              getForm={(f) => this.setState({ form: f })}
              btnProps={{
                isResetBtn: false,
                isSubmitBtn: true,
                submitText: '登录',
                submitBtnProps: {
                  style: { width: 329, marginTop: 20 },
                  type: 'primary',
                },
              }}
            />
          </TabPane>
        </Tabs>
      );
    } else if (this.state.config.loginType === 4) {
      dom = (
        <Tabs
          tabBarGutter={0}
          onChange={this.callback}
          // tabBarExtraContent={<Popover
          //   content={this.content()}
          //   trigger="click"
          //   placement="top"
          // >
          //   <a>申请账号</a>
          // </Popover>}
        >
          <TabPane tab="短信登录" key="2">
            <CommonForm
              formData={getFormDatatre(this)}
              rowNum={1}
              onSubmit={this.handleSubmit}
              getForm={(f) => this.setState({ form: f })}
              btnProps={{
                isResetBtn: false,
                isSubmitBtn: true,
                submitText: '登录',
                submitBtnProps: {
                  style: { width: 329, marginTop: 20 },
                  type: 'primary',
                },
              }}
            />
          </TabPane>
        </Tabs>
      );
    }

    const loginPic = getThemeByKeyName('loginPic');

    return (
      <div className={styles.mainWrap}>
        {loginPic ? (
          <img className={styles.bg1} src={loginPic} />
        ) : (
          <>
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
            {/* <img
              className={styles.bg4}
              src={require('./../../assets/logo.png')}
            /> */}
          </>
        )}

        <div className={styles.main}>
          <div className={styles.login}>
            <p className={styles.sysName}>全链路压测</p>
            {dom}
            <center className={styles.other}>其他登录方式</center>
            <Row className={styles.otherimg} type="flex" justify="center">
              {this.state.arr.map((ite) => {
                return (
                  <Col key={ite.id} span={3}>
                    <a onClick={() => this.onClick(ite.id)}>
                      <img className={styles.img} src={ite.logo} />
                    </a>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
