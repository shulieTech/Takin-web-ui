import { Card, Col, Divider, Form, Input, InputNumber, message, Row, Table, Transfer } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { TableRowSelection } from 'antd/lib/table';
import { difference } from 'lodash';
import { CommonModal, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import styles from '../index.less';
import TableTitle from 'src/common/table-title/TableTitle';
import AppManageService from '../service';
const InputGroup = Input.Group;
interface Props {
  btnText?: string | React.ReactDOM;
  service: any;
}
const getInitState = () => ({
  detial: {
    valueType1Level1: 0,
    valueType1Level2: 0,
    valueType2Level1: 0,
    valueType2Level2: 0,
    valueType4Level1: 0,
    valueType4Level2: 0,
  },
});
export type WhiteListScopeModalState = ReturnType<typeof getInitState>;
const SetModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<WhiteListScopeModalState>(
    getInitState()
  );
  const formItemProps: FormItemProps = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
  };
  const onClick = async () => {
    const {
      data: { data, success }
    } = await AppManageService.configurationread({
      service: props.service
    });
    if (success) {
      setState({
        detial: data
      });
      return;
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
        } = await AppManageService.configurationwrite({
          ...values,
          service: props.service
        });
        if (success) {
          resolve(true);
          message.success('保存成功');
          setState({
            detial: {
              valueType1Level1: 0,
              valueType1Level2: 0,
              valueType2Level1: 0,
              valueType2Level2: 0,
              valueType4Level1: 0,
              valueType4Level2: 0,
            }
          });
          return;
        }
        resolve(false);
      });
    });
  };
  return (
    <CommonModal
      modalProps={{
        width: 1096,
        title: '瓶颈等级设置'
      }}
      btnProps={{ type: 'link' }}
      btnText="设置"
      onClick={onClick}
      beforeOk={handleSubmit}
    >
      <Form onSubmit={handleSubmit} {...formItemProps}>
        <Card bordered={false}>
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
                    initialValue: state.detial.valueType1Level1
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
                    initialValue: state.detial.valueType1Level2
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
                    initialValue: state.detial.valueType2Level1
                  })(
                    <InputNumber
                      style={{ width: '70%' }}
                      placeholder="请填写"
                      min={0}
                      max={100}
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
                    initialValue: state.detial.valueType2Level2
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
          <TableTitle title="慢SQL" />
          <div className={styles.line}>
            <Divider />
          </div>
          <Row style={{ marginLeft: 20, marginTop: 50 }}>
            <Col span={12}>
              <Form.Item
                label="一般瓶颈 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;响应时间高于"
              >
                <InputGroup compact>
                  {props.form.getFieldDecorator('valueType4Level1', {
                    initialValue: state.detial.valueType4Level1
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
                label="严重瓶颈 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;响应时间高于"
              >
                <InputGroup compact>
                  {props.form.getFieldDecorator('valueType4Level2', {
                    initialValue: state.detial.valueType4Level2
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
        </Card>
      </Form>
    </CommonModal>
  );
};
export default Form.create()(SetModal);
