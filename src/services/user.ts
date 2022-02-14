import { httpGet, httpPost, httpPut } from 'src/utils/request';

declare var centerServerUrl: string;

const UserService = {
  async queryCodeImg(data) {
    const url = '/verification/code';
    return httpGet(url, data);
  },
  async troLogin(data) {
    const url = '/login';
    return httpPost(url, data);
  },
  async trov2Login(data) {
    const url = '/v2/login';
    return httpPost(url, data);
  },
  async troLogout(data) {
    const url = '/logout';
    return httpGet(url, data);
  },
  async updatePassword(data) {
    const url = '/user/pwd/update';
    return httpPut(url, data);
  },
  async menuList(data) {
    const url = '/user/menu/list';
    return httpGet(url, data);
  },
  // menu key
  async queryUserResource(data) {
    const url = '/menu/keys';
    return httpGet(url, data);
  },
  // menu
  async queryMenuList(data) {
    const url = '/menu/list';
    return httpGet(url, data);
  },
  async queryHealth(data) {
    const url = '/health';
    return httpGet(url, data);
  },
  async queryBtnResource(data) {
    const url = '/menu/button';
    return httpGet(url, data);
  },
  async apiSys(data) {
    const url = '/sys';
    return httpGet(url, data);
  },
  async thirdParty(data) {
    const url = '/thirdParty/list';
    return httpGet(url, data);
  },
  async redirect(data) {
    const url = '/thirdParty/redirectUrl';
    return httpGet(url, data);
  },
  async bindList(data) {
    const url = '/user/bind/list';
    return httpGet(url, data);
  },
  async sms(data) {
    const url = '/sms';
    return httpPost(url, data);
  },
  async bindurl(data) {
    const url = '/user/bind/url';
    return httpGet(url, data);
  },
  async unbind(data) {
    const url = '/user/unbind';
    return httpPut(url, data);
  },
  async bindPhone(data) {
    const url = '/user/bind/phone';
    return httpPut(url, data);
  },
  async serverConfig(data) {
    const url = '/serverConfig';
    return httpGet(url, data);
  },
  async thirdPartylogin(data) {
    const url = '/thirdParty/user';
    return httpGet(url, data);
  },
};

export default UserService;
