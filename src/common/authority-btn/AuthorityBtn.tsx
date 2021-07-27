import React, { Fragment, ReactNode } from 'react';
import styles from './index.less';
interface Props {
  isShow: boolean;
}
const AuthorityBtn: React.FC<Props> = props => {
  return <Fragment>{props.isShow && props.children}</Fragment>;
};
export default AuthorityBtn;
