import React, { Fragment, useEffect } from 'react';
import UserService from 'src/services/user';
import router from 'umi/router';
import menuList from 'src/common/menu';
import { flatten } from 'src/utils/utils';
interface Props {
  location?: any;
}
const Demo: React.FC<Props> = props => {
  const { location } = props;
  const { query } = location;
  const { SESSION } = query;

  useEffect(() => {
    if (SESSION) {
      localStorage.setItem('auth-cookie', `SESSION=${SESSION}`);
      queryUserResource();
      queryBtnResource();
    }

    if (!SESSION && !localStorage.getItem('trowebUserResource')) {
      queryUserResource();
    }

    if (!SESSION && !localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
  }, []);

  /**
   * @name 获取菜单权限
   */
  const queryUserResource = async () => {
    const {
      headers,
      data: { data, success }
    } = await UserService.queryUserResource({});
    if (success) {
      localStorage.setItem('trowebUserResource', JSON.stringify(data));
      if (!localStorage.getItem('troweb-role')) {
        localStorage.setItem('troweb-role', headers['x-user-type']);
      }
      if (!localStorage.getItem('troweb-expire')) {
        localStorage.setItem('troweb-expire', headers['x-expire']);
      }
    }
  };

  /**
   * @name 获取按钮权限
   */
  const queryBtnResource = async () => {
    const {
      data: { data, success }
    } = await UserService.queryBtnResource({});
    if (success) {
      localStorage.setItem('trowebBtnResource', JSON.stringify(data));
    }
  };

  return <div />;
};
export default Demo;
