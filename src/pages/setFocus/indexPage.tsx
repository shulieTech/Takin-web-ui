import React, { useEffect, useState } from 'react';
import TableTitle from 'src/common/table-title/TableTitle';
import { Input, Form, Divider, message, Card, Row, Col, InputNumber, Button } from 'antd';
import { useStateReducer } from 'racc';
import MissionManageService from './service';
import styles from './index.less';
import { FormItemProps } from 'antd/lib/form';
import { NodeType } from './enum';
const InputGroup = Input.Group;

interface MissionManageProps {
  form: any;
}

const getInitState = () => ({
  detial: {
    valueType1Level1: 0,
    valueType1Level2: 0,
    valueType2Level1: 0,
    valueType2Level2: 0,
    canEdit: null
  },
});
export type MissionManageState = ReturnType<typeof getInitState>;

const MissionManage: React.FC<MissionManageProps> = props => {
  const [state, setState] = useStateReducer<MissionManageState>(getInitState());

  useEffect(() => {
    queryPatrolSceneAndDashbordList();
  }, []);

  /**
   * @name 获取巡检场景和看板列表
   */
  const queryPatrolSceneAndDashbordList = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.read({});
    if (success) {
      setState({
        detial: data
      });
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
        const {
          data: { success }
        } = await MissionManageService.write({ ...values });
        if (success) {
          resolve(true);
          message.success('保存成功');
          queryPatrolSceneAndDashbordList();
          return;
        }
        resolve(false);
      });
    });
  };

  const formItemProps: FormItemProps = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} {...formItemProps}>
        <Card bordered={false}>
          <h1 style={{ fontSize: '20px', marginBottom: 30 }}>瓶颈等级设置</h1>
          <TableTitle title="卡慢" />
          <div className={styles.line}>
            <Divider />
          </div>
          <Row style={{ marginLeft: 20, marginTop: 50 }}>
            <Col span={12}>
              <Form.Item
                label="一般瓶颈 &nbsp;&nbsp;&nbsp;&nbsp;响应时间高于"
              >
                <InputGroup compact>
                  {props.form.getFieldDecorator('valueType1Level1', {
                    initialValue: state.detial.valueType1Level1 || '1000'
                  })(
                    <InputNumber
                      style={{ width: '70%' }}
                      placeholder="请填写"
                      min={0}
                    />
                  )}
                  <Input style={{ width: '30%' }} defaultValue="ms" disabled />
                </InputGroup>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="严重瓶颈 &nbsp;&nbsp;&nbsp;&nbsp;响应时间高于"
              >
                <InputGroup compact>
                  {props.form.getFieldDecorator('valueType1Level2', {
                    initialValue: state.detial.valueType1Level2 || '3000'
                  })(
                    <InputNumber
                      style={{ width: '70%' }}
                      placeholder="请填写"
                      min={0}
                    />
                  )}
                  <Input style={{ width: '30%' }} defaultValue="ms" disabled />
                </InputGroup>
              </Form.Item>
            </Col>
          </Row>
          <TableTitle title="接口异常" />
          <div className={styles.line}>
            <Divider />
          </div>
          <Row style={{ marginLeft: 20, marginTop: 50 }}>
            <Col span={12}>
              <Form.Item
                label="一般瓶颈 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;成功率低于"
              >
                <InputGroup compact>
                  {props.form.getFieldDecorator('valueType2Level1', {
                    initialValue: state.detial.valueType2Level1 || '90'
                  })(
                    <InputNumber
                      style={{ width: '70%' }}
                      placeholder="请填写"
                      min={0}
                    />
                  )}
                  <Input style={{ width: '30%' }} defaultValue="%" disabled />
                </InputGroup>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="严重瓶颈 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;成功率低于"
              >
                <InputGroup compact>
                  {props.form.getFieldDecorator('valueType2Level2', {
                    initialValue: state.detial.valueType2Level2 || '70'
                  })(
                    <InputNumber
                      style={{ width: '70%' }}
                      placeholder="请填写"
                      min={0}
                    />
                  )}
                  <Input style={{ width: '30%' }} defaultValue="%" disabled />
                </InputGroup>
              </Form.Item>
            </Col>
          </Row>
          {
            state.detial.canEdit &&
            <div className={styles.footer}>
              <Button htmlType="submit" type="primary" style={{ float: 'right' }}>保存</Button>
            </div>
          }
        </Card>
      </Form>
    </div>
  );
};
export default Form.create()(MissionManage);
