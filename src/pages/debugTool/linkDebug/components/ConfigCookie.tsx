import { Col, Icon, Radio, Row } from 'antd';
import { CommonSelect } from 'racc';
import React, { Fragment } from 'react';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';
import { LinkDebugState } from '../indexPage';
import styles from './../index.less';
interface Props {
  state?: LinkDebugState;
  setState?: (value) => void;
  dictionaryMap?: any;
}
const ConfigCookie: React.FC<Props> = props => {
  const { state, setState } = props;

  const handleChangeCookie = value => {
    setState({
      cookies: value,
      isChanged: true
    });
  };

  return (
    <Fragment>
      <CodeMirrorWrapper
        onChange={
          state.pageStatus === 'query' ? () => true : handleChangeCookie
        }
        value={state.cookies}
        placeholder={`以 Key/Value 形式填写，Key 固定为 Cookie， 多个 Cookie用换行表示，如 : 
Cookie:token=NTBlZmZkZDAtNWRlMS00ZTI3; Path=/hello/; HttpOnly
Cookie:sid=LWE1ZDktZWU0NTExM2UwNmFk;Path=/order/; HttpOnly`}
      />
    </Fragment>
  );
};
export default ConfigCookie;
