/**
 * @name
 * @author MingShined
 */
import { Select, Input, message, Form, Divider, Row, Col, Icon, Button, Tabs, Tooltip } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import TableTitle from 'src/common/table-title/TableTitle';
import { CommonForm, CommonModal, useStateReducer } from 'racc';
import copy from 'copy-to-clipboard';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import MissionManageService from '../service';
import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/javascript/javascript.js');
import styles from '../index.less';
const InputGroup = Input.Group;
const { Option } = Select;
interface Props extends CommonModelState {
  id?: string;
  row?: any;
  onSuccess: () => void;
  state?: any;
  btnText: string;
  type: string;
  setState?: (value) => void;
  form: any;
}
const NewKanbanModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    optionDisabled: true,
    details: {
      type: '0',
      boardId: '0',
      sceneId: '0',
      patrolSceneChainId: '',
      channel: '',
      hookUrl: '',
      contentType: ''
    },
    scriptCode: `
    {
        "msgtype": "text",
        "text": {
            "content":
   "瓶颈通知-任务信息:
   【巡检面板】：<slp>巡检面板</slp>
   【巡检场景】：<slp>巡检场景</slp>
   【巡检任务】：<slp>巡检任务</slp>
   
   瓶颈信息：
   【瓶颈结果】：<slp>瓶颈结果</slp>
   【瓶颈程度】：<slp>瓶颈程度</slp>
   【瓶颈 ID】： <slp>瓶颈ID</slp>
   【持续时间】：<slp>持续时间</slp>
   【瓶颈详情】：<slp>瓶颈详情</slp>
   【发现时间】：<slp>发现时间</slp> "
        }   
    }`,
    dingding: `
  {
      "msgtype": "text",
      "text": {
          "content":
 "瓶颈通知-任务信息:
 【巡检面板】：<slp>巡检面板</slp>
 【巡检场景】：<slp>巡检场景</slp>
 【巡检任务】：<slp>巡检任务</slp>
 
 瓶颈信息：
 【瓶颈结果】：<slp>瓶颈结果</slp>
 【瓶颈程度】：<slp>瓶颈程度</slp>
 【瓶颈 ID】： <slp>瓶颈ID</slp>
 【持续时间】：<slp>持续时间</slp>
 【瓶颈详情】：<slp>瓶颈详情</slp>
 【发现时间】：<slp>发现时间</slp> "
      }   
  }`,
    patrolSceneId: true,
    patrolDashbordDataSource: [],
    patrolSceneDataSource: [],
  });

  const getDetails = async () => {
    props.form.resetFields();
    setState({ details: props.row });
    if (props.row && props.row.template) {
      setState({ scriptCode: props.row.template });
      patrolBoardIds(props.row.boardId);
    }
    const {
      data: { data, success }
    } = await MissionManageService.queryPatrolSceneList({});
    if (success) {
      setState({
        patrolSceneId: true,
        patrolDashbordDataSource:
          data &&
          data.map((item, k) => {
            return {
              label: item.patrolBoardName,
              value: item.patrolBoardId
            };
          })
      });
    }

  };

  const patrolBoardIds = async value => {
    const {
      data: { data, success }
    } = await MissionManageService.queryList({
      patrolBoardId: value,
      current: 0,
      pageSize: 10
    });
    if (success) {
      setState({
        patrolSceneDataSource:
          data.map((item1, k1) => {
            return {
              label: item1.patrolSceneName,
              value: item1.patrolSceneId
            };
          }),
        patrolSceneId: false
      });
    }
  };

  const patrolBoardId = async value => {
    if (value === '0') {
      props.form.setFieldsValue({ patrolSceneId: '0' });
    } else {
      props.form.setFieldsValue({ patrolSceneId: '' });
      const {
        data: { data, success }
      } = await MissionManageService.queryList({
        patrolBoardId: value,
        current: 0,
        pageSize: 10
      });
      if (success) {
        setState({
          patrolSceneDataSource:
            data.map((item1, k1) => {
              return {
                label: item1.patrolSceneName,
                value: item1.patrolSceneId
              };
            }),
          patrolSceneId: false
        });
      }
    }
  };

  const handleSubmit = e => {
    return new Promise(async resolve => {
      props.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }

        if (state.scriptCode === '') {
          message.info('请检查推送内容');
          resolve(false);
          return;
        }

        const ajaxEvent = props.id
          ? MissionManageService.editMission({
            oldId: props.id,
            ...values,
            template: state.scriptCode
          })
          : MissionManageService.createMission({ ...values, template: state.scriptCode });

        const {
          data: { success }
        } = await ajaxEvent;
        if (success) {
          resolve(true);
          location.reload();
          return;
        }
        resolve(false);
      });
    });
  };

  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  /**
   * @name 修改文件脚本代码
   */
  const handleChangeCode = value => {
    setState({
      scriptCode: value
    });
  };

  const selectonChange = value => {
    if (value === '2') {
      setState({
        optionDisabled: false
      });
    } else {
      setState({
        optionDisabled: true
      });
    }
  };

  const testPush = () => {
    return new Promise(async resolve => {
      props.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }

        if (state.scriptCode === '') {
          message.info('请检查推送内容');
          resolve(false);
          return;
        }

        const ajaxEvent = MissionManageService.queryText({
          hookUrl: values.hookUrl,
          contentType: values.contentType,
          template: state.scriptCode
        });

        const { data } = await ajaxEvent;
        if (data.data.success) {
          resolve(true);
          message.success('测试成功');
          return;
        }
        message.error(data.data.message);
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      beforeOk={handleSubmit}
      modalProps={{
        width: 960,
        destroyOnClose: true,
        footer: [
          <Button key="back" onClick={testPush}>
            测试推送
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            提交
          </Button>]
      }}
      btnText={props.btnText}
      style={{ top: 20 }}
      btnProps={{ type: `${props.type}` }}
      onClick={getDetails}
    >
      <Form onSubmit={handleSubmit} layout="vertical">
        <TableTitle title="基础信息" />
        <div className={styles.line}>
          <Divider />
        </div>
        <Row style={{ marginLeft: 20 }}>
          <Col span={12}>
            <Form.Item
              label="瓶颈类型"
              required={true}
            >
              {props.form.getFieldDecorator('exceptionType', {
                initialValue: state.details ? `${state.details.type}` : [],
                rules: [{ required: true, message: '请选择瓶颈类型' }],
              })(
                <Select style={{ width: '80%' }} placeholder="请选择瓶颈类型">
                  {props.state.PATROL_EXCEPTION_TYPE && props.state.PATROL_EXCEPTION_TYPE.map(ite => {
                    return (
                      <Option value={ite.value} key={ite.value}>{ite.label}</Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="巡检看板"
              required={true}
            >
              {props.form.getFieldDecorator('patrolBoardId', {
                initialValue: state.details ? state.details.boardId || '0' : [],
                rules: [{ required: true, message: '请选择巡检看板' }],
              })(
                <Select style={{ width: '80%' }} onChange={patrolBoardId} placeholder="请选择巡检看板">
                  <Option value="0" key="0"> 全部</Option>
                  {state.patrolDashbordDataSource && state.patrolDashbordDataSource.map(ite => {
                    return (
                      <Option value={ite.value} key={ite.value}>{ite.label}</Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginLeft: 20 }}>
          <Col span={12}>
            <Form.Item
              label="巡检场景"
              required={true}
            >
              {props.form.getFieldDecorator('patrolSceneId', {
                initialValue: state.details ? state.details.sceneId || '0' : [],
                rules: [{ required: true, message: '请选择巡检场景' }],
              })(
                <Select style={{ width: '80%' }} disabled={state.patrolSceneId} placeholder="请选择巡检场景">
                  <Option value="0" key="0"> 全部</Option>
                  {state.patrolSceneDataSource && state.patrolSceneDataSource.map(ite => {
                    return (
                      <Option value={ite.value} key={ite.value}>{ite.label}</Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <TableTitle
          title="通知配置"
          tip={
            <Tooltip
              title={() => {
                return (
                  <div>
                    <p>通知配置说明：</p>
                    <p>
                      1.推送支持钉钉、企业微信、自定义三种，其中系统提供钉钉和企业微信模板，也可以按企业需求自定义推送模板；
                    </p>
                    <p>
                      2.您可以手动编辑需要推送的内容，其中{`<slp></spl>`}里的内容是系统定义好的参数，推送时会自动替换相应的内容，
                        不要更改，否则无法获取正确内容。
                    </p>
                  </div>
                );
              }}
            >
              <Icon type="exclamation-circle" />
            </Tooltip>
          }
        />
        <div className={styles.line}>
          <Divider />
        </div>
        <Row style={{ marginLeft: 20 }}>
          <Col span={12}>
            <Form.Item
              label="通知渠道"
              required={true}
            >
              {props.form.getFieldDecorator('channel', {
                initialValue: state.details ? `${state.details.channel}` : '0',
                rules: [{ required: true, message: '请选择通知渠道' }],
              })(
                <Select style={{ width: '80%' }} placeholder="请选择通知渠道" onChange={selectonChange}>
                  {props.state.NOTIFY_CHANNEL && props.state.NOTIFY_CHANNEL.map(ite => {
                    return (
                      <Option value={ite.value} key={ite.value}>{ite.label}</Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="推送URL"
              required={true}
            >
              {props.form.getFieldDecorator('hookUrl', {
                initialValue: state.details ? state.details.hookUrl : '',
                rules: [{ required: true, message: '请输入推送URL' }],
              })(
                <Input placeholder="请输入推送URL" style={{ width: '80%' }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginLeft: 20 }}>
          <Col span={12}>
            <Form.Item
              label="Content-Type"
              required={true}
            >
              {props.form.getFieldDecorator('contentType', {
                initialValue: state.details ? state.details.contentType : 'UTF-8',
                rules: [{ required: true, message: '请选择Content-Type' }],
              })(
                <Select style={{ width: '80%' }} placeholder="请选择Content-Type">
                  <Option value="UTF-8">UTF-8</Option>
                  <Option value="GBK" disabled={state.optionDisabled}>GBK</Option>
                  <Option value="GB2312" disabled={state.optionDisabled}>GB2312</Option>
                  <Option value="UTF-16" disabled={state.optionDisabled}>UTF-16</Option>
                  <Option value="ISO-8859-1" disabled={state.optionDisabled}>ISO-8859-1</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginLeft: 20 }}>
          <Col span={24}>
            <Form.Item
              label={
                <span>
                  推送内容&nbsp;
                  <Tooltip
                    trigger="click"
                    title={() => {
                      return (
                        <div>
                          <div style={{ textAlign: 'right' }}>
                            <a
                              onClick={() => handleCopy(
                                state.dingding)}
                            >
                              复制
                            </a>
                          </div>
                          <div
                            style={{
                              maxHeight: 900,
                              minHeight: 200,
                              overflow: 'scroll'
                            }}
                          >
                            {state.dingding}
                          </div>
                        </div>
                      );
                    }}
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              required={true}
            >
              <CodeMirror
                className={styles.codeMirror}
                value={state.scriptCode}
                options={{
                  mode: 'javascript',
                  theme: 'neat',
                  lineNumbers: true
                }}
                onBeforeChange={(editor, data, value) => {
                  handleChangeCode(value);
                }}
                onChange={(editor, data, value) => {
                  handleChangeCode(value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  );
};
export default Form.create()(NewKanbanModal);
