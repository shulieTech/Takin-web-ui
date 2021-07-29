import React, { Fragment, ReactNode } from 'react';
import { getTakinAuthority } from 'src/utils/utils';
interface Props {
  isShow: boolean;
}
const AuthorityBtn: React.FC<Props> = props => {
  if (getTakinAuthority() === 'false') {
    return <Fragment>{props.children}</Fragment>;
  }
  return <Fragment>{props.isShow && props.children}</Fragment>;
};
export default AuthorityBtn;
