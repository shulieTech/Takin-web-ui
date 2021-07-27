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
const ConfigBody: React.FC<Props> = props => {
  const { state, setState, dictionaryMap } = props;
  const { DEBUG_HTTP_TYPE } = dictionaryMap;

  const handleChangeCode = value => {
    setState({
      body: value,
      isChanged: true
    });
  };

  const handleChangeRadio = value => {
    setState({
      radio: value,
      isChanged: true
    });
  };

  const handleChangeCodingFormat = value => {
    setState({
      codingFormat: value,
      isChanged: true
    });
  };

  const handleChangeType = value => {
    setState({
      type: value,
      isChanged: true
    });
  };
  return (
    <Fragment>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        className={styles.configBodyWrap}
        style={{ height: 40 }}
      >
        <Col>
          <Radio.Group
            disabled={state.pageStatus === 'query' ? true : false}
            onChange={e => handleChangeRadio(e.target.value)}
            value={state.radio}
          >
            <Radio value={0}>x-www-form-urlencoded</Radio>
            <Radio value={1}>raw</Radio>
          </Radio.Group>
          {state.radio === 1 && (
            <CommonSelect
              disabled={state.pageStatus === 'query' ? true : false}
              onChange={handleChangeType}
              style={{ width: 130 }}
              allowClear={false}
              dataSource={DEBUG_HTTP_TYPE || []}
              value={state.type}
              dropdownMatchSelectWidth={false}
            />
          )}
        </Col>

        <Col>
          <Row type="flex" align="middle">
            <Col>编码格式:</Col>
            <Col>
              <CommonSelect
                disabled={state.pageStatus === 'query' ? true : false}
                style={{ width: 80 }}
                onChange={handleChangeCodingFormat}
                allowClear={false}
                dataSource={[
                  { label: 'UTF-8', value: 'UTF-8' },
                  { label: 'GBK', value: 'GBK' }
                ]}
                value={state.codingFormat}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <CodeMirrorWrapper
        onChange={state.pageStatus === 'query' ? () => true : handleChangeCode}
        value={state.body}
        placeholder={
          state.radio === 0
            ? `不同键值对（Key/Value）以 JSON 格式填写，如：{“userId”:12,”userName”:”Shulie”}`
            : `请按照所选类型的格式输入`
        }
      />
    </Fragment>
  );
};
export default ConfigBody;
