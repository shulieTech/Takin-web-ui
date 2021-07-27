import { Col, Icon, Row, Tooltip } from 'antd';
import React, { Fragment } from 'react';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';
import { LinkDebugState } from '../indexPage';
import styles from './../index.less';
interface Props {
  state?: LinkDebugState;
  setState?: (value) => void;
  dictionaryMap?: any;
}
const ConfigHeader: React.FC<Props> = props => {
  const { state, setState, dictionaryMap } = props;

  const { DEBUG_HTTP_TYPE } = dictionaryMap;
  const { pageStatus } = state;
  const handleChangeCode = value => {
    setState({
      headers: value,
      isChanged: true
    });
  };
  return (
    <Fragment>
      <Row type="flex" className={styles.configHeaderWrap}>
        <Col>
          <span className={styles.keys}>Content-Type：</span>
          <span className={styles.values}>
            {`${
              state.radio === 0
                ? 'application/x-www-form-urlencoded'
                : state.type
              //  DEBUG_HTTP_TYPE &&
              //   DEBUG_HTTP_TYPE.filter((item, k) => {
              //     if (item.value === state.type) {
              //       return item;
              //     }
              //   })[0] &&
              //   DEBUG_HTTP_TYPE.filter((item, k) => {
              //     if (item.value === state.type) {
              //       return item;
              //     }
              //   })[0].label
            };charset=${state.codingFormat === 'GBK' ? 'GBK' : 'UTF-8'}`}
          </span>
          <Tooltip
            title="Content-Type 会根据请求 Body 里面的 Cotent-Type 来自动填写"
            trigger="click"
          >
            <Icon style={{ marginLeft: 8 }} type="question-circle" />
          </Tooltip>
        </Col>
        <Col style={{ marginLeft: 60 }}>
          <span className={styles.keys}>User-Agent:</span>
          <span className={styles.values}>
            PerfomanceTest
            <Tooltip
              title="后台会自动加上 User-Agent压测标，不可更改"
              trigger="click"
            >
              <Icon style={{ marginLeft: 8 }} type="question-circle" />
            </Tooltip>
          </span>
        </Col>
      </Row>
      <CodeMirrorWrapper
        onChange={state.pageStatus === 'query' ? () => true : handleChangeCode}
        value={state.headers}
        placeholder={`以 Key/Value 形式填写， 多对 Key/Value 用换行表示，如 :
key1:value1
key2:value2`}
        restProps={{ readOnly: 'nocursor' }}
      />
    </Fragment>
  );
};
export default ConfigHeader;
