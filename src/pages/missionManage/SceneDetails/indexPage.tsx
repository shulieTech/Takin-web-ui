/**
 * @name
 * @author MingShined
 */
import { connect } from 'dva';
import { ColumnProps } from 'antd/lib/table';
import { FormItemProps } from 'antd/lib/form';
import TableTitle from 'src/common/table-title/TableTitle';
import {
  Select,
  Divider,
  Cascader,
  Icon,
  Form,
  Input,
  InputNumber,
  Card,
  Button,
  Radio
} from 'antd';
import { CommonSelect, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import router from 'umi/router';
import MissionManageService from '../service';
import PressureTestSceneService from 'src/pages/pressureTestManage/pressureTestScene/service';
import { filter } from 'src/utils/utils';
import DragSortingTable from '../components/DragSortingTable';
import styles from '../index.less';

const InputGroup = Input.Group;
const { Option } = Select;
interface Props extends CommonModelState {
  btnText: string;
  applicationId: string;
  form: any;
  location: any;
}
const indexPage: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    patrolDashbordDataSource: null,
    dataSource: [],
    detials: {
      patrolBoardId: '',
      patrolPeriod: '',
      chainRequests: [],
      patrolSceneId: '',
      refType: '2',
      scriptId: '',
      refId: ''
    },
    select: {} as any,
    numbers: {} as any,
    value: 1,
    patrolPeriod: true,
    disabled: false,
    sceneType: '2',
    bussinessFlowAndScriptList: [],
    bussinessActivityAndScriptList: []
  });

  useEffect(() => {
    queryPatrolSceneAndDashbordList();
    queryBussinessActivityAndScript();
    queryBussinessFlowAndScript();
    queryTable();
  }, []);

  const queryTable = async () => {
    const { location } = props;
    const {
      data: { data, success }
    } = await MissionManageService.sceneDetail({ sceneId: location.query.id });
    if (success) {
      setState({ detials: data, sceneType: data.refType });
      if (location.query.type === 'edit') {
        setState({ disabled: false });
      } else {
        setState({ disabled: true });
      }
      if (data.patrolPeriod === 5) {
        setState({ value: 1 });
      } else {
        setState({ value: 2, patrolPeriod: false });
      }
    }
  };

  /**
   * @name 获取巡检场景和看板列表
   */
  const queryPatrolSceneAndDashbordList = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.queryPatrolSceneAndDashbordList({});
    if (success) {
      setState({
        patrolDashbordDataSource:
          data.boardResponseList &&
          data.boardResponseList.map((item, k) => {
            return {
              label: item.patrolBoardName,
              value: item.patrolBoardId
            };
          })
      });
    }
  };

  /**
   * @name 获取所有业务流程和脚本
   */
  const queryBussinessFlowAndScript = async () => {
    const {
      data: { success, data }
    } = await PressureTestSceneService.queryBussinessFlowAndScript({});
    if (success) {
      setState({
        bussinessFlowAndScriptList:
          data &&
          data.map((item, k) => {
            return {
              id: item.id,
              name: item.name,
              disabled: item.scriptList ? false : true,
              scriptList: item.scriptList
            };
          })
      });
    }
  };

  /**
   * @name 获取所有业务活动和脚本
   */
  const queryBussinessActivityAndScript = async () => {
    const {
      data: { success, data }
    } = await PressureTestSceneService.queryBussinessActivityAndScript({});
    if (success) {
      setState({
        bussinessActivityAndScriptList:
          data &&
          data.map((item, k) => {
            return {
              id: item.id,
              name: item.name,
              disabled: item.scriptList ? false : true,
              scriptList: item.scriptList
            };
          })
      });
    }
  };

  const formItemProps: FormItemProps = {
    labelCol: { span: 3 },
    wrapperCol: { span: 6 },
    style: { margin: '22px 0' }
  };

  const formItemProp: FormItemProps = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
    style: { margin: '22px 0' }
  };

  const handleSubmit = async e => {
    const result = state.detials;
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        const datas = state.dataSource.map((ite, ind) => {
          ite.activityOrder = ind;
          return ite;
        });
        result.patrolBoardId = values.patrolBoardId;
        result.patrolPeriod = values.patrolPeriod;
        result.chainRequests = datas;
        result.patrolSceneId = props.location.query.id;
        result.refId = values.scriptId[0];
        result.scriptId = values.scriptId[1];
        result.refType = values.refType;
        const {
          data: { data, success }
        } = await MissionManageService.sceneUpdate({ ...result });
        if (success) {
          router.push('/missionManage');
        }
      }
    });
  };

  const onChange = v => {
    setState({
      value: v.target.value
    });
    if (v.target.value === 1) {
      setState({ patrolPeriod: true });
      props.form.setFieldsValue({ patrolPeriod: '5' });
    } else {
      setState({ patrolPeriod: false });
      props.form.setFieldsValue({ patrolPeriod: '' });
    }
  };

  const handleChangeType = value => {
    setState({
      sceneType: value
    });
    props.form.setFieldsValue({
      refType: value
    });
  };

  const showid = [];
  if (state.detials.refId) {
    showid.push(`${state.detials.refId}`, Number(`${state.detials.scriptId}`));
  }

  return (
    <Card
      title="巡检场景详情"
      bordered={false}
      extra={<Button onClick={() => router.push('/missionManage')}>返回</Button>}
    >
      <TableTitle title="基本信息" />
      <div className={styles.line}>
        <Divider />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Item label="所属看板" required={true} {...formItemProps}>
          {props.form.getFieldDecorator('patrolBoardId', {
            rules: [{ required: true, message: '请选择所属看板' }],
            initialValue: state.detials.patrolBoardId || '1'
          })(
            <Select style={{ width: '100%' }}>
              {state.patrolDashbordDataSource &&
                state.patrolDashbordDataSource.map(ite => {
                  return (
                    <Option value={ite.value} key={ite.value}>
                      {ite.label}
                    </Option>
                  );
                })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="类型" required={true} {...formItemProps}>
          {props.form.getFieldDecorator('refType', {
            rules: [{ required: true, message: '请选择类型' }],
            initialValue: state.detials.refType || '2'
          })(
            <CommonSelect
              placeholder="请选择类型"
              dataSource={[
                {
                  label: '业务活动',
                  value: '1'
                },
                {
                  label: '业务流程',
                  value: '2'
                }
              ]}
              onChange={handleChangeType}
            />
          )}
        </Form.Item>
        <Form.Item label="脚本" required={true} {...formItemProps}>
          {props.form.getFieldDecorator('scriptId', {
            rules: [{ required: true, message: '请选择脚本' }],
            initialValue: state.detials.scriptId ? showid : []
          })(
            <Cascader
              allowClear={false}
              options={
                state.sceneType === '2'
                  ? state.bussinessFlowAndScriptList || []
                  : state.bussinessActivityAndScriptList || []
              }
              fieldNames={{
                label: 'name',
                value: 'id',
                children: 'scriptList'
              }}
              showSearch={{ filter }}
            />
          )}
        </Form.Item>
        <TableTitle title="周期管理" />
        <div className={styles.line}>
          <Divider />
        </div>
        <Form.Item label="巡检周期" required={true} {...formItemProp}>
          <Radio.Group onChange={onChange} value={state.value}>
            <Radio value={1}>默认巡检周期（5 秒）</Radio>
            <Radio value={2}>
              <InputGroup compact>
                {props.form.getFieldDecorator('patrolPeriod', {
                  initialValue: state.detials.patrolPeriod || '5'
                })(
                  <InputNumber
                    style={{ width: '90%' }}
                    placeholder="请填写"
                    min={5}
                    max={300}
                    disabled={state.patrolPeriod}
                  />
                )}
                <Input style={{ width: '10%' }} defaultValue="s" disabled />
              </InputGroup>
            </Radio>
          </Radio.Group>
        </Form.Item>
        <TableTitle title="场景链路信息" />
        <div className={styles.line}>
          <Divider />
        </div>
        <DragSortingTable location={props.location} setState={setState} />
        <div style={{ marginTop: 50 }} />
        <div
          className={styles.footer}
          style={{ display: state.disabled ? 'none' : 'block' }}
        >
          <Button htmlType="submit" type="primary" style={{ float: 'right' }}>
            保存
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Form.create()(indexPage);
