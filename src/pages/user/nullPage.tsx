import { Icon, Input, message, notification, Popover } from 'antd';
import { connect } from 'dva';
import { CommonForm } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment } from 'react';
import DvaComponent from 'src/components/basic-component/DvaComponent';
import UserService from 'src/services/user';
import request from 'src/utils/request';
import queryString from 'query-string';
import styles from './indexPage.less';
interface Props { }

const state = {};
type State = Partial<typeof state>;

@connect()
export default class NullPage extends DvaComponent<Props, State> {
  namespace = 'user';
  state = state;

  componentDidMount = () => {
    this.queryMenuList();
  };

  queryMenuList = async () => {
    const {
      data: { data, success }
    } = await UserService.oauthcallback({
      thirdParty: location.hash.split('?')[0].split('k/')[1],
      code: queryString.parse(location.hash.split('?')[1]).code
    });
  };

  render() {
    return (
      <div />
    );
  }
}
