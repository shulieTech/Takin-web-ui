import React, { Fragment, ReactNode } from 'react';
import { getTakinAuthority, MapBtnAuthority } from 'src/utils/utils';
interface Props {
  isShow?: boolean;
  authPath?: string;
}
const AuthorityBtn: React.FC<Props> = props => {
  if (getTakinAuthority() === 'false') {
    return <Fragment>{props.children}</Fragment>;
  }
  if (props.authPath) {
    return <>{MapBtnAuthority[props.authPath] && props.children}</>;
  }
  return <Fragment>{props.isShow && props.children}</Fragment>;
};
export default AuthorityBtn;
