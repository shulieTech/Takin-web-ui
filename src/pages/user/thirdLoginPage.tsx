/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import router from 'umi/router';
interface Props {
  location?: any;
}
const ThirdLogin: React.FC<Props> = props => {
  // const { location } = props;
  // const { query } = location;
  // const {  token, envCode, tenantCode } = query;
  function getURLParameter(name) {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    return params.get(name);
  }

  const token = getURLParameter('token');
  const envCode = getURLParameter('envCode');
  const tenantCode = getURLParameter('tenantCode');
  const departId = getURLParameter('departId');

  const storageList = [
    'troweb-role',
    'isAdmin',
    'troweb-userName',
    'full-link-token',
    'trowebUserResource',
    'trowebBtnResource',
    'auth-cookie',
    'troweb-expire',
    'troweb-userId',
    'trowebUserMenu',
    'takinAuthority',
    'Access-Token',
  ];
  storageList.forEach((item) => localStorage.removeItem(item));

  useEffect(() => {
    storageList.forEach((item) => localStorage.removeItem(item));
    if (token && envCode && tenantCode) {
      localStorage.setItem('full-link-token', token);
      localStorage.setItem('env-code', envCode);
      localStorage.setItem('tenant-code', tenantCode);
      localStorage.setItem('deptId', departId);
      router.push('#/');
    }
  }, []);

  return <Fragment />;
};
export default ThirdLogin;
