import React, { Fragment, ReactNode } from 'react';
import styles from './index.less';
interface Props {
  isShow: boolean;
}
const AuthorityBtn: React.FC<Props> = props => {
  if (localStorage.getItem('takinAuthority') === 'false') {
    return <Fragment>{props.children}</Fragment>;
  }
  return <Fragment>{props.isShow && props.children}</Fragment>;
};
export default AuthorityBtn;
