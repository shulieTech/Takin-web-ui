import React, { useEffect, useState, Fragment } from 'react';
// import styles from './index.less';
import { getTakinAuthority } from 'src/utils/utils';
import TitleComponent from 'src/common/title';
import UserService from 'src/services/user';
import { Button, Col, Input, message, Modal, Row, Table } from 'antd';
import axios from 'axios';
import Form, { FormItemProps } from 'antd/lib/form';

interface EntryRuleProps {
  location?: { query?: any };
  dictionaryMap?: any;
}

const SystemInfo: React.FC<EntryRuleProps> = (props) => {
  const [fileList, setFileList] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('获取短信验证码');
  const [disabled, setDisabled] = useState(false);
  const [timers, settimers] = useState(60);

  useEffect(() => {
    handleClick();
    handleClicks();
  }, []);

  useEffect(() => {
    let timer = null;
    if (disabled) {
      timer = setInterval(() => {
        setDisabled(true);
        settimers(timers - 1);
        setText(`${timers}秒后可重发`);
        if (timers === 0) {
          clearInterval(timer);
          setDisabled(false);
          settimers(60);
          setText('获取短信验证码');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timers, disabled]);

  const handleClicks = async () => {
    const {
      data: { success, data },
    } = await UserService.bindList({});
    if (success) {
      setFileData(data);
    }
  };

  const handleClick = async () => {
    const { data: json } = await axios.get('./version.json');
    const {
      data: { success, data },
    } = await UserService.apiSys({
      version: JSON.stringify(json),
    });
    if (success) {
      setFileList(data.itemVos);
    }
  };

  const handleOk = async () => {
    props.form.validateFields(async (err, values) => {
      if (err) {
        message.info('请检查表单必填项');
        return;
      }
      const {
        data: { success, data },
      } = await UserService.bindPhone({
        userId: localStorage.getItem('troweb-userId'),
        ...values
      });
      if (success) {
        setVisible(false);
        message.success('绑定成功');
      }
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const sms = async () => {
    const {
      data: { success, data }
    } = await UserService.sms({
      phone: props.form.getFieldValue('phone'),
      type: 2
    });
    if (success) {
      setDisabled(true);
    }
  };

  const onClick = async (id, isBound) => {
    if (id !== -1) {
      if (isBound === 0) {
        const {
          data: { success, data },
        } = await UserService.bindurl({
          thirdPartyId: id
        });
        if (success) {
          window.open(data, 'newwindow', 'height=600, width=800, top=30%,left=30%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
        }
      } else {
        const {
          data: { success, data },
        } = await UserService.unbind({
          thirdPartyId: id
        });
        if (success) {
          message.error('解除绑定成功');
          handleClick();
        }
      }
    } else {
      if (isBound === 0) {
        props.form.resetFields();
        setVisible(true);
      } else {
        const {
          data: { success, data },
        } = await UserService.unbind({
          thirdPartyId: id
        });
        if (success) {
          message.error('解除绑定成功');
          handleClick();
        }
      }
    }
  };
  const formItemProps: FormItemProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const extra = (title) => {
    return (
      <Row style={{ display: title === '个人信息' ? 'block' : 'none' }}>
        {fileData &&
          fileData.map((item, index) => {
            return (
              <Button key={index} style={{ marginLeft: 10 }} onClick={() => onClick(item.id, item.isBound)}>
                {item.isBound === 1 ? '解绑' : '绑定'}
                {item.name}
              </Button>
            );
          })
        }
      </Row>
    );
  };

  return (
    <Fragment>
      <div style={{ padding: '10px 60px' }}>
        {fileList &&
          fileList.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display:
                    getTakinAuthority() === 'false' && item.title === '个人信息'
                      ? 'none'
                      : 'block',
                }}
              >
                <TitleComponent content={item.title} extra={extra(item.title)} />
                <Table
                  showHeader={false}
                  pagination={false}
                  dataSource={Object.entries(item.dataMap).map(
                    ([key, val]) => ({ key, val })
                  )}
                  style={{ marginLeft: 60, marginRight: 60, maxWidth: 800 }}
                  columns={[
                    { dataIndex: 'key', width: 200 },
                    {
                      dataIndex: 'val',
                      render: (texts) => (
                        <span style={{ wordBreak: 'break-all' }}>
                          {texts || '-'}
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            );
          })}
      </div>
      <Modal
        title="修改手机号"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form onSubmit={handleOk} {...formItemProps}>
          <Form.Item
            label="手机号"
          >
            {props.form.getFieldDecorator('phone', {
              rules: [{ required: true, message: `请输入手机号` }],
            })(
              <Input addonBefore="中国+86" />
            )}
          </Form.Item>
          <Form.Item
            label="手机验证码"
          >
            <Row>
              <Col span={18}>
                {props.form.getFieldDecorator('code', {
                  rules: [{ required: true, message: `请输入手机验证码` }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="手机验证码"
                  />
                )}
              </Col>
              <Col span={6}>
                <div style={{ display: 'inline-block' }}>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="link"
                    onClick={sms}
                    disabled={disabled}
                  >
                    {text}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default Form.create()(SystemInfo);
