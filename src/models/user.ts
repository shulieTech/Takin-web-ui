import { notification } from 'antd';
import UserService from 'src/services/user';
import router from 'umi/router';

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
      }
    },
    *troLogout({ payload }, { call, put }) {
      const {
        data: { success, data, error }
      } = yield call(troLogout, payload);
      if (success) {
        localStorage.removeItem('troweb-role');
        localStorage.removeItem('troweb-userName');
        localStorage.removeItem('full-link-token');
        localStorage.removeItem('trowebUserResource');
        localStorage.removeItem('trowebBtnResource');
        localStorage.removeItem('auth-cookie');
        localStorage.removeItem('troweb-expire');
        localStorage.removeItem('trowebUserMenu');
        localStorage.removeItem('takinAuthority');
        localStorage.removeItem('Access-Token');
        yield put({
          type: 'updateState',
          payload: {
            userInfo: {},
            userAuthority: []
          }
        });
        if (data && data.indexUrl) {
          location.href = `${data.indexUrl}`;
          return;
        }
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
