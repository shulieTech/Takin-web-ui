import { notification, Modal, message } from 'antd';
import UserService from 'src/services/user';
import router from 'umi/router';
import axios from 'axios';

const { troLogin, troLogout } = UserService;

export default {
  namespace: 'user',
  state: {
    userInfo: {},
    userAuthority: [],
    login: false
  },
  effects: {
    *login({ payload }, { call, put }) {
      const {
        data: { code, data, msg }
      } = yield call(troLogin, payload);
      if (code === 200) {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: data
          }
        });
        yield put({ type: 'getToken' });
      }
      // if (code === 300) {
      //   message.error(msg);
      // }
    },
    *troLogin({ payload }, { call, put }) {
      const {
        data: { success, data, error }
      } = yield call(troLogin, payload);
      if (success) {
        notification.success({
          message: '通知',
          description: '登录成功',
          duration: 1.5
        });
        // router.push('/linkMark');
        localStorage.setItem('troweb-userName', payload.username);
        localStorage.setItem('troweb-role', data.userType);
        localStorage.setItem('troweb-userId', data.id);
        localStorage.setItem('isAdmin', data.isAdmin);
        localStorage.setItem('isSuper', data.isSuper);
      }
    },
    *troLogout({ payload }, { call, put }) {
      const {
        data: { success, data, error }
      } = yield call(troLogout, payload);
      if (success) {
        localStorage.removeItem('troweb-role');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('troweb-userName');
        localStorage.removeItem('full-link-token');
        localStorage.removeItem('trowebUserResource');
        localStorage.removeItem('trowebBtnResource');
        localStorage.removeItem('auth-cookie');
        localStorage.removeItem('troweb-expire');
        localStorage.removeItem('trowebUserMenu');
        localStorage.removeItem('takinAuthority');
        localStorage.removeItem('Access-Token');
        localStorage.removeItem('isSuper');
        localStorage.removeItem('securityCenterDomain');
        yield put({
          type: 'updateState',
          payload: {
            userInfo: {},
            userAuthority: []
          }
        });

        const { data: json } = yield axios.get('./version.json');

        if (data && data.indexUrl) {
          // 登出接口有返回登录地址
          window.location.href = `${data.indexUrl}`;
          return;
        }  
        if (json.loginUrl) {
          // version.json中有配置的第三方登录地址
          window.location.href = json.loginUrl;
          return;
        }
        window.clearModal = () => {
          Modal.destroyAll();
          message.destroy();
        };
        window.clearModal();
        router.push('/login');
      }
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
